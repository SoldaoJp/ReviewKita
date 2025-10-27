import React, { useState } from "react";
import { ChevronLeft, Clock, SkipForward } from "lucide-react";

export default function MultipleChoiceQuiz({
  question,
  questionNumber,
  totalQuestions,
  progress,
  timeLeft,
  formatTime,
  onAnswer,
  onSkip,
  onGoBack,
  quizTitle
}) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionClick = (optionKey) => {
    if (showFeedback) return;
    setSelected(optionKey);
    setShowFeedback(true);
    setTimeout(() => {
      onAnswer(optionKey);
      setSelected(null);
      setShowFeedback(false);
    }, 3000);
  };

  // Handle both array format ["A) text", "B) text"] and object format {A: "text", B: "text"}
  const options = question.options ? (() => {
    if (Array.isArray(question.options)) {
      // Array format: ["A) 0 m/sÂ²", "B) 9.8 m/sÂ²", ...]
      return question.options.map(opt => {
        const match = opt.match(/^([A-D])\)\s*(.+)$/);
        if (match) {
          return { key: match[1], text: match[2] };
        }
        return null;
      }).filter(Boolean);
    } else {
      // Object format: { A: "text", B: "text", ... }
      return [
        { key: 'A', text: question.options.A },
        { key: 'B', text: question.options.B },
        { key: 'C', text: question.options.C },
        { key: 'D', text: question.options.D }
      ].filter(opt => opt.text);
    }
  })() : [];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 font-sans py-8">
      <div className="grid grid-cols-3 items-center w-full max-w-4xl px-10 mb-3">
        <button onClick={onGoBack} className="text-gray-600 hover:text-blue-600 transition" disabled={showFeedback}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="justify-self-center flex items-center space-x-2">
          <div className="w-3.5 h-3.5 bg-blue-600 rounded-sm"></div>
          <span className="font-semibold text-gray-800 text-sm">{quizTitle}</span>
        </div>
        <div className="justify-self-end flex items-center space-x-3">
          {timeLeft !== null && (
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
            </div>
          )}
          <button onClick={onSkip} className="text-gray-500 hover:text-gray-700 transition" disabled={showFeedback} title="Skip question">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-10 mb-2">
        <p className="text-sm text-gray-500 text-center">Question {questionNumber} of {totalQuestions}</p>
      </div>

      <div className="w-full max-w-2xl px-6 mb-10">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-4 bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {question.scenario && (
        <div className="w-full max-w-4xl px-6 mb-4">
          <div className="w-full bg-yellow-50 rounded-xl border border-yellow-200 shadow-sm p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Scenario:</h4>
            <p className="text-sm text-yellow-700 leading-relaxed">{question.scenario}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl px-6 mb-6">
        <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm p-6">
          <p className="text-base font-medium text-gray-800 leading-relaxed">{question.question}</p>
        </div>
      </div>

      <div className="w-full max-w-4xl text-center mb-6">
        <hr className="border-gray-200 mb-3" />
        <p className="text-gray-500 text-sm">Choose the correct answer</p>
      </div>

      <div className="w-full max-w-4xl px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-10 justify-between">
          {options.map((option) => {
            let buttonClass = `w-full h-48 flex items-center justify-center rounded-xl text-gray-800 font-semibold text-base bg-gradient-to-b from-white to-blue-50 border border-gray-200 shadow-sm transition-all duration-200`;
            if (!showFeedback) {
              buttonClass += ` hover:shadow-lg hover:-translate-y-1 cursor-pointer`;
            } else {
              buttonClass += ` cursor-not-allowed`;
              if (selected === option.key) {
                if (option.key === question.correct_answer) buttonClass += ` bg-green-100 border-green-600 text-green-800 shadow-lg border-4`;
                else buttonClass += ` bg-red-100 border-red-600 text-red-800 shadow-lg border-4`;
              } else if (option.key === question.correct_answer) {
                buttonClass += ` bg-green-100 border-green-600 text-green-800 shadow-lg border-4`;
              }
            }
            return (
              <button key={option.key} onClick={() => handleOptionClick(option.key)} className={buttonClass} disabled={showFeedback}>
                <div className="text-center px-2">
                  <div className="font-bold text-lg mb-2">{option.key}</div>
                  <div className="text-sm leading-tight">{option.text}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showFeedback && question.explanation && (
        <div className="w-full max-w-4xl px-6 mt-8">
          <div className="w-full bg-blue-50 rounded-xl border border-blue-200 shadow-sm p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
            <p className="text-sm text-blue-700 leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}



