// src/admin/views/LLMReports.js
import React, { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { filterReports } from "../controllers/llmReportsController";

export default function LLMReports() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = filterReports(selectedFilter, searchQuery);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">LLM REPORTS</h1>

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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
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
                      setSelectedFilter(filter);
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
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Reports Overview
        </h2>

        {reports.length === 0 ? (
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
                  <td className="border border-gray-200 px-4 py-2">{r.id}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    {r.username} <br />
                    <span className="text-xs text-gray-500">{r.user_email}</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">{r.llm_name}</td>
                  <td className="border border-gray-200 px-4 py-2">{r.type}</td>
                  <td className="border border-gray-200 px-4 py-2">{r.description}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="text-blue-600 hover:underline"
                    >
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
              <h2 className="text-xl font-semibold">
                {selectedReport.reviewer.title}
              </h2>
              <button onClick={() => setSelectedReport(null)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
              </button>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              <strong>Reported by:</strong> {selectedReport.username} (
              {selectedReport.user_email})
            </p>
            <p className="text-sm text-gray-700 mb-3">
              <strong>LLM:</strong> {selectedReport.llm_name} (
              {selectedReport.llm_provider})
            </p>

            <div className="bg-gray-100 p-3 rounded-md mb-2">
              <p className="font-medium text-gray-700 mb-1">Original:</p>
              <p className="text-gray-600">{selectedReport.reviewer.original}</p>
            </div>

            <div className="bg-green-50 p-3 rounded-md">
              <p className="font-medium text-gray-700 mb-1">Enhanced:</p>
              <p className="text-gray-600">{selectedReport.reviewer.enhanced}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
