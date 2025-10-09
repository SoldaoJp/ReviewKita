// src/components/sidebar/Sidebar.js
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { useState, useEffect } from "react";
import { getAllReviewers } from "../../services/reviewerService.js";
import Logo from "../../assets/logo.png";
import Search from "../../assets/Search.svg";
import Plus from "../../assets/Plus.svg";
import DashboardIcon from "../../assets/Dashboard.svg";
import ReviewerIcon from "../../assets/reviewer.svg";
import ProfileIcon from "../../assets/Profile.svg";
import ForwardIcon from "../../assets/Forward.svg";

// Color palette for reviewer items
const colors = [
	"bg-blue-500",
	"bg-pink-500",
	"bg-purple-500",
	"bg-green-500",
	"bg-orange-500",
	"bg-red-500",
	"bg-yellow-500",
	"bg-indigo-500",
];

function Sidebar() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [reviewers, setReviewers] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch reviewers on component mount
	useEffect(() => {
		fetchReviewers();
	}, []);

	const fetchReviewers = async () => {
		try {
			setLoading(true);
			const response = await getAllReviewers(1, 10); // Get first 10 reviewers
			if (response.success) {
				setReviewers(response.data);
			}
		} catch (err) {
			console.error("Error fetching reviewers:", err);
		} finally {
			setLoading(false);
		}
	};

	const getColorForIndex = (index) => {
		return colors[index % colors.length];
	};

	const handleLogout = () => {
		logout();
		navigate('/login');
	};
	return (
		<div className="p-4 h-screen flex flex-col">
			<div className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 rounded-[25px] shadow-lg flex flex-col overflow-hidden">
				{/* Top: Logo + Main links */}
				<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
					   <div className="flex items-center gap-2 px-6 py-6">
						   {/* Logo SVG before text */}
						   <img
							   src={Logo}
							   alt="ReviewKita Logo"
							   className="h-7 w-7"
						   />
						   <span className="font-bold text-base text-gray-800">ReviewKita</span>
					   </div>

					   <nav className="mt-2 flex flex-col gap-1 px-3">
						   <NavLink
							   to="/dashboard"
							   className={({ isActive }) =>
								   `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${
									   isActive 
										   ? "bg-[#0062FF]/[0.05] font-semibold" 
										   : "text-gray-700 hover:bg-white/50"
								   }`
							   }
						   >
							   <img
								   src={DashboardIcon}
								   alt="Dashboard"
								   className={`h-4 w-4 mr-2 ${window.location.pathname === '/dashboard' ? 'text-[#2472B5] filter-blue' : ''}`}
								   style={window.location.pathname === '/dashboard' ? { filter: 'invert(34%) sepia(87%) saturate(747%) hue-rotate(184deg) brightness(92%) contrast(92%)' } : {}}
							   />
							   <span className={window.location.pathname === '/dashboard' ? 'text-black' : ''}>Dashboard</span>
						   </NavLink>

						   <NavLink
							   to="/reviewer"
							   className={({ isActive }) =>
								   `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${
									   isActive 
										   ? "bg-[#0062FF]/[0.05] font-semibold" 
										   : "text-gray-700 hover:bg-white/50"
								   }`
							   }
						   >
							   <img
								   src={ReviewerIcon}
								   alt="Reviewer"
								   className={`h-4 w-4 mr-2 ${window.location.pathname === '/reviewer' ? 'text-[#2472B5] filter-blue' : ''}`}
								   style={window.location.pathname === '/reviewer' ? { filter: 'invert(34%) sepia(87%) saturate(747%) hue-rotate(184deg) brightness(92%) contrast(92%)' } : {}}
							   />
							   <span className={window.location.pathname === '/reviewer' ? 'text-black' : ''}>Reviewer</span>
						   </NavLink>

						   <NavLink
							   to="/profile"
							   className={({ isActive }) =>
								   `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${
									   isActive 
										   ? "bg-[#0062FF]/[0.05] font-semibold" 
										   : "text-gray-700 hover:bg-white/50"
								   }`
							   }
						   >
							   <img
								   src={ProfileIcon}
								   alt="Profile"
								   className={`h-4 w-4 mr-2 ${window.location.pathname === '/profile' ? 'text-[#2472B5] filter-blue' : ''}`}
								   style={window.location.pathname === '/profile' ? { filter: 'invert(34%) sepia(87%) saturate(747%) hue-rotate(184deg) brightness(92%) contrast(92%)' } : {}}
							   />
							   <span className={window.location.pathname === '/profile' ? 'text-black' : ''}>Profile</span>
						   </NavLink>
					   </nav>

					{/* My Reviewers */}
					   <div className="mt-8 px-6">
						   <div className="flex items-center justify-between mb-3">
							   <h3 className="text-gray-800 text-xs font-bold">
								   My Reviewers
							   </h3>
							   <div className="flex items-center gap-1">
								   {/* Search Icon from assets */}
								   <button className="p-1 rounded-lg hover:bg-white/50 transition-colors">
									   <img
										   src={Search}
										   alt="Search"
										   className="h-3 w-3"
									   />
								   </button>
								   {/* Plus Icon from assets */}
								   <button 
									   className="p-1 rounded-lg hover:bg-white/50 transition-colors"
									   onClick={() => navigate('/reviewer')}
								   >
									   <img
										   src={Plus}
										   alt="Add"
										   className="h-3 w-3"
									   />
								   </button>
							   </div>
						   </div>
						   <div className="flex flex-col gap-1">
							   {loading ? (
								   <p className="text-xs text-gray-500 text-center py-2">Loading...</p>
							   ) : reviewers.length === 0 ? (
								   <p className="text-xs text-gray-500 text-center py-2">No reviewers yet</p>
							   ) : (
								   reviewers.map((reviewer, index) => (
									   <NavLink
										   key={reviewer._id}
										   to={`/reviewer/${reviewer._id}`}
										   className={({ isActive }) =>
											   `flex items-center gap-1 px-2 py-1 rounded-xl justify-between transition-all text-xs ${
												   isActive 
													   ? "bg-white/70 shadow-sm" 
													   : "hover:bg-white/40"
											   }`
										   }
									   >
										   <div className="flex items-center gap-1">
											   <span
												   className={`w-2 h-2 rounded-full ${getColorForIndex(index)}`}
											   ></span>
											   <span className="text-xs text-gray-700 truncate">{reviewer.title}</span>
										   </div>
										   <img
											   src={ForwardIcon}
											   alt="Forward"
											   className="h-3 w-3 opacity-60"
										   />
									   </NavLink>
								   ))
							   )}
						   </div>
					   </div>
				</div>

				{/* Bottom: Logout */}
				   <div className="px-6 py-4">
					   <button 
						   className="w-full py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg font-medium"
						   style={{ backgroundColor: '#FFB2B2', color: '#A40000', border: '2px solid #A40000' }}
						   onClick={handleLogout}
					   >
						   Logout
					   </button>
				   </div>
			</div>
		</div>
	);
}

export default Sidebar;
