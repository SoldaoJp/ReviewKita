import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../controllers/AuthContext";
import { useState, useEffect } from "react";
import { getAllReviewers } from "../../../services/reviewerService";
import { getAvailableLlmModelsReviewer } from "../../../services/llmConfigService";
import { useReviewerContext } from "../../../controllers/context/ReviewerContext";
import Logo from "../../../../assets/logo.png";
import Search from "../../../../assets/Search.svg";
import Plus from "../../../../assets/Plus.svg";
import DashboardIcon from "../../../../assets/Dashboard.svg";
import ReviewerIcon from "../../../../assets/reviewer.svg";
import ProfileIcon from "../../../../assets/Profile.svg";
import ForwardIcon from "../../../../assets/Forward.svg";
import HistoryIcon from "../../../../assets/Clock.svg";

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-gray-500"
];

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { reviewerUpdateTrigger, triggerReviewerUpdate } = useReviewerContext();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReviewers, setFilteredReviewers] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", file: null });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("");

  useEffect(() => {
    if (notification && notification.type !== 'loading') {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    fetchReviewers();
  }, [reviewerUpdateTrigger]);

  const fetchReviewers = async () => {
    try {
      setLoading(true);
      const response = await getAllReviewers(100); // Pass limit as first parameter
      console.log('Sidebar - Fetched reviewers:', response);
      if (response.success) {
        setReviewers(response.data);
        setFilteredReviewers(response.data);
      }
    } catch (err) {
      console.error("Error fetching reviewers:", err);
    } finally {
      setLoading(false);
    }
  };

  const getColorForIndex = (index) => colors[index % colors.length];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchClick = () => {
    setShowSearchModal(true);
    setSearchQuery('');
    setFilteredReviewers(reviewers);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredReviewers(
      query.trim() === '' ? reviewers : reviewers.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const handleReviewerClick = (reviewerId) => {
    setShowSearchModal(false);
    navigate(`/reviewer/${reviewerId}`);
  };

  const handleAddClick = async () => {
    setShowAddModal(true);
    setFormData({ title: "", description: "", file: null });
    setSelectedModelId("");
    try {
      setLoadingModels(true);
      const response = await getAvailableLlmModelsReviewer();
      if (response && response.models) {
        setAvailableModels(response.models);
        setSelectedModelId(response.models[0]?.id || "");
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const showNotification = (type, message) => setNotification({ type, message });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, file }));
  };

  const handleAddReviewer = async () => {
    if (!formData.title.trim()) return showNotification('error', 'Please enter a title');
    if (!formData.description.trim()) return showNotification('error', 'Please enter a description');
    if (!formData.file) return showNotification('error', 'Please select a file');
    if (!selectedModelId) return showNotification('error', 'Please select an AI model');

    try {
      setSubmitting(true);
      showNotification('loading', 'Creating reviewer...');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('file', formData.file);
      formDataToSend.append('model_id', selectedModelId);
  const { createReviewer } = await import('../../../services/reviewerService');
      const response = await createReviewer(formDataToSend);
      if (response.success) {
        showNotification('success', 'Reviewer added successfully!');
        setShowAddModal(false);
        setFormData({ title: "", description: "", file: null });
        setSelectedModelId("");
        triggerReviewerUpdate();
      } else {
        showNotification('error', response.message || 'Failed to create reviewer');
      }
    } catch (error) {
      console.error('Error creating reviewer:', error);
      showNotification('error', error.message || 'An error occurred while creating the reviewer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 rounded-[25px] shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex items-center gap-2 px-6 py-6">
            <img src={Logo} alt="ReviewKita Logo" className="h-10 w-10 object-contain" />
            <span className="font-bold text-base text-gray-800">ReviewKita</span>
          </div>

          <nav className="mt-2 flex flex-col gap-1 px-3">
            <NavLink to="/dashboard" className={({ isActive }) => `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${isActive ? "bg-[#0062FF]/[0.05] font-semibold" : "text-gray-700 hover:bg-white/50"}`}>
              <img src={DashboardIcon} alt="Dashboard" className={`h-4 w-4 mr-2 ${window.location.pathname === '/dashboard' ? 'text-[#2472B5] filter-blue' : ''}`} style={window.location.pathname === '/dashboard' ? { filter: 'invert(34%) sepia(87%) saturate(747%) hue-rotate(184deg) brightness(92%) contrast(92%)' } : {}} />
              <span className={window.location.pathname === '/dashboard' ? 'text-black' : ''}>Dashboard</span>
            </NavLink>

            <NavLink to="/reviewer" className={({ isActive }) => `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${isActive ? "bg-[#0062FF]/[0.05] font-semibold" : "text-gray-700 hover:bg-white/50"}`}>
              <img src={ReviewerIcon} alt="Reviewer" className={`h-4 w-4 mr-2 ${window.location.pathname === '/reviewer' ? 'text-[#2472B5] filter-blue' : ''}`} style={window.location.pathname === '/reviewer' ? { filter: 'invert(34%) sepia(87%) saturate(747%) hue-rotate(184deg) brightness(92%) contrast(92%)' } : {}} />
              <span className={window.location.pathname === '/reviewer' ? 'text-black' : ''}>Reviewer</span>
            </NavLink>

            <NavLink to="/quiz-history" className={({ isActive }) => `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${isActive ? "bg-[#0062FF]/[0.05] font-semibold" : "text-gray-700 hover:bg-white/50"}`}>
              <img src={HistoryIcon || ForwardIcon} alt="Quiz History" className={`h-4 w-4 mr-2 ${window.location.pathname === '/quiz-history' ? 'text-[#2472B5] filter-blue' : ''}`} style={window.location.pathname === '/quiz-history' ? { filter: 'invert(34%) sepia(87%) saturate(747%) hue-rotate(184deg) brightness(92%) contrast(92%)' } : {}} />
              <span className={window.location.pathname === '/quiz-history' ? 'text-black' : ''}>Quiz History</span>
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) => `flex items-center px-4 py-2 rounded-xl transition-all text-sm ${isActive ? "bg-[#0062FF]/[0.05] font-semibold" : "text-gray-700 hover:bg-white/50"}`}>
              <img src={ProfileIcon} alt="Profile" className={`h-4 w-4 mr-2 ${window.location.pathname === '/profile' ? 'text-[#2472B5] filter-blue' : ''}`} style={window.location.pathname === '/profile' ? { filter: 'invert(34%) sepia(87%) saturate(747%) hue-rotate(184deg) brightness(92%) contrast(92%)' } : {}} />
              <span className={window.location.pathname === '/profile' ? 'text-black' : ''}>Profile</span>
            </NavLink>
          </nav>

          <div className="mt-8 px-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-800 text-xs font-bold">My Reviewers</h3>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg hover:bg-white/50 transition-colors" onClick={handleSearchClick}>
                  <img src={Search} alt="Search" className="h-3 w-3" />
                </button>
                <button className="p-1 rounded-lg hover:bg-white/50 transition-colors" onClick={handleAddClick}>
                  <img src={Plus} alt="Add" className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {loading ? (
                <p className="text-xs text-gray-500 text-center py-2">Loading...</p>
              ) : reviewers.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">No reviewers yet</p>
              ) : (
                reviewers.map((reviewer, index) => (
                  <NavLink key={reviewer._id} to={`/reviewer/${reviewer._id}`} className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded-xl justify-between transition-all text-xs ${isActive ? "bg-white/70 shadow-sm" : "hover:bg-white/40"}`}>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${getColorForIndex(index)}`}></span>
                      <span className="text-xs text-gray-700 truncate">{reviewer.title}</span>
                    </div>
                    <img src={ForwardIcon} alt="Forward" className="h-3 w-3 opacity-60" />
                  </NavLink>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <button className="w-full py-2 px-3 rounded-lg transition-all text-xs text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 flex items-center justify-center gap-2" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative max-h-[600px] flex flex-col">
            <h2 className="text-lg font-bold mb-4">Search Reviewers</h2>
            <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search by title..." className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-blue-400" autoFocus />
            <div className="flex-1 overflow-y-auto">
              {filteredReviewers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No reviewers found</p>
              ) : (
                <div className="space-y-2">
                  {filteredReviewers.map((reviewer, index) => (
                    <button key={reviewer._id} onClick={() => handleReviewerClick(reviewer._id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <span className={`w-3 h-3 rounded-full ${getColorForIndex(index)}`}></span>
                      <span className="text-sm text-gray-700">{reviewer.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setShowSearchModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg">×</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-bold mb-4">Add Reviewer</h2>
            <label className="block mb-2 text-sm font-medium">Subject Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Mathematics" className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400" />
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="add description here...." className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400" rows="3" />
            <label className="block mb-2 text-sm font-medium">AI Model</label>
            {loadingModels ? (
              <div className="w-full px-3 py-2 border rounded mb-4 text-gray-500 text-sm">Loading models...</div>
            ) : availableModels.length === 0 ? (
              <div className="w-full px-3 py-2 border rounded mb-4 text-red-500 text-sm">No models available</div>
            ) : (
              <select value={selectedModelId} onChange={(e) => setSelectedModelId(e.target.value)} className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400">
                <option value="">Select an AI model</option>
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>{model.model_name} - {model.provider}</option>
                ))}
              </select>
            )}
            <label className="block mb-2 text-sm font-medium">Import File (PDF, DOC, DOCX, TXT)</label>
            <div className="w-full border border-dashed border-gray-300 rounded p-4 mb-4 text-center">
              <input type="file" className="hidden" id="file-upload-sidebar" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
              <label htmlFor="file-upload-sidebar" className="cursor-pointer text-blue-500">{formData.file ? formData.file.name : "Choose file or drag & drop"}</label>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowAddModal(false); setFormData({ title: "", description: "", file: null }); setSelectedModelId(""); }} className="px-4 py-2 border rounded hover:bg-gray-100" disabled={submitting}>Cancel</button>
              <button onClick={handleAddReviewer} className="px-4 py-2 bg-black text白 rounded hover:bg-gray-800 disabled:bg-gray-400" disabled={submitting}>{submitting ? "Adding..." : "Add"}</button>
            </div>
            <button onClick={() => { setShowAddModal(false); setFormData({ title: "", description: "", file: null }); setSelectedModelId(""); }} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg" disabled={submitting}>×</button>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          {notification.type === 'loading' ? (
            <div className="bg-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-700">{notification.message}</span>
              </div>
            </div>
          ) : (
            <div className={`rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {notification.type === 'success' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{notification.message}</p>
                </div>
                <button onClick={() => setNotification(null)} className={`${notification.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;



