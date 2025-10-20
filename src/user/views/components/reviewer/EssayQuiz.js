import React, { useState } from "react";
import { ChevronLeft, Clock, SkipForward } from "lucide-react";

export default function EssayQuiz({
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
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setShowFeedback(true);
    setTimeout(() => {
      onAnswer(answer.trim());
      setAnswer("");
      setShowFeedback(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 font-sans py-8">
      <div className="flex items-center justify-between w-full max-w-3xl px-6 mb-3">
        <button onClick={onGoBack} className="flex items-center text-gray-600 hover:text-blue-600 transition" disabled={showFeedback}>
          <ChevronLeft className="w-7 h-7" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 bg-blue-600 rounded-sm"></div>
          <span className="font-semibold text-gray-800 text-base">{quizTitle}</span>
        </div>
        <div className="flex items-center space-x-3">
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

      <div className="w-full max-w-3xl px-6 mb-2">
        <p className="text-sm text-gray-500 text-center">Question {questionNumber} of {totalQuestions}</p>
      </div>

      <div className="w-full max-w-2xl px-6 mb-10">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-4 bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {question.scenario && (
        <div className="w-full max-w-2xl px-6 mb-6">
          <div className="w-full bg-yellow-50 rounded-2xl border border-yellow-200 shadow-sm p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Scenario:</h4>
            <p className="text-sm text-yellow-700 leading-relaxed">{question.scenario}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-blue-100 p-8 mb-6">
        <p className="text-base font-medium text-gray-800 leading-relaxed mb-4">{question.question}</p>
      </div>

      <div className="w-full max-w-2xl px-6 mb-4">
        <p className="text-sm text-gray-600 text-center mb-2">Write your essay response below</p>
      </div>

      <div className="w-full max-w-2xl px-6 flex flex-col items-center space-y-5">
        <textarea
          placeholder="Type your essay answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={showFeedback}
          rows={8}
          className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 font-medium resize-none ${
            showFeedback 
              ? 'border-blue-500 bg-blue-50 text-blue-800 focus:ring-blue-400' 
              : 'border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-400'
          }`}
        />
        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || showFeedback}
          className="px-10 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showFeedback ? 'Submitted!' : 'Submit Answer'}
        </button>
      </div>

      {showFeedback && question.essay_sample_answer && (
        <div className="w-full max-w-2xl px-6 mt-8">
          <div className="w-full rounded-xl border-2 shadow-lg p-4 bg-blue-100 border-blue-500">
            <div className="mb-3">
              <h4 className="font-semibold text-blue-800 mb-2">Sample Answer:</h4>
              <p className="text-sm text-blue-700 leading-relaxed">{question.essay_sample_answer}</p>
            </div>
            {question.explanation && (
              <div className="mt-4 pt-4 border-t border-blue-300">
                <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                <p className="text-sm text-blue-700 leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
