import React from 'react';
import { Trophy, Clock, CheckCircle, XCircle, SkipForward, RotateCcw, ArrowLeft } from 'lucide-react';

export default function QuizResults({ quiz, userAnswers, onRetake, onGoBack }) {
  const calculateStats = () => {
    const totalQuestions = quiz.questions.length;
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect === true).length;
    const incorrectAnswers = userAnswers.filter(answer => answer.isCorrect === false).length;
    const skippedAnswers = userAnswers.filter(answer => answer.isSkipped === true).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    return { totalQuestions, correctAnswers, incorrectAnswers, skippedAnswers, percentage };
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBg = (percentage) => {
    if (percentage >= 90) return 'bg-green-50 border-green-200';
    if (percentage >= 80) return 'bg-blue-50 border-blue-200';
    if (percentage >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Quiz Complete!</h1>
          </div>
          <p className="text-gray-600">{quiz.title}</p>
        </div>

        <div className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 ${getGradeBg(stats.percentage)}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getGradeColor(stats.percentage)}`}>{stats.percentage}%</div>
            <p className="text-gray-600 text-lg">{stats.correctAnswers} out of {stats.totalQuestions} correct</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.correctAnswers}</div>
            <p className="text-gray-600 text-sm">Correct Answers</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.incorrectAnswers}</div>
            <p className="text-gray-600 text-sm">Incorrect Answers</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <SkipForward className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-600 mb-1">{stats.skippedAnswers}</div>
            <p className="text-gray-600 text-sm">Skipped Questions</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Question Review</h3>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer.isCorrect === true;
              const isSkipped = userAnswer.isSkipped === true;
              
              const getOptionText = (optionKey) => {
                if (!question.options) return '';
                if (Array.isArray(question.options)) {
                  const option = question.options.find(opt => opt.startsWith(optionKey + ')'));
                  return option || '';
                } else {
                  return question.options[optionKey] || '';
                }
              };
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">{index + 1}. {question.question}</p>
                      {question.type === 'multiple-choice' && (
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600"><strong>Your answer:</strong> {isSkipped ? 'Skipped' : userAnswer.answer || 'No answer'}</p>
                          <p className="text-gray-600"><strong>Correct answer:</strong> {question.correct_answer}{question.options && ` (${getOptionText(question.correct_answer)})`}</p>
                        </div>
                      )}
                      {question.type === 'identification' && (
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600"><strong>Your answer:</strong> {isSkipped ? 'Skipped' : userAnswer.answer || 'No answer'}</p>
                          <p className="text-gray-600"><strong>Correct answer:</strong> {question.identification_answer}</p>
                        </div>
                      )}
                      {question.type === 'fill-in-the-blanks' && (
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600"><strong>Your answer:</strong> {isSkipped ? 'Skipped' : userAnswer.answer || 'No answer'}</p>
                          <p className="text-gray-600"><strong>Correct answer:</strong> {question.blank_answers?.join(', ') || 'N/A'}</p>
                        </div>
                      )}
                      {question.type === 'open-ended' && (
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600 italic">{isSkipped ? 'Skipped' : 'Your essay response will be graded by the system.'}</p>
                          {!isSkipped && userAnswer.answer && (
                            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Your Response:</p>
                              <p className="text-sm text-gray-700">{userAnswer.answer}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {question.type === 'open-ended' 
                        ? (isSkipped ? <SkipForward className="w-5 h-5 text-gray-400" /> : <Clock className="w-5 h-5 text-blue-500" title="Pending review" />)
                        : (isSkipped ? <SkipForward className="w-5 h-5 text-gray-400" /> : isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />)
                      }
                    </div>
                  </div>
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Explanation:</strong> {question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onRetake} className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            <RotateCcw className="w-5 h-5 mr-2" />Retake Quiz
          </button>
          <button onClick={onGoBack} className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />Back to Reviewer
          </button>
        </div>
      </div>
    </div>
  );
}


