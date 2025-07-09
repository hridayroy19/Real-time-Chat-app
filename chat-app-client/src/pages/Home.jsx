import React, { useState } from "react";
import RightSideBar from "../component/RightSideBar";
import ChatContainer from "../component/ChatContainer";
import Sidebar from "../component/Sidebar";
import { Toaster } from "react-hot-toast";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(false);
  return (
    <div className="border  w-full h-screen sm:px-[15%] sm:py-[5%] ">
            <Toaster position="top-right" />

      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSideBar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
};

export default Home;
