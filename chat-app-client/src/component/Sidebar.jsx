import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const {
    users,
    selectedUser,
    getUsers,
    unseenMessage,
    setUnseenMessage,
    setSelectedUser,
  } = useContext(ChatContext);

  const navigate = useNavigate();
  const { logout, onlineUser } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const filteredUsers = users.filter((user) => {
    const name = user.fullName || user.name || "";
    return name.toLowerCase().includes(input.toLowerCase());
  });

  useEffect(() => {
    getUsers();
  }, [onlineUser, getUsers]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/porfile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            value={input}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User.."
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex flex-col">
        {filteredUsers?.map((user) => {
          const name = user.fullName || user.name || "Unknown";

          return (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessage((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
              }`}
            >
              <img
                src={user.profilePic || assets.avatar_icon}
                alt="profilePic"
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{name}</p>
                {onlineUser?.includes(user._id) ? (
                  <span className="text-green-400 text-sm">online</span>
                ) : (
                  <span className="text-neutral-400 text-sm">offline</span>
                )}
              </div>

              {unseenMessage?.[user._id] > 0 && (
                <p className="absolute top-4 right-5 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                  {unseenMessage[user._id]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
