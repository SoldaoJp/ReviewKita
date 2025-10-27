import React, { useState } from "react";
import { ChevronLeft, Clock, SkipForward } from "lucide-react";

export default function IdentificationQuiz({
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
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const userAnswer = answer.trim();
    const correctAnswer = question.identification_answer;
    const correct = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
    setTimeout(() => {
      onAnswer(userAnswer);
      setAnswer("");
      setShowFeedback(false);
      setIsCorrect(false);
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showFeedback) handleSubmit();
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

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-blue-100 p-8 mb-10">
        <p className="text-base font-medium text-gray-800 leading-relaxed mb-4">{question.question}</p>
      </div>

      <div className="w-full max-w-md flex flex-col items-center space-y-5">
        <input type="text" placeholder="Type your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyPress={handleKeyPress} disabled={showFeedback} className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 font-medium ${showFeedback ? (isCorrect ? 'border-green-500 bg-green-100 text-green-800 focus:ring-green-400' : 'border-red-500 bg-red-100 text-red-800 focus:ring-red-400') : 'border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-400'}`} />
        <button onClick={handleSubmit} disabled={!answer.trim() || showFeedback} className="px-10 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {showFeedback ? (isCorrect ? 'Correct!' : 'Incorrect') : 'Submit'}
        </button>
      </div>

      {showFeedback && (
        <div className="w-full max-w-2xl px-6 mt-8">
          <div className={`w-full rounded-xl border-2 shadow-lg p-4 ${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
            <div className="text-center mb-3">
              <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </span>
            </div>
            {!isCorrect && (
              <div className="text-center mb-3">
                <p className="text-sm text-red-700"><strong>Correct answer:</strong> {question.identification_answer}</p>
              </div>
            )}
            {question.explanation && (
              <div>
                <h4 className={`font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>Explanation:</h4>
                <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{question.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



