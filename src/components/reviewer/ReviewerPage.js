// src/components/reviewer/ReviewerPage.js
import { useState } from "react";

function ReviewerPage({ title }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  const [reviewers, setReviewers] = useState([
    { label: "Data Scalability", path: "/datascalability", color: "bg-blue-200", date: "09/12/2025", border: "border-blue-400" },
    { label: "Quantitative Methods", path: "/quantitative-methods", color: "bg-pink-200", date: "09/12/2025", border: "border-pink-400" },
    { label: "Advanced Database", path: "/advanced-database", color: "bg-purple-200", date: "09/12/2025", border: "border-purple-400" },
    { label: "Networking 2", path: "/networking-2", color: "bg-green-200", date: "09/26/2025", border: "border-green-400" },
    { label: "Advanced Programming", path: "/advanced-programming", color: "bg-orange-200", date: "09/26/2025", border: "border-orange-400" },
    { label: "IAS", path: "/ias", color: "bg-red-200", date: "09/26/2025", border: "border-red-400" },
  ]);

  // Delete confirmation logic
  const handleDeleteClick = (reviewer) => {
    setSelectedReviewer(reviewer);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setReviewers((prev) => prev.filter((r) => r.label !== selectedReviewer.label));
    setShowDeleteModal(false);
    setSelectedReviewer(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedReviewer(null);
  };

  return (
    <div className="flex-1 p-6 relative">
      {/* Search + Buttons */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 border rounded-lg w-1/3 focus:ring-2 focus:ring-cyan-400"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            + Add
          </button>
          <button
            onClick={() => setShowLearnModal(true)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Learn
          </button>
        </div>
      </div>

      {/* Reviewer Cards */}
      <h2 className="text-xl font-bold mb-4">My Reviewers</h2>
      <div className="grid grid-cols-3 gap-4">
        {reviewers.map((reviewer, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-md relative">
            <div
              className={`absolute top-0 left-0 h-2 w-full ${reviewer.border} bg-opacity-80 rounded-t-lg`}
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{reviewer.label}</h3>
              <p className="text-sm text-gray-500">Lorem Ipsum Lorem Ipsum</p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button className="px-3 py-1 bg-cyan-500 text-white text-sm rounded hover:bg-cyan-600">
                Generate Quiz
              </button>
              <span className="text-xs text-gray-400">{reviewer.date}</span>
            </div>

            {/* Delete Icon */}
            <button
              onClick={() => handleDeleteClick(reviewer)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete Reviewer"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      {/* Add Reviewer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-bold mb-4">Add Reviewer</h2>

            <label className="block mb-2 text-sm font-medium">Subject Title</label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400"
            />

            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              placeholder="add description here...."
              className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400"
            />

            <label className="block mb-2 text-sm font-medium">Import</label>
            <div className="w-full border border-dashed border-gray-300 rounded p-4 mb-4 text-center">
              <input type="file" className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
                Choose file or drag & drop
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                Add
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Learn Modal (Scrollable) */}
      {showLearnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[500px] relative max-h-[80vh] flex flex-col">
            <h2 className="text-lg font-bold mb-4">Learn</h2>

            {/* Scrollable content */}
            <div className="flex flex-col gap-3 overflow-y-auto pr-2" style={{ maxHeight: "60vh" }}>
              {reviewers.map((reviewer, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center px-4 py-3 border ${reviewer.border} ${reviewer.color} rounded-lg`}
                >
                  <span className="font-medium text-gray-800">{reviewer.label}</span>
                  <button className="px-4 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800">
                    Open
                  </button>
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowLearnModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[360px] px-6 py-5 relative">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm deletion
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Do you want to permanently remove{" "}
              <span className="text-blue-600 font-medium">
                {selectedReviewer?.label}
              </span>{" "}
              reviewer?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Delete
              </button>
            </div>

            <button
              onClick={handleCancelDelete}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewerPage;
