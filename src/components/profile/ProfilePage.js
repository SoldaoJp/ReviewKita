import React, { useState, useEffect } from "react";
import Topbar from "../sidebar/Topbar";
import { getUserProfile, updateProfilePicture, changeUsername, changePassword } from "../../services/userService";
import { getAllReviewers } from "../../services/reviewerService";
import { useAuth } from "../../controllers/AuthContext";

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
  const [quizCount] = useState(12); // static value
  const [masteredCount] = useState(3); // static value

  // Fetch reviewer count
  const fetchReviewerCount = async () => {
    try {
      const response = await getAllReviewers(1, 1000);
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
      alert('Failed to load profile data');
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
      // Upload profile picture if changed
      if (profilePicFile) {
        await updateProfilePicture(profilePicFile);
      }

      // Update username if changed
      if (formData.username !== userData.username) {
        await changeUsername(formData.username);
      }

      // Update password if provided
      if (formData.currentPassword && formData.newPassword) {
        await changePassword(formData.currentPassword, formData.newPassword);
      }

      alert('Profile updated successfully!');
      setShowModal(false);
      await fetchUserProfile(); // Refresh profile data
      await refreshUser(); // Refresh user context for topbar and other components
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      setProfilePicFile(null);
      setProfilePicPreview(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
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
      {/* Topbar copied from dashboard */}
      <Topbar />

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src={userData?.profile_picture ? `http://localhost:5000/${userData.profile_picture}` : "https://via.placeholder.com/96"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-cyan-400 object-cover"
            />
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{userData?.username || 'User'}</h2>
              <p className="text-gray-500">{userData?.email || 'No email'}</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">Total Reviewers</h3>
            <p className="text-2xl font-bold text-green-700">{reviewerCount}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">Total Quizzes</h3>
            <p className="text-2xl font-bold text-yellow-700">{quizCount}</p>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">Mastered</h3>
            <p className="text-2xl font-bold text-pink-700">{masteredCount}</p>
          </div>
        </div>

        {/* Progress Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-4">Progress over time</h3>
          <div className="h-48 flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>Minutes Studied: 0</span>
            <span>Questions Answered: 0</span>
            <span>Accuracy: 0%</span>
          </div>
        </div>

        {/* Streak and Badges */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-4">Streak and Badges</h3>
          <div className="mb-4">
            <p className="text-gray-600">Current Streak: <b></b></p>
            <p className="text-gray-600">Longest Streak: <b></b></p>
            <p className="text-gray-600">Achievement: <b></b></p>
          </div>
        </div>

        {/* Mastery */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-4">Mastery</h3>
          <div className="space-y-3">
          {[
            { label: "Data Scalability", color: "bg-blue-500", width: "w-4/5" },
            { label: "Quantitative Methods", color: "bg-pink-500", width: "w-2/3" },
            { label: "Advanced Database", color: "bg-purple-500", width: "w-1/2" },
            { label: "Networking 2", color: "bg-green-500", width: "w-3/5" },
            { label: "Advanced Programming", color: "bg-orange-500", width: "w-1/3" },
            { label: "IAS", color: "bg-red-500", width: "w-1/4" },
          ].map((item, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-600">{item.label}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${item.color} ${item.width} h-2 rounded-full`}></div>
              </div>
            </div>
          ))}
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
              ×
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
    </div>
  );
}

export default ProfilePage;
