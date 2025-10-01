import React from "react";
import "./ProfilePage.css";

function ProfilePage() {
  return (
    <div className="profile-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li>Home</li>
          <li>Profile</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      </aside>

      {/* Main Profile Section */}
      <main className="profile-main">
        <div className="profile-card">
          {/* Profile Picture */}
          <div className="profile-picture">
            <img
              src="https://via.placeholder.com/120"
              alt="User"
            />
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            <h2>Jhamp Soldao</h2>
            <p>@jhamp_soldao</p>
            <p>Email: jhamp@example.com</p>
            <button className="edit-btn">Edit Profile</button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="profile-posts">
          <h3>My Posts</h3>
          <div className="post">
            <p>This is my first post 🎉</p>
          </div>
          <div className="post">
            <p>Just updated my profile picture 😎</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
