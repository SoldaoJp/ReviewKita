// src/components/auth/Signup.js
import React, { useState } from "react";
import Logo from "../../assets/logo.png"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import authController from "../../controllers/authController.js";

function Signup() {
  const navigate = useNavigate();

  // states for password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authController.handleRegister(formData, navigate, setError, setLoading, setSuccess);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-hero-start via-hero-mid to-hero-end">
      {/* ===== Navbar/Header ===== */}
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2 -ml-4">
            <img src={Logo} alt="ReviewKita Logo" className="h-8 w-auto" />
            <span className="font-semibold text-slate-900 text-lg">
              ReviewKita
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              className="px-4 py-1.5 rounded-md bg-black text-white text-sm hover:bg-gray-800"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button className="px-4 py-1.5 rounded-md border border-gray-400 text-sm text-slate-800 hover:bg-gray-100">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* ===== Decorative circles ===== */}
      <div className="hidden md:block absolute z-10 right-24 top-20 w-[420px] h-[420px] rounded-full bg-white/90 drop-shadow-2xl rotate-6"></div>
      <div className="hidden md:block absolute z-20 right-8 top-52 w-[240px] h-[240px] rounded-full bg-white/60 drop-shadow-xl"></div>
      <div className="hidden md:block absolute z-0 right-0 bottom-[-60px] w-[300px] h-[300px] rounded-full bg-white/70 drop-shadow-2xl"></div>

      {/* ===== Content / Signup Card ===== */}
      <main className="relative z-30 flex items-center justify-center min-h-screen px-4 pt-24">
        <div className="w-full max-w-md md:max-w-xl p-8 md:p-10 rounded-2xl glass-card shadow-lg bg-white/70 backdrop-blur">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
            Join ReviewKita Today
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Unlock smarter studying with AI-powered quizzes, flashcards, and
            summaries. Track your progress, stay motivated with achievements,
            and transform your notes into interactive learning experiences —
            all in one platform.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full rounded-md px-4 py-3 bg-white/40 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur disabled:opacity-50"
              style={{ backgroundColor: "rgba(255,255,255,0.28)" }}
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full rounded-md px-4 py-3 bg-white/40 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur disabled:opacity-50"
              style={{ backgroundColor: "rgba(255,255,255,0.28)" }}
              required
            />

            {/* Password with eye toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full rounded-md px-4 py-3 bg-white/40 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur disabled:opacity-50"
                style={{ backgroundColor: "rgba(255,255,255,0.28)" }}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? (
                  // Eye open SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.104 2.354M15.536 15.536A5.978 5.978 0 0112 17c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.54-3.536"
                    />
                  </svg>
                ) : (
                  // Eye closed SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.54-3.536M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.357 2.592M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password with eye toggle */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full rounded-md px-4 py-3 bg-white/40 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur disabled:opacity-50"
                style={{ backgroundColor: "rgba(255,255,255,0.28)" }}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={loading}
                style={{ backgroundColor: "rgba(255,255,255,0.28)" }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  // Eye open SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.104 2.354M15.536 15.536A5.978 5.978 0 0112 17c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.54-3.536"
                    />
                  </svg>
                ) : (
                  // Eye closed SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.54-3.536M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.357 2.592M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Button same size as login */}
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Signup;
