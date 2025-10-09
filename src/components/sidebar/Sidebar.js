import { FiChevronRight, FiFileText, FiGrid, FiLogOut, FiPlus, FiUser } from "react-icons/fi";
import logo from "../../assets/logo.svg"; // Update path if needed

export default function Sidebar() {
  const reviewers = [
    { name: "Data Scalability", color: "#3B82F6" }, // blue
    { name: "Quantitative Methods", color: "#F59E0B" }, // amber
    { name: "Advanced Database", color: "#10B981" }, // green
    { name: "Networking 2", color: "#8B5CF6" }, // violet
    { name: "Advanced Programming", color: "#EF4444" }, // red
    { name: "IAS", color: "#06B6D4" }, // cyan
  ];

  return (
    <aside className="w-72 bg-white p-6 rounded-r-3xl shadow-md flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-4">
        <img src={logo} alt="ReviewKita Logo" className="w-12 h-12 object-contain" /> {/* pinalaki */}
        <h2 className="font-bold text-l text-gray-800 tracking-wide">ReviewKita</h2> {/* mas malinaw at malaki */}
      </div>

      {/* Overview Label */}
      <p className=" font-semibold text-xs text-gray-400 tracking-wide mb-2 ml-[3.2rem]">OVERVIEW</p>

      {/* Navigation */}
      <nav className="space-y-1 mb-6">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-medium">
          <FiGrid size={20} />
          Dashboard
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-medium">
          <FiFileText size={20} />
          Reviewer
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-medium">
          <FiUser size={20} />
          Profile
        </button>
      </nav>

      <hr className="border-gray-200 mb-4" />

      {/* My Reviewers Header */}
      <div className="flex items-center justify-between text-xl font-bold text-gray-700 mb-3">
        <span>My Reviewers</span>
        <button className="text-gray-400 hover:text-gray-600">
          <FiPlus size={20} />
        </button>
      </div>

      {/* Reviewer List */}
      <ul className="space-y-3 mb-6 text-sm">
        {reviewers.map((r) => (
          <li
            key={r.name}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-all"
          >
            <div className="flex items-center gap-3">
              {/* Box color indicator */}
              <span
                className="w-4 h-4 rounded-md"
                style={{ backgroundColor: r.color }}
              />
              <span className="truncate font-medium text-gray-800">{r.name}</span>
            </div>
            <FiChevronRight size={14} className="text-gray-400" />
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button className="mt-auto bg-red-100 text-red-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-200 transition-all">
        <FiLogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
