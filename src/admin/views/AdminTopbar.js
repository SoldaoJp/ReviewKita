import { Search, X as XIcon, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AdminTopbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const ref = useRef();
  const inputRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
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

  return (
    <div className="relative flex items-center p-4 sm:p-6 border-b border-white/30 bg-transparent">
  <div className="flex items-center gap-3 flex-1">
        <button className="sm:hidden p-2 rounded-md hover:bg-white/30" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Left-aligned search container (fills available space) */}
  <div className={`${collapsed ? 'hidden sm:block' : ''} relative w-full`} ref={ref}>
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
            <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Clear search">
              <XIcon className="h-4 w-4" />
            </button>
          )}

          {open && query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-3 text-sm text-gray-600">
              {/* Quick results powered by parent onSearch handler (LLMReports) */}
              Searching "{query}"...
            </div>
          )}
        </div>
      </div>

      {/* Spacer to push profile to right */}
      <div className="flex-1" />

      <div className="ml-6 hidden sm:flex items-center gap-3">
        {/* Placeholder for admin profile / quick actions (now right-aligned) */}
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">A</div>
      </div>
    </div>
  );
}
