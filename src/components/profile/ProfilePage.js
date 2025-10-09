import React, { useState } from "react";

function ProfilePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border rounded-lg w-1/3 focus:ring-2 focus:ring-cyan-400"
          />
          <img
            src="" /* Add profile picture URL */
            alt="User"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src="" /* Add profile picture URL */
              className="w-24 h-24 rounded-full border-4 border-cyan-400"
            />
            <div className="ml-6">
              <h2 className="text-2xl font-bold">Ahron Paul Rivo</h2>
              <p className="text-gray-500">ahronrivo@gmail.com</p>
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
            <p className="text-2xl font-bold text-green-700">0</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">Total Quizzes</h3>
            <p className="text-2xl font-bold text-yellow-700">0</p>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">Mastered</h3>
            <p className="text-2xl font-bold text-pink-700">0</p>
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
      </main>

      {/* Right Sidebar */}
      <aside className="w-72 bg-white p-6 shadow-md border-l">
        <h3 className="text-lg font-bold mb-4">Streak and Badges</h3>
        <div className="mb-4">
          <p className="text-gray-600">Current Streak: <b></b></p>
          <p className="text-gray-600">Longest Streak: <b></b></p>
          <p className="text-gray-600">Achievement: <b></b></p>
        </div>

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
      </aside>

      {/* Floating Edit Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-xl shadow-lg relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
            </button>

            <h2 className="text-xl font-semibold text-start mb-4">Edit Profile</h2>

            <div className="flex justify-center mb-4">
              <img
                src="" /* Add profile picture URL */
                className="w-24 h-24 rounded-full border-4 border-cyan-400"
              />
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Ahron"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="ahronrivo@gmail.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
