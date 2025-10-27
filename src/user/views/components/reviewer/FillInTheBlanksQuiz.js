import React, { useState } from "react";
import { ChevronLeft, Clock, SkipForward } from "lucide-react";

export default function FillInTheBlanksQuiz({
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
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctnessMap, setCorrectnessMap] = useState({});

  const parseQuestion = () => {
    const text = question.question || "";
    const blanks = question.fill_in_the_blank_answers || [];
    
    const parts = text.split(/(___|blank|\[blank\])/gi);
    let blankIndex = 0;
    
    return parts.map((part, idx) => {
      if (part === '___' || part.toLowerCase() === 'blank' || part === '[blank]') {
        const currentBlankIndex = blankIndex;
        blankIndex++;
        return { type: 'blank', index: currentBlankIndex };
      }
      return { type: 'text', content: part };
    });
  };

  const questionParts = parseQuestion();
  const totalBlanks = questionParts.filter(p => p.type === 'blank').length;

  const handleInputChange = (blankIndex, value) => {
    setAnswers(prev => ({ ...prev, [blankIndex]: value }));
  };

  const handleSubmit = () => {
    const allAnswersFilled = Object.keys(answers).length === totalBlanks && 
      Object.values(answers).every(a => a && a.trim());
    
    if (!allAnswersFilled) return;

    const correctAnswers = question.fill_in_the_blank_answers || [];
    const correctnessResults = {};
    
    Object.keys(answers).forEach((blankIndex) => {
      const userAnswer = answers[blankIndex].trim().toLowerCase();
      const correctAnswer = correctAnswers[parseInt(blankIndex)]?.toLowerCase() || '';
      correctnessResults[blankIndex] = userAnswer === correctAnswer;
    });

    setCorrectnessMap(correctnessResults);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(answers);
      setAnswers({});
      setShowFeedback(false);
      setCorrectnessMap({});
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showFeedback) {
      handleSubmit();
    }
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
        <p className="text-sm text-gray-500 mb-4">Fill in the blanks below:</p>
        <div className="text-base font-medium text-gray-800 leading-relaxed">
          {questionParts.map((part, idx) => {
            if (part.type === 'text') {
              return <span key={idx}>{part.content}</span>;
            } else {
              const blankIndex = part.index;
              const isCorrect = correctnessMap[blankIndex];
              const hasFeedback = showFeedback && correctnessMap.hasOwnProperty(blankIndex);
              
              return (
                <input
                  key={idx}
                  type="text"
                  value={answers[blankIndex] || ''}
                  onChange={(e) => handleInputChange(blankIndex, e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={showFeedback}
                  placeholder={`blank ${blankIndex + 1}`}
                  className={`inline-block mx-1 px-3 py-1 rounded border-2 focus:outline-none focus:ring-2 min-w-[120px] text-center ${
                    hasFeedback
                      ? isCorrect
                        ? 'border-green-500 bg-green-100 text-green-800 focus:ring-green-400'
                        : 'border-red-500 bg-red-100 text-red-800 focus:ring-red-400'
                      : 'border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-400'
                  }`}
                />
              );
            }
          })}
        </div>
      </div>

      <div className="w-full max-w-2xl px-6 flex flex-col items-center space-y-5">
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== totalBlanks || showFeedback}
          className="px-10 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showFeedback ? 'Submitted!' : 'Submit Answers'}
        </button>
      </div>

      {showFeedback && (
        <div className="w-full max-w-2xl px-6 mt-8">
          <div className="w-full rounded-xl border-2 shadow-lg p-4 bg-blue-100 border-blue-500">
            <div className="text-center mb-3">
              <span className="font-semibold text-blue-800">
                {Object.values(correctnessMap).every(c => c) ? 'âœ“ All Correct!' : 'âœ— Some answers are incorrect'}
              </span>
            </div>
            {!Object.values(correctnessMap).every(c => c) && (
              <div className="mb-3">
                <p className="text-sm text-blue-700 mb-2"><strong>Correct answers:</strong></p>
                <ul className="text-sm text-blue-700 list-disc list-inside">
                  {(question.fill_in_the_blank_answers || []).map((answer, idx) => (
                    <li key={idx}>Blank {idx + 1}: {answer}</li>
                  ))}
                </ul>
              </div>
            )}
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

