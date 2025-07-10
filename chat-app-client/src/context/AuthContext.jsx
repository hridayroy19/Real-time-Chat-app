/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authuser, setAuthuser] = useState(null);
  const [onlineUser, setOnlineUse] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/user/auth/check");
      if (data.success) {
        setAuthuser(data?.user);
        ConnectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/user/auth/${state}`, credentials,{
         withCredentials: true,
      });

      console.log("API response data:", data);
      if (data.success) {
        setAuthuser(data.user);
        ConnectSocket(data.user);

        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Login successful");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthuser(null);
    setOnlineUse([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("LogOut successful");
    socket?.disconnect();
  };

  const UpdateProfile = async (body) => {
    try {
      const { data } = await axios.put("/auth/update-profile", body);
      if (data.success) {
        setAuthuser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const ConnectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUse(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, [token, checkAuth]);

  const value = {
    axios,
    authuser,
    onlineUser,
    socket,
    loading,
    login,
    logout,
    checkAuth,
    UpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
