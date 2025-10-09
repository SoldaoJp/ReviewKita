import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png"; // use same logo as signup

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    navigate("/reset-password");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-hero-start via-hero-mid to-hero-end">
      {/* Decorative background shapes (same as signup) */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 z-0"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 z-0"></div>

      {/* Header (same style as signup) */}
      <header className="relative flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-sm shadow-md z-10">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="ReviewKita Logo" className="h-8 w-8" />
          <span className="font-bold text-gray-800">ReviewKita</span>
        </div>

        <div className="flex space-x-3">
          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Center Card */}
      <div className="flex-1 flex justify-center items-center relative z-10">
        <div className="relative z-10 bg-white/40 backdrop-blur-xl p-10 rounded-2xl shadow-lg w-full max-w-md mx-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center mb-6"
          >
            ←
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Lost access? Let’s get you back on track.
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Enter your registered email and we’ll send a secure link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Send link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;