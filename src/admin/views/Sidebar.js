import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../user/controllers/AuthContext';
import Logo from '../../assets/logo.png';
import DashboardIcon from '../../assets/Dashboard.svg';
import { AlertTriangle, Users as UsersIcon, Cpu, BarChart, LineChart as LineChartIcon, UserCog } from 'lucide-react';

function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-2 h-screen flex flex-col w-48">
      <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 rounded-[25px] shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex items-center gap-2 px-4 py-4">
            <img src={Logo} alt="ReviewKita Logo" className="h-8 w-8 object-contain" />
            <span className="font-bold text-sm text-gray-800">Admin</span>
          </div>

          <nav className="mt-2 flex flex-col gap-1 px-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all text-xs ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img 
                    src={DashboardIcon} 
                    alt="Dashboard" 
                    className="h-3.5 w-3.5 mr-2" 
                    style={isActive ? { filter: 'invert(34%) sepia(87%) saturate(747%) hue-rotate(184deg) brightness(92%) contrast(92%)' } : {}}
                  />
                  <span className={isActive ? 'text-black' : ''}>Dashboard</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all text-xs ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <UsersIcon className={`h-3.5 w-3.5 mr-2 ${isActive ? 'text-[#2472B5]' : 'text-gray-700'}`} />
                  <span className={isActive ? 'text-black' : ''}>Users</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/llm-configs"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all text-xs ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Cpu className={`h-3.5 w-3.5 mr-2 ${isActive ? 'text-[#2472B5]' : 'text-gray-700'}`} />
                  <span className={isActive ? 'text-black' : ''}>LLM Configs</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/llm-analytics"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all text-xs ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <BarChart className={`h-3.5 w-3.5 mr-2 ${isActive ? 'text-[#2472B5]' : 'text-gray-700'}`} />
                  <span className={isActive ? 'text-black' : ''}>LLM Analytics</span>
                </>
              )}
            </NavLink>
            
            <NavLink
              to="/llm-reports"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all text-xs ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <AlertTriangle className={`h-3.5 w-3.5 mr-2 ${isActive ? 'text-[#2472B5]' : 'text-gray-700'}`} />
                  <span className={isActive ? 'text-black' : ''}>Report Cases</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all text-xs ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <LineChartIcon className={`h-3.5 w-3.5 mr-2 ${isActive ? 'text-[#2472B5]' : 'text-gray-700'}`} />
                  <span className={isActive ? 'text-black' : ''}>Analytics</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/profile"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all text-xs ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <UserCog className={`h-3.5 w-3.5 mr-2 ${isActive ? 'text-[#2472B5]' : 'text-gray-700'}`} />
                  <span className={isActive ? 'text-black' : ''}>Manage Profile</span>
                </>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Profile Card Section */}
        <div className="px-2 py-3 border-t border-gray-200">
          <div className="bg-white/60 border border-gray-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-900 truncate">{user?.username || user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate mt-1">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>

        <div className="px-2 pb-3">
          <button
            className="w-full py-2 px-2 rounded-lg transition-all text-xs text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;



