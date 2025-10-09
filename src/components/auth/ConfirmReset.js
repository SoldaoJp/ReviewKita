// src/components/auth/ConfirmReset.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmReset() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Header */}
      <div className="flex items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            R
          </div>
          <span className="font-semibold text-lg text-gray-800">ReviewKita</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex justify-center items-center relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute right-0 w-[600px] h-[600px] bg-blue-200 rounded-full blur-3xl opacity-50 translate-x-32 -translate-y-20"></div>
        <div className="absolute right-20 bottom-20 w-[300px] h-[300px] bg-blue-300 rounded-full blur-2xl opacity-60"></div>

        {/* Confirmation Box */}
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
