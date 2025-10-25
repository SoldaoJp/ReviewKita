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

  // Helper function to parse sections from content
  const parseSections = (content) => {
    if (!content) return [];
    
    const sectionRegex = /\[SECTION:\s*([^\]]+)\]\s*\[([^\]]+)\]\s*([\s\S]*?)\s*\[END_SECTION\]/g;
    const sections = [];
    let match;

    while ((match = sectionRegex.exec(content)) !== null) {
      sections.push({
        key: match[1].trim(),
        title: match[2].trim(),
        content: match[3].trim()
      });
    }

    return sections;
  };

  // Helper function to render section content
  const renderSectionContent = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={idx} />;
      return <p key={idx} className="mb-2">{trimmed}</p>;
    });
  };

  // Fetch reports on mount and when filters change
  useEffect(() => {
    loadReports();
  }, [selectedFilter, searchQuery]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      
      // Search always filters by model name
      if (searchQuery) {
        filters.model_name = searchQuery;
      }
      
      // Map sort filters
      if (selectedFilter === 'Sort Ascending') {
        filters.sort = 'ascending';
      } else if (selectedFilter === 'Sort Descending') {
        filters.sort = 'descending';
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
      <div className="p-6">
        {/* Header with Title and Controls */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">REPORT CASES</h1>
          
          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2">
            {/* Search bar */}
            <div className="flex items-center bg-white shadow-sm rounded-lg px-3 border border-gray-300">
              <Search className="text-gray-500 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search by model name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 focus:outline-none text-gray-700 w-48"
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
                  {["All", "Sort Ascending", "Sort Descending"].map(
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
        </div>

        {/* Reports Table */}
        <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Report Cases Overview</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading report cases...</span>
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
            <p className="text-gray-500 italic">No report cases found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">User</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">LLM Model</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Submitted At</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="border border-gray-200 px-4 py-2">
                      <span className="text-sm">{r.user_email || 'N/A'}</span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {r.model_name || 'N/A'}
                      <br />
                      <span className="text-xs text-gray-500">{r.provider || 'N/A'}</span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{r.type}</td>
                    <td className="border border-gray-200 px-4 py-2">{r.description}</td>
                    <td className="border border-gray-200 px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold">Report Details</h2>
                <button onClick={() => setSelectedReport(null)}>
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-800" />
                </button>
              </div>

              {/* Report Info */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p className="text-gray-700">
                    <strong>Reported by:</strong> {selectedReport.user_email || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong>LLM Model:</strong> {selectedReport.model_name || 'N/A'} ({selectedReport.provider || 'N/A'})
                  </p>
                  <p className="text-gray-700">
                    <strong>Type:</strong> {selectedReport.type}
                  </p>
                  <p className="text-gray-700">
                    <strong>Submitted At:</strong> {new Date(selectedReport.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-700 col-span-2">
                    <strong>Description:</strong> {selectedReport.description}
                  </p>
                  {selectedReport.reviewer && (
                    <p className="text-gray-700 col-span-2">
                      <strong>Reviewer Title:</strong> {selectedReport.reviewer.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Content Comparison */}
              {selectedReport.reviewer && (
                <div className="flex-1 overflow-hidden flex">
                  {/* Enhanced Content - LEFT */}
                  <div className="w-1/2 flex flex-col border-r border-gray-200">
                    <div className="bg-green-50 px-6 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-green-800">Enhanced Content</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      {(() => {
                        const sections = parseSections(selectedReport.reviewer.enhancedContentByAI);
                        if (sections.length > 0) {
                          return sections.map((section, index) => (
                            <div key={index} className="mb-8">
                              <div className="flex items-baseline gap-3 mb-3">
                                <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                                {section.key && (
                                  <span className="text-xs uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                    {section.key.replace(/_/g, ' ')}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-700">
                                {renderSectionContent(section.content)}
                              </div>
                            </div>
                          ));
                        } else {
                          return (
                            <div className="prose prose-sm max-w-none text-gray-700">
                              {selectedReport.reviewer.enhancedContentByAI || 'No enhanced content available'}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Original Content - RIGHT */}
                  <div className="w-1/2 flex flex-col">
                    <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-blue-800">Original Content</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      {(() => {
                        const sections = parseSections(selectedReport.reviewer.originalContent);
                        if (sections.length > 0) {
                          return sections.map((section, index) => (
                            <div key={index} className="mb-8">
                              <div className="flex items-baseline gap-3 mb-3">
                                <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                                {section.key && (
                                  <span className="text-xs uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    {section.key.replace(/_/g, ' ')}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-700">
                                {renderSectionContent(section.content)}
                              </div>
                            </div>
                          ));
                        } else {
                          return (
                            <div className="prose prose-sm max-w-none text-gray-700">
                              {selectedReport.reviewer.originalContent || 'No original content available'}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
