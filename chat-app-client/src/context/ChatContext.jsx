/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessage, setUnseenMessage] = useState({});

  const { axios, socket } = useContext(AuthContext);

  // ✅ Get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/message/getusers");
      if (data?.users) {
        setUsers(data.users);
        setUnseenMessage(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Get messages between logged-in user and selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        setMessage(data.messages || []);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Send message to selected user
  const sendMessages = async (messageData) => {
    try {
      const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, messageData);
      console.log(data, "message");
      if (data.success) {
        setMessage((prevMessages) => [...prevMessages, data.data]); // 🔁 use correct response key
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Real-time incoming message listener
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessage((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/message/mark/${newMessage._id}`); // ✅ fixed endpoint
      } else {
        setUnseenMessage((prevUnseen) => ({
          ...prevUnseen,
          [newMessage.senderId]: prevUnseen[newMessage.senderId]
            ? prevUnseen[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // ✅ Remove real-time listener
  const unSubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    message,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessages,
    setSelectedUser,
    unseenMessage,
    setUnseenMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
