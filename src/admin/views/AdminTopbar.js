import { Search, X as XIcon, Menu, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../user/controllers/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminTopbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const ref = useRef();
  const inputRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileDropdown(false);
    }
    function handleKey(e) {
      // Press `/` to focus search (ignore when typing in inputs)
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setQuery('');
        if (onSearch) onSearch('');
        inputRef.current?.blur();
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
    setOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleManageProfile = () => {
    setShowProfileDropdown(false);
    navigate('/admin/profile');
  };

  return (
  <div className="flex items-center justify-between mb-3">
      <div className="relative flex-1 mr-4" ref={ref}>
        <button className="sm:hidden p-2 rounded-md hover:bg-white/30 absolute left-0 top-1/2 -translate-y-1/2" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search reports, users, LLM models... (press / to focus)"
          className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white/50 shadow-sm border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
        />

        {query && (
          <button onClick={handleClear} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Clear search">
            <XIcon className="h-4 w-4" />
          </button>
        )}

        {open && query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[500px] overflow-y-auto z-50 p-3 text-sm text-gray-600">
            {/* Quick results powered by parent onSearch handler (LLMReports) */}
            Searching "{query}"...
          </div>
        )}
      </div>

      <div className="relative" ref={profileRef}>
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        >
          <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">A</div>
          <ChevronDown className="text-gray-600 w-4 h-4" />
        </div>

        {showProfileDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="font-semibold text-gray-900 text-sm">{user?.username || user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 mt-1">{user?.email || 'admin@example.com'}</p>
            </div>

            <button
              onClick={handleManageProfile}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              Manage Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

