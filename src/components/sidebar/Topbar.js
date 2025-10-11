
import { FaSearch, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../controllers/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useEffect, useRef } from "react";

export default function Topbar() {
  const { user } = useAuth();
  const {
    searchQuery,
    searchResults,
    isSearching,
    showResults,
    handleSearch,
    handleResultClick,
    clearSearch,
    setShowResults,
  } = useSearch();

  const searchRef = useRef(null);

  // Get profile picture from user context
  const profilePic = user?.profilePicture
    ? `http://localhost:5000/${user.profilePicture}`
    : null;

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowResults]);

  const handleInputChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedResults = (searchResults || []).reduce((acc, result) => {
    const category = result.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(result);
    return acc;
  }, {});

  return (
    <div className="flex items-center justify-between mb-6 px-4">
      {/* Search Bar */}
      <div className="relative w-[90%]" ref={searchRef}>
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search pages, sections, reviewers, content..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => handleSearch('')}
          className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
        />

        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
        )}

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[500px] overflow-y-auto z-50">
            {isSearching && (
              <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
            )}

            {!isSearching && (searchResults || []).length === 0 && searchQuery.length >= 1 && (
              <div className="p-4 text-center text-gray-500 text-sm">No results found for "{searchQuery}"</div>
            )}

            {!isSearching && (searchResults || []).length > 0 && (
              <div className="py-2">
                {Object.entries(groupedResults).map(([category, results]) => (
                  <div key={category} className="mb-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">{category}</div>
                    {results.map((result, index) => (
                      <button
                        key={`${result.path || result.title}-${index}`}
                        onClick={() => handleResultClick(result.path || "/")}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 mb-1">{result.title}</div>
                            {result.description && (
                              <div className="text-xs text-gray-500 line-clamp-2">{result.description}</div>
                            )}
                          </div>
                          {result.date && (
                            <div className="text-xs text-gray-400 ml-2 flex-shrink-0">{formatDate(result.date)}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {result.type === "reviewer" && <span className="text-xs text-blue-600">📄 Reviewer</span>}
                          {result.type === "reviewer-section" && <span className="text-xs text-indigo-600">📑 {result.section}</span>}
                          {result.type === "page" && <span className="text-xs text-green-600">📍 Page</span>}
                          {result.type === "section" && <span className="text-xs text-purple-600">🔖 {result.section}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">Suggestions shown — start typing to narrow results</div>
            )}
          </div>
        )}
      </div>

      {/* Profile picture */}
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


