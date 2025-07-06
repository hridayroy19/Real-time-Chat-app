import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authuser, setAuthuser] = useState(null);
  const [onlineUser, setOnlineUse] = useState([]);
  const [socket, setSocket] = useState(null);

  const CheckAuth = async () => {
    try {
      const { data } = await axios.get("api/auth/");
      if (data.success) {
        setAuthuser(data.user);
        ConnectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // login function
  const Login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthuser(data.userData);
        ConnectSocket(data.userData);

        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Login successful");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // logout

  const Logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthuser(null);
    setOnlineUse([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("LogOut successful");
    socket.disconnect();
  };

  const UpdateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);

      if (data.success) {
        setAuthuser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // connact soket funtion to handle socket connectionand online user updates
  const ConnectSocket = (userData) => {
    if (userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connected();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUse(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
  }, [token]);

  const value = {
    axios,
    authuser,
    onlineUser,
    socket,
    Login,
    Logout,
    CheckAuth,
    UpdateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
