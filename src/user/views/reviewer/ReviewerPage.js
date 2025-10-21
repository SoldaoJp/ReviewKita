// src/components/reviewer/ReviewerPage.js
import { useState, useEffect } from "react";
import Topbar from "../components/sidebar/Topbar";
import { getAllReviewers, createReviewer, deleteReviewer } from "../../services/reviewerService";
import { getAvailableLlmModelsReviewer } from "../../services/llmConfigService";
import { createQuiz } from "../../services/quizService";
import { useNavigate } from "react-router-dom";
import { useReviewerContext } from "../../controllers/context/ReviewerContext";
import QuizGenerationModal from "../components/reviewer/QuizGenerationModal";

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
  const { triggerReviewerUpdate } = useReviewerContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
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
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error' | 'loading', message: string }
  const [sortOrder, setSortOrder] = useState(""); // Sort order state

  // Auto-hide notification after 5 seconds (except for loading)
  useEffect(() => {
    if (notification && notification.type !== 'loading') {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  // Fetch reviewers on component mount
  useEffect(() => {
    fetchReviewers();
  }, [sortOrder]); // Re-fetch when sort order changes

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
      const response = await getAllReviewers(100, null, sortOrder || null);
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
      triggerReviewerUpdate(); // Notify sidebar to refresh
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
      showNotification('error', 'Please fill in all fields and select a file.');
      return;
    }

    if (!selectedModelId) {
      showNotification('error', 'Please select an AI model.');
      return;
    }

    try {
      setSubmitting(true);
      showNotification('loading', 'Creating reviewer...');
      
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("file", formData.file);
      data.append("model_id", selectedModelId);

      const response = await createReviewer(data);
      if (response.success) {
        showNotification('success', 'Reviewer added successfully!');
        setShowAddModal(false);
        setFormData({ title: "", description: "", file: null });
        setSelectedModelId("");
        fetchReviewers(); // Refresh the list
        triggerReviewerUpdate(); // Notify sidebar to refresh
      }
    } catch (err) {
      console.error("Error creating reviewer:", err);
      showNotification('error', err.response?.data?.message || 'Failed to create reviewer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReviewer = (reviewerId) => {
    navigate(`/reviewer/${reviewerId}`);
  };

  const handleGenerateQuizClick = (reviewer) => {
    setSelectedReviewer(reviewer);
    if (reviewer.hasQuiz) {
      setShowRetakeModal(true);
    } else {
      setShowQuizModal(true);
    }
  };

  const handleGenerateQuiz = async (quizData) => {
    try {
      showNotification('loading', 'Generating quiz...');
      const response = await createQuiz(quizData);
      console.log('Quiz created successfully:', response);
      showNotification('success', 'Quiz generated successfully! Redirecting...');
      setShowQuizModal(false);
      
      // Navigate to quiz page after a brief delay
      setTimeout(() => {
        navigate(`/quiz/${selectedReviewer._id}`);
      }, 1500);
    } catch (error) {
      console.error('Error generating quiz:', error);
      console.error('Error details:', error.response?.data);
      
      // Extract detailed error message
      let errorMessage = 'Failed to generate quiz. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map(e => e.msg).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification('error', errorMessage);
      setSelectedReviewer(null);
    }
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
        <div className="flex gap-2 items-center">
          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="a->z">A → Z</option>
            <option value="z->a">Z → A</option>
          </select>
          
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
                className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#eef3fb] relative cursor-pointer hover:shadow-md transition-shadow"
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
                      handleGenerateQuizClick(reviewer);
                    }}
                    className="px-3 py-1 bg-cyan-500 text-white text-sm rounded hover:bg-cyan-600"
                  >
                    {reviewer.hasQuiz ? "Retake Quiz" : "Generate Quiz"}
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

            <label className="block mb-2 text-sm font-medium">AI Model</label>
            {modelsLoading ? (
              <div className="w-full px-3 py-2 border rounded mb-4 text-gray-500 text-sm">
                Loading models...
              </div>
            ) : llmModels.length === 0 ? (
              <div className="w-full px-3 py-2 border rounded mb-4 text-red-500 text-sm">
                No models available
              </div>
            ) : (
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select an AI model</option>
                {llmModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.model_name} - {model.provider}
                  </option>
                ))}
              </select>
            )}

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

      {/* Notification Popups */}
      {notification && notification.type !== 'loading' && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {notification.type === 'success' ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm mt-1 ${
                  notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`flex-shrink-0 ${
                  notification.type === 'success' ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Notification */}
      {notification && notification.type === 'loading' && (
        <div className="fixed top-4 right-4 z-[60] animate-slide-in">
          <div className="rounded-lg shadow-lg p-4 min-w-[300px] bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Processing
                </p>
                <p className="text-sm mt-1 text-blue-700">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Generation Modal */}
      <QuizGenerationModal
        isOpen={showQuizModal}
        onClose={() => {
          setShowQuizModal(false);
          setSelectedReviewer(null);
        }}
        onGenerate={handleGenerateQuiz}
        reviewerId={selectedReviewer?._id}
      />

      {/* Retake Quiz Confirmation Modal */}
      {showRetakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Retake Quiz</h3>
            <p className="text-gray-600 text-sm mb-6">
              This feature is not yet implemented. Stay tuned for updates!
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRetakeModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewerPage;
