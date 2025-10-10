import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/AuthContext';
import Logo from '../../assets/logo.png';
import DashboardIcon from '../../assets/Dashboard.svg';

function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 rounded-[25px] shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 px-6 py-6">
            <img src={Logo} alt="ReviewKita Logo" className="h-10 w-10 object-contain" />
            <span className="font-bold text-base text-gray-800">Admin</span>
          </div>

          <nav className="mt-2 flex flex-col gap-1 px-3">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              <img src={DashboardIcon} alt="Dashboard" className="h-4 w-4 mr-2" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              <span className="h-4 w-4 mr-2">👥</span>
              <span>Users</span>
            </NavLink>

            <NavLink
              to="/admin/llm-configs"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${
                  isActive ? 'bg-[#0062FF]/[0.05] font-semibold' : 'text-gray-700 hover:bg-white/50'
                }`
              }
            >
              <span className="h-4 w-4 mr-2">🧠</span>
              <span>LLM Configs</span>
            </NavLink>
          </nav>
        </div>

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

export default AdminSidebar;
