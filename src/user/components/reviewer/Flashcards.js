import React, { useState } from "react";
import { ChevronLeft, Settings } from "lucide-react";

export default function Flashcards() {
  const [selected, setSelected] = useState(null);

  const question = {
    title: "Data Scalability",
    progress: 60,
    text: "_______ is the process of adding more machines or nodes to a system to handle increased load.",
    options: [
      "Horizontal Scaling",
      "Vertical Scaling",
      "Parallel Scaling",
      "Mountain Scaling",
    ],
    correct: 0,
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 font-sans py-8">
      <div className="grid grid-cols-3 items-center w-full max-w-4xl px-10 mb-3">
        <button className="text-gray-600 hover:text-blue-600 transition">
      <ChevronLeft className="w-6 h-6" />
    </button>
        <div className="justify-self-center flex items-center space-x-2">
          <div className="w-3.5 h-3.5 bg-blue-600 rounded-sm"></div>
          <span className="font-semibold text-gray-800 text-sm">
            {question.title}
          </span>
          <Settings className="w-4 h-4 text-gray-500" />
        </div>
        <div className="justify-self-end w-6" />
      </div>

       <div className="w-full max-w-2xl px-6 mb-10">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${question.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-6 mb-6">
        <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm p-6">
          <p className="text-base font-medium text-gray-800 leading-relaxed">
            {question.text}
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl text-center mb-6">
        <hr className="border-gray-200 mb-3" />
        <p className="text-gray-500 text-sm">Choose the correct answer</p>
      </div>

      <div className="w-full max-w-4xl px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-10 justify-between">
          {question.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`w-full h-48 flex items-center justify-center rounded-xl text-gray-800 font-semibold text-base bg-gradient-to-b from-white to-blue-50 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${
                selected === index
                  ? index === question.correct
                    ? "bg-green-100 border-green-500"
                    : "bg-red-100 border-red-500"
                  : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


