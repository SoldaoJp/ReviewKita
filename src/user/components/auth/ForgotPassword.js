import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.png"; // use same logo as signup

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    
    // Simulate API call since backend routes don't exist yet
    // TODO: Replace with actual API call when backend is implemented
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      setSuccess("A reset link has been sent to your email address. (Demo mode - backend not implemented)");
      
      // Uncomment below when backend is ready:
      // await axios.post("/api/auth/forgot-password", { email });
      // setSuccess("A reset link has been sent to your email address.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
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
            {/* Use AuthTopbar with showButtons={false} */}
            {require('./AuthTopbar').default({ showButtons: false })}
          </div>
        </div>
      </header>

      {/* Center Card */}
      <div className="flex-1 flex justify-center items-center relative z-10 pt-24">
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
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send link"}
            </button>
          </form>
          {success && <p className="text-green-600 mt-4">{success}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;