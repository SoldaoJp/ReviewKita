// src/components/dashboard/WelcomeCard.js
import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/userService";
import Image from "../../../assets/tasks.png";

export default function WelcomeCard({ user }) {
  const [username, setUsername] = useState(user?.name || "User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const data = await getUserProfile();
        setUsername(data.username);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  return (
    <div className="bg-white/50 rounded-2xl p-6 shadow-sm border border-[#eef3fb]">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl leading-tight font-bold text-gray-900">
            Welcome Back,
            <br />
            <span className="block">{loading ? "..." : username}</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Smarter studying starts here</p>

          <button className="mt-5 inline-flex items-center gap-3 bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-95 transition">
            Start Quiz
          </button>
        </div>

        {/* small decorative control / illustration aligned to top right using imported image */}
        <div className="w-36 h-36 rounded-lg flex items-center justify-center overflow-hidden">
          <img src={Image} alt="Tasks" className="w-32 h-32 object-contain" />
        </div>
      </div>
    </div>
  );
}
