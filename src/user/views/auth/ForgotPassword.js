import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import Logo from "../../../assets/logo.png";

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
    
    // Validate email format
    if (!email || !email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setSuccess("A password reset link has been sent to your email address. Please check your inbox.");
        setEmail(""); // Clear email field on success
      }
      
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Failed to send reset link. Please try again.");
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
            {require('../components/auth/AuthTopbar').default({ showButtons: false })}
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
            Lost access? Let's get you back on track.
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Enter your registered email and we'll send a secure link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
          
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
