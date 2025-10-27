import React from "react";

function ProfileNavbar() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg">
        New Post
      </button>
    </div>
  );
}

export default ProfileNavbar;
import ProfileHeader from "./ProfileHeader";
