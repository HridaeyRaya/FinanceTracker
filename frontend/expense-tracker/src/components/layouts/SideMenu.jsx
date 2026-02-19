import React, { useContext, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar.jsx";
import EditProfileModal from "../layouts/EditProfileModal.jsx";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      if (clearUser) clearUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {/* User Info */}
      <div className="flex flex-col items-center gap-3 mt-3 mb-7">
        <div
          className="relative cursor-pointer group"
          onClick={() => setOpenEditProfile(true)}
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile Image"
              className="w-20 h-20 bg-slate-300 rounded-full object-cover"
            />
          ) : (
            <CharAvatar
              fullName={user?.fullName || "Guest"}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-xs font-medium">Edit</span>
          </div>
        </div>

        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullName || "Guest"}
        </h5>

        {/* Edit Profile Button */}
        <button
          onClick={() => setOpenEditProfile(true)}
          className="text-xs text-primary hover:underline"
        >
          ✏️ Edit Profile
        </button>
      </div>

      {/* Menu Items */}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition cursor-pointer
            ${activeMenu === item.label ? "text-white bg-primary" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}

      {/* Edit Profile Modal */}
      {openEditProfile && (
        <EditProfileModal onClose={() => setOpenEditProfile(false)} />
      )}
    </div>
  );
};

export default SideMenu;