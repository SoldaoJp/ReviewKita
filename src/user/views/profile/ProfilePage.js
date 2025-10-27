import React, { useState, useEffect } from "react";
import Topbar from "../components/sidebar/Topbar";
import { getUserProfile, updateProfilePicture, changeUsername, changePassword } from "../../services/userService";
import { getAllReviewers } from "../../services/reviewerService";
import { useAuth } from "../../controllers/AuthContext";
import StreakIcon from "../../../assets/StreakIcon.svg";
import LongestStreakIcon from "../../../assets/LongestStreak.svg";
import AchievementIcon from "../../../assets/Achievement.svg";
import { Edit } from 'lucide-react';

function ProfilePage() {
  const { refreshUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [reviewerCount, setReviewerCount] = useState(0);
  const [notification, setNotification] = useState(null);
  const [quizCount] = useState(12);
  const [masteredCount] = useState(3);

  const fetchReviewerCount = async () => {
    try {
      const response = await getAllReviewers(1000);
      console.log('ProfilePage - Fetched reviewers:', response);
      if (response.success && Array.isArray(response.data)) {
        setReviewerCount(response.data.length);
      } else if (Array.isArray(response)) {
        setReviewerCount(response.length);
      }
    } catch (error) {
      console.error('Error fetching reviewers:', error);
      setReviewerCount(0);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setUserData(data);
      setFormData(prev => ({ ...prev, username: data.username }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      showNotification('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchReviewerCount();
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (profilePicFile) {
        await updateProfilePicture(profilePicFile);
      }

      if (formData.username !== userData.username) {
        await changeUsername(formData.username);
      }

      if (formData.currentPassword && formData.newPassword) {
        await changePassword(formData.currentPassword, formData.newPassword);
      }

      showNotification('Profile updated successfully!', 'success');
      setShowModal(false);
      await fetchUserProfile();
      await refreshUser();
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      setProfilePicFile(null);
      setProfilePicPreview(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification(error.message || 'Failed to update profile', 'error');
    }
  };

  const showNotification = (message, type = 'info', duration = 4000) => {
    setNotification({ message, type });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Topbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Topbar */}
      <Topbar />

      <div className="flex gap-6 mt-6">
        {/* Left Panel - Main Content */}
        <div className="flex-1">
          {/* Profile Card - Like Welcome Card */}
          <div className="bg-white/50 rounded-2xl p-6 shadow-sm border border-[#eef3fb] mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={userData?.profile_picture ? `http://localhost:5000/${userData.profile_picture}` : "https://via.placeholder.com/96"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-cyan-400 object-cover"
                />
                <div className="ml-6">
                  <h2 className="text-2xl font-bold">{userData?.username || 'User'}</h2>
                  <p className="text-gray-500">{userData?.email || 'No email'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats Section - Three Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-xs font-semibold text-gray-600 mb-1">Total Reviewers</h3>
              <p className="text-2xl font-bold text-green-700">{reviewerCount}</p>
              <p className="text-xs text-gray-500 mt-1">No. of reviewers</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="text-xs font-semibold text-gray-600 mb-1">Total Quizzes</h3>
              <p className="text-2xl font-bold text-yellow-700">{quizCount}</p>
              <p className="text-xs text-gray-500 mt-1">No. of generated quizzes</p>
            </div>
            <div className="bg-pink-100 p-4 rounded-lg">
              <h3 className="text-xs font-semibold text-gray-600 mb-1">Mastered</h3>
              <p className="text-2xl font-bold text-pink-700">{masteredCount}</p>
              <p className="text-xs text-gray-500 mt-1">Reviewer</p>
            </div>
          </div>

          {/* Progress Over Time removed per request */}
        </div>

        {/* Right Panel - Streak and Mastery */}
        <div className="w-80">
          {/* Streak and Badges */}
          <div className="bg-white/50 rounded-2xl p-6 shadow-sm border border-[#eef3fb] mb-6">
            <h3 className="text-lg font-bold mb-4">Streak and Badges</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <img src={StreakIcon} alt="Current Streak" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Streak</p>
                  <p className="text-lg font-bold">5 days</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <img src={LongestStreakIcon} alt="Longest Streak" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Longest Streak</p>
                  <p className="text-lg font-bold">7 days</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <img src={AchievementIcon} alt="Achievement" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Achievement</p>
                  <p className="text-lg font-bold">Over Achiever</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mastery removed per request */}
        </div>
      </div>

      {/* Floating Edit Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-xl shadow-lg relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              Ã—
            </button>

            <h2 className="text-xl font-semibold text-start mb-4">Edit Profile</h2>

            <div className="flex flex-col items-center mb-4">
              <img
                src={profilePicPreview || (userData?.profile_picture ? `http://localhost:5000/${userData.profile_picture}` : "https://via.placeholder.com/96")}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full border-4 border-cyan-400 object-cover mb-2"
              />
              <label className="cursor-pointer text-cyan-500 hover:text-cyan-600 text-sm font-medium">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email (Read-only)
                </label>
                <input
                  type="email"
                  value={userData?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Current Password (optional)
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setProfilePicFile(null);
                    setProfilePicPreview(null);
                    setFormData(prev => ({ 
                      ...prev, 
                      username: userData.username,
                      currentPassword: '', 
                      newPassword: '' 
                    }));
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Floating notification (top-right) - reuse same design as Sidebar */}
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

export default ProfilePage;

