
import { FaSearch, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/userService";

export default function Topbar() {
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await getUserProfile();
        if (user?.profile_picture) {
          setProfilePic(`http://localhost:5000/${user.profile_picture}`);
        } else {
          setProfilePic(null);
        }
      } catch {
        setProfilePic(null);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="flex items-center justify-between mb-6 px-4">
      {/* 🔍 Search Bar */}
      <div className="relative w-[90%]">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      {/* 👤 Profile Picture or Icon */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            <FaUser className="text-white text-base" />
          )}
        </div>
        <FiChevronDown className="text-gray-600 text-xs" />
      </div>
    </div>
  );
}
