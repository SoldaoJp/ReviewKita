    // src/components/auth/ResetPassword.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";

    export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/confirm-reset"); // navigate to confirmation page
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-300">
        {/* Header Logo */}
        <div className="flex items-center p-6">
            <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                R
            </div>
            <span className="font-semibold text-lg text-gray-800">ReviewKita</span>
            </div>
        </div>

        {/* Reset Card */}
        <div className="flex-1 flex justify-center items-center relative overflow-hidden">
            {/* Background circles */}
            <div className="absolute right-0 w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 translate-x-32 -translate-y-20"></div>
            <div className="absolute right-20 bottom-20 w-[250px] h-[250px] bg-blue-300 rounded-full blur-2xl opacity-60"></div>

            {/* Card Content */}
            <div className="relative z-10 bg-white/40 backdrop-blur-xl p-10 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Time to refresh your access.
            </h2>
            <p className="text-gray-600 text-sm mb-6">
                Enter your new password below and confirm it to complete the reset.
                Make sure it’s strong, memorable, and uniquely yours—your reviewers
                and progress are waiting.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter New Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? (
                    // Eye open
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
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.104 2.354M15.536 15.536A5.978 5.978 0 0112 17c-4.477 0-8.268-2.943-9.542-7"
                        />
                    </svg>
                    ) : (
                    // Eye closed
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

                {/* Confirm Password */}
                <div className="relative">
                <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showConfirm ? (
                    // Eye open
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
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.104 2.354M15.536 15.536A5.978 5.978 0 0112 17c-4.477 0-8.268-2.943-9.542-7"
                        />
                    </svg>
                    ) : (
                    // Eye closed
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

                <button
                type="submit"
                className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                Register
                </button>
            </form>
            </div>
        </div>
        </div>
    );
    }
