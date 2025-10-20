// src/components/auth/ConfirmReset.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmReset() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-hero-start via-hero-mid to-hero-end">
      {/* ===== Decorative circles (same as Login/Signup) ===== */}
      <div className="hidden md:block absolute z-10 right-24 top-20 w-[420px] h-[420px] rounded-full bg-white/90 drop-shadow-2xl rotate-6"></div>
      <div className="hidden md:block absolute z-20 right-8 top-52 w-[240px] h-[240px] rounded-full bg-white/60 drop-shadow-xl"></div>
      <div className="hidden md:block absolute z-0 right-0 bottom-[-60px] w-[300px] h-[300px] rounded-full bg-white/70 drop-shadow-2xl"></div>

      {/* Topbar (no signup/login buttons) */}
      <header className="relative z-10">
        <div className="fixed w-full top-0 left-0">
          <div className="max-w-7xl mx-auto">
            {require('../components/auth/AuthTopbar').default({ showButtons: false })}
          </div>
        </div>
      </header>

      {/* Center Card */}
      <div className="flex-1 flex justify-center items-center relative z-10 pt-24">
        <div className="relative z-10 bg-white/40 backdrop-blur-xl p-10 rounded-2xl shadow-lg w-full max-w-md mx-4 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your password has been reset.
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Log in to pick up where you left off—your reviewers, progress, and study goals are waiting.
          </p>

          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
