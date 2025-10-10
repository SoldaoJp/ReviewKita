// src/components/reviewer/ReviewerPage.js
import { useState, useEffect } from "react";
import Topbar from "../sidebar/Topbar";
import { getAllReviewers, createReviewer, deleteReviewer } from "../../services/reviewerService";
import { getAvailableLlmModelsReviewer } from "../../services/llmConfigService";
import { useNavigate } from "react-router-dom";

// Color palette for reviewer cards
const colors = [
  { bg: "bg-blue-200", border: "border-blue-400" },
  { bg: "bg-pink-200", border: "border-pink-400" },
  { bg: "bg-purple-200", border: "border-purple-400" },
  { bg: "bg-green-200", border: "border-green-400" },
  { bg: "bg-orange-200", border: "border-orange-400" },
  { bg: "bg-red-200", border: "border-red-400" },
  { bg: "bg-yellow-200", border: "border-yellow-400" },
  { bg: "bg-indigo-200", border: "border-indigo-400" },
];

function ReviewerPage({ title }) {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state for adding new reviewer
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [llmModels, setLlmModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("");

  // Fetch reviewers on component mount
  useEffect(() => {
    fetchReviewers();
  }, []);

  // Load available LLM models when the Add modal is opened
  useEffect(() => {
    const loadModels = async () => {
      if (!showAddModal) return;
      try {
        setModelsLoading(true);
        const res = await getAvailableLlmModelsReviewer();
        const models = Array.isArray(res?.models) ? res.models : [];
        setLlmModels(models);
        setSelectedModelId(models[0]?.id || "");
      } catch (err) {
        console.error("Error loading LLM models:", err);
        setLlmModels([]);
      } finally {
        setModelsLoading(false);
      }
    };
    loadModels();
  }, [showAddModal]);

  const fetchReviewers = async () => {
    try {
      setLoading(true);
      const response = await getAllReviewers();
      if (response.success) {
        setReviewers(response.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching reviewers:", err);
      setError("Failed to load reviewers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (reviewer) => {
    setSelectedReviewer(reviewer);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReviewer(selectedReviewer._id);
      setReviewers((prev) => prev.filter((r) => r._id !== selectedReviewer._id));
      setShowDeleteModal(false);
      setSelectedReviewer(null);
    } catch (err) {
      console.error("Error deleting reviewer:", err);
      alert("Failed to delete reviewer. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedReviewer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleAddReviewer = async () => {
    if (!formData.title || !formData.description || !formData.file) {
      alert("Please fill in all fields and select a file.");
      return;
    }
    if (!selectedModelId) {
      alert("Please select a model.");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
  data.append("file", formData.file);
  // Backend expects snake_case key
  data.append("model_id", selectedModelId);

      const response = await createReviewer(data);
      if (response.success) {
        alert(response.message);
        setShowAddModal(false);
        setFormData({ title: "", description: "", file: null });
        setSelectedModelId("");
        fetchReviewers(); // Refresh the list
      }
    } catch (err) {
      console.error("Error creating reviewer:", err);
      alert(err.response?.data?.message || "Failed to create reviewer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReviewer = (reviewerId) => {
    navigate(`/reviewer/${reviewerId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const getColorForIndex = (index) => {
    return colors[index % colors.length];
  };

  return (
    <div className="p-8">
      {/* Topbar */}
      <Topbar />

      {/* Reviewer Cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Reviewers</h2>
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reviewers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchReviewers}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviewers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No reviewers yet. Create your first one!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + Add Reviewer
          </button>
        </div>
      )}

      {/* Reviewer Grid */}
      {!loading && !error && reviewers.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {reviewers.map((reviewer, idx) => {
            const colorScheme = getColorForIndex(idx);
            return (
              <div 
                key={reviewer._id} 
                className="bg-white p-4 rounded-lg shadow-md relative cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOpenReviewer(reviewer._id)}
              >
                <div
                  className={`absolute top-0 left-0 h-2 w-full ${colorScheme.border} bg-opacity-80 rounded-t-lg`}
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{reviewer.title}</h3>
                  <p className="text-sm text-gray-500">{reviewer.description}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement generate quiz functionality
                      alert("Generate Quiz functionality coming soon!");
                    }}
                    className="px-3 py-1 bg-cyan-500 text-white text-sm rounded hover:bg-cyan-600"
                  >
                    Generate Quiz
                  </button>
                  <span className="text-xs text-gray-400">{formatDate(reviewer.extractedDate)}</span>
                </div>

                {/* Delete Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(reviewer);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Delete Reviewer"
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Reviewer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-bold mb-4">Add Reviewer</h2>

            <label className="block mb-2 text-sm font-medium">Subject Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Mathematics"
              className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400"
            />

            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="add description here...."
              className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400"
              rows="3"
            />

            {/* LLM Model Dropdown */}
            <label className="block mb-2 text-sm font-medium">LLM Model</label>
            <div className="mb-4">
              <div className="relative">
                <select
                  className="w-full appearance-none rounded border bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  disabled={modelsLoading}
                >
                  {modelsLoading && <option>Loading models...</option>}
                  {!modelsLoading && llmModels.length === 0 && (
                    <option value="" disabled>No models available</option>
                  )}
                  {!modelsLoading && llmModels.length > 0 && (
                    llmModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.model_name}</option>
                    ))
                  )}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▼</span>
              </div>
              {selectedModelId && (
                <p className="mt-1 text-xs text-gray-500">Selected: {llmModels.find(m => m.id === selectedModelId)?.model_name}</p>
              )}
            </div>

            <label className="block mb-2 text-sm font-medium">Import File (PDF, DOC, DOCX, TXT)</label>
            <div className="w-full border border-dashed border-gray-300 rounded p-4 mb-4 text-center">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
                {formData.file ? formData.file.name : "Choose file or drag & drop"}
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ title: "", description: "", file: null });
                  setSelectedModelId("");
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddReviewer}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add"}
              </button>
            </div>

            <button
              onClick={() => {
                setShowAddModal(false);
                setFormData({ title: "", description: "", file: null });
                setSelectedModelId("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
              disabled={submitting}
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
              {reviewers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviewers available</p>
              ) : (
                reviewers.map((reviewer, idx) => {
                  const colorScheme = getColorForIndex(idx);
                  return (
                    <div
                      key={reviewer._id}
                      className={`flex justify-between items-center px-4 py-3 border ${colorScheme.border} ${colorScheme.bg} rounded-lg`}
                    >
                      <span className="font-medium text-gray-800">{reviewer.title}</span>
                      <button 
                        onClick={() => handleOpenReviewer(reviewer._id)}
                        className="px-4 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                      >
                        Open
                      </button>
                    </div>
                  );
                })
              )}
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
      {showDeleteModal && selectedReviewer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[380px] px-6 py-5 relative">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete reviewer
            </h2>
            <p className="text-gray-600 text-sm mb-1">
              Are you sure you want to delete this reviewer?
            </p>
            <p className="text-gray-700 text-sm mb-6">
              <span className="font-medium">{selectedReviewer.title}</span>
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
