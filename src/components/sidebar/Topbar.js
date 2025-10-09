import { FaSearch, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

export default function Topbar() {
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

      {/* 👤 Profile (Placeholder Only) */}
      <div className="flex items-center gap-2 cursor-pointer">
        {/* White person icon in gray circle */}
        <div className="w-9 h-9 flex items-center justify-center bg-gray-300 rounded-full">
          <FaUser className="text-white text-lg" />
        </div>

        {/* Dropdown arrow */}
        <FiChevronDown className="text-gray-600 text-sm" />
      </div>
    </div>
  );
}
