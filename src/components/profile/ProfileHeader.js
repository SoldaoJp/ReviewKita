import React from "react";

function ProfileHeader() {
  return (
    <div className="profile-card">
      <div className="profile-picture">
        <img
          src="https://via.placeholder.com/120"
          alt="User"
        />
      </div>
      <div className="profile-info">
        <h2>Jhamp Soldao</h2>
        <p>@jhamp_soldao</p>
        <p>Email: jhamp@example.com</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
