import React from "react";

function ProfilePosts() {
  const posts = [
    { id: 1, text: "This is my first post 🎉" },
    { id: 2, text: "Excited to share my project updates 🚀" },
  ];

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-neutral-800 p-4 rounded-lg border border-cyan-400"
        >
          <p>{post.text}</p>
        </div>
      ))}
    </div>
  );
}

export default ProfilePosts;
import ProfileNavbar from "./ProfileNavbar";
import ProfileHeader from "./ProfileHeader";