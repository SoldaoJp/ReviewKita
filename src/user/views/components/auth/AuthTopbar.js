import Logo from "../../../../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthTopbar({ showButtons = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isSignup = location.pathname === "/signup";

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2 -ml-4">
          <img src={Logo} alt="ReviewKita Logo" className="h-8 w-auto" />
          <span className="font-semibold text-slate-900 text-lg">
            ReviewKita
          </span>
        </div>
        {showButtons && (
          <div className="flex gap-3">
            <button
              className={`px-4 py-1.5 rounded-md text-sm border border-gray-400 text-slate-800 hover:bg-gray-100 ${isLogin ? "bg-black text-white border-none" : ""}`}
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button
              className={`px-4 py-1.5 rounded-md text-sm border border-gray-400 text-slate-800 hover:bg-gray-100 ${isSignup ? "bg-black text-white border-none" : ""}`}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
