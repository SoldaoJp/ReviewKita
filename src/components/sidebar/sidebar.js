// src/components/sidebar/Sidebar.js
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import Logo from "../../assets/logo.svg";
import Search from "../../assets/Search.svg";
import Plus from "../../assets/Plus.svg";
import DashboardIcon from "../../assets/Dashboard.svg";
import ReviewerIcon from "../../assets/reviewer.svg";
import ProfileIcon from "../../assets/Profile.svg";
import ForwardIcon from "../../assets/Forward.svg";

const subjects = [
	{
		name: "Data Scalability",
		color: "bg-blue-500",
		path: "/datascalability",
	},
	{
		name: "Quantitative Methods",
		color: "bg-pink-500",
		path: "/quantitative-methods",
	},
	{
		name: "Advanced Database",
		color: "bg-purple-500",
		path: "/advanced-database",
	},
	{
		name: "Networking 2",
		color: "bg-green-500",
		path: "/networking-2",
	},
	{
		name: "Advanced Programming",
		color: "bg-orange-500",
		path: "/advanced-programming",
	},
	{ name: "IAS", color: "bg-red-500", path: "/ias" },
];

function Sidebar() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};
	return (
		<div className="w-64 h-screen bg-white shadow-md flex flex-col justify-between">
			{/* Top: Logo + Main links */}
			<div>
				<div className="flex items-center gap-2 px-6 py-4 border-b">
					{/* Logo SVG before text */}
					<img
						src={Logo}
						alt="ReviewKita Logo"
						className="h-8 w-8"
					/>
					<span className="font-bold text-lg">ReviewKita</span>
				</div>

				<nav className="mt-4 flex flex-col gap-1">
					<NavLink
						to="/dashboard"
						className={({ isActive }) =>
							`flex items-center px-6 py-2 hover:bg-gray-100 ${
								isActive ? "bg-gray-100 font-semibold" : ""
							}`
						}
					>
						<img
							src={DashboardIcon}
							alt="Dashboard"
							className="h-5 w-5 mr-3"
						/>
						Dashboard
					</NavLink>

					<NavLink
						to="/reviewer"
						className={({ isActive }) =>
							`flex items-center px-6 py-2 hover:bg-gray-100 ${
								isActive ? "bg-gray-100 font-semibold" : ""
							}`
						}
					>
						<img
							src={ReviewerIcon}
							alt="Reviewer"
							className="h-5 w-5 mr-3"
						/>
						Reviewer
					</NavLink>

					<NavLink
						to="/profile"
						className={({ isActive }) =>
							`flex items-center px-6 py-2 hover:bg-gray-100 ${
								isActive ? "bg-gray-100 font-semibold" : ""
							}`
						}
					>
						<img
							src={ProfileIcon}
							alt="Profile"
							className="h-5 w-5 mr-3"
						/>
						Profile
					</NavLink>
				</nav>

				{/* My Reviewers */}
				<div className="mt-6 px-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-black-500 text-sm font-bold">
							My Reviewers
						</h3>
						<div className="flex items-center gap-2">
							{/* Search Icon from assets */}
							<button className="p-1 rounded hover:bg-gray-100">
								<img
									src={Search}
									alt="Search"
									className="h-5 w-5"
								/>
							</button>
							{/* Plus Icon from assets */}
							<button className="p-1 rounded hover:bg-gray-100">
								<img
									src={Plus}
                                	alt="Add"
                                    className="h-5 w-5"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        {subjects.map((subject) => (
                            <NavLink
                                key={subject.name}
                                to={subject.path}
                                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-3 h-3 rounded-full ${subject.color}`}
                                    ></span>
                                    <span className="text-sm">{subject.name}</span>
                                </div>
                                <img
                                    src={ForwardIcon}
                                    alt="Forward"
                                    className="h-4 w-4"
                                />
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom: Logout */}
            <div className="px-6 py-4 border-t">
                <button 
                    className="w-full py-2 px-4 bg-red-400 text-white rounded hover:bg-red-500 transition-colors"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
