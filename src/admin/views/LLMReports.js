// src/admin/views/LLMReports.js
import React, { useState, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import AdminLayout from "./Layout";
import { fetchLLMReports } from "../services/llmReportsService";

export default function LLMReports() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports on mount and when filters change
  useEffect(() => {
    loadReports();
  }, [selectedFilter, searchQuery]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      
      // Map UI filter to API parameters
      if (selectedFilter === 'Email' && searchQuery) {
        filters.email = searchQuery;
      } else if (selectedFilter === 'Model Name' && searchQuery) {
        filters.model_name = searchQuery;
      } else if (searchQuery) {
        // Default search (could search both)
        filters.model_name = searchQuery;
      }
      
      // Map sort filters
      if (selectedFilter === 'Sort Ascending') {
        filters.sort = 'ascending';
      } else if (selectedFilter === 'Sort Descending') {
        filters.sort = 'descending';
      } else if (selectedFilter === 'Random') {
        filters.sort = 'random';
      }
      
      const data = await fetchLLMReports(filters);
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleTopbarSearch = (q) => {
    setSearchQuery(q);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSearch = () => {
    loadReports();
  };

  return (
    <AdminLayout topbarProps={{ onSearch: handleTopbarSearch }}>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">LLM REPORTS</h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-6">
          {/* Search bar */}
          <div className="flex items-center bg-white shadow-sm rounded-lg px-3 w-full sm:max-w-md border border-gray-300 mb-2 sm:mb-0">
            <Search className="text-gray-500 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 focus:outline-none text-gray-700"
            />
          </div>

          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              <span className="mr-2">{selectedFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {["All", "Model Name", "Email", "Sort Ascending", "Sort Descending", "Random"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        handleFilterChange(filter);
                        setDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        selectedFilter === filter ? "font-semibold bg-gray-50" : ""
                      }`}
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Reports Overview</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading reports...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 py-4">
              <p>Error: {error}</p>
              <button 
                onClick={loadReports}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : reports.length === 0 ? (
            <p className="text-gray-500 italic">No reports found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">User</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">LLM Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Created At</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="border border-gray-200 px-4 py-2">{r.id.slice(0, 8)}...</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {r.user?.username || 'N/A'} <br />
                      <span className="text-xs text-gray-500">{r.user?.email || 'N/A'}</span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{r.model?.name || 'N/A'}</td>
                    <td className="border border-gray-200 px-4 py-2">{r.type}</td>
                    <td className="border border-gray-200 px-4 py-2">{r.description}</td>
                    <td className="border border-gray-200 px-4 py-2">{new Date(r.submitted_at).toLocaleString()}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <button onClick={() => setSelectedReport(r)} className="text-blue-600 hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Report Details</h2>
                <button onClick={() => setSelectedReport(null)}>
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                </button>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                <strong>Reported by:</strong> {selectedReport.user?.username || 'N/A'} ({selectedReport.user?.email || 'N/A'})
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <strong>LLM:</strong> {selectedReport.model?.name || 'N/A'} ({selectedReport.model?.provider || 'N/A'})
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Type:</strong> {selectedReport.type}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Description:</strong> {selectedReport.description}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Submitted:</strong> {new Date(selectedReport.submitted_at).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
