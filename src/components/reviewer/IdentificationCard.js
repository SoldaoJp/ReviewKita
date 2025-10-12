// src/components/reviewer/IdentificationCard.js
import React, { useState } from "react";
import { ChevronLeft, Settings } from "lucide-react";

export default function IdentificationCard() {
  const [answer, setAnswer] = useState("");

  const question = {
    title: "Data Scalability",
    progress: 60,
    text: "_______ is the process of adding more machines or nodes to a system to handle increased load.",
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 font-sans py-8">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-3xl px-6 mb-3">
        {/* Back Button */}
        <button className="flex items-center text-gray-600 hover:text-blue-600 transition">
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 bg-blue-600 rounded-sm"></div>
          <span className="font-semibold text-gray-800 text-base">
            {question.title}
          </span>
          <Settings className="w-4.5 h-4.5 text-gray-500" />
        </div>

        <div className="w-7" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl px-6 mb-10">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${question.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Box */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-blue-100 p-8 mb-10">
        <p className="text-base font-medium text-gray-800 leading-relaxed">
          {question.text}
        </p>
      </div>

      {/* Answer Input + Button */}
      <div className="w-full max-w-md flex flex-col items-center space-y-5">
        <input
          type="text"
          placeholder="Type your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
        />
        <button className="px-10 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
          Next
        </button>
      </div>
    </div>
  );
}
