import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizByReviewer, deleteQuiz, submitQuiz } from '../../services/quizService';
import MultipleChoiceQuiz from '../components/reviewer/MultipleChoiceQuiz';
import IdentificationQuiz from '../components/reviewer/IdentificationQuiz';
import EssayQuiz from '../components/reviewer/EssayQuiz';
import FillInTheBlanksQuiz from '../components/reviewer/FillInTheBlanksQuiz';
import QuizResults from '../components/reviewer/QuizResults';
import { addAttempt as saveQuizAttempt } from '../../services/quizHistoryService';

function QuizPage() {
  const { reviewerId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [reviewerId]);

  useEffect(() => {
    if (!quiz || !quiz.settings.timerMinutes || quiz.settings.timerMinutes === 0) return;
    if (!startTime) {
      setStartTime(Date.now());
      setTimeLeft(quiz.settings.timerMinutes * 60);
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleQuizComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, startTime]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await getQuizByReviewer(reviewerId);
      if (!response.quiz) throw new Error('Quiz data not found in response');
      setQuiz(response.quiz);
      const initialAnswers = response.quiz.questions.map(q => ({
        questionId: q.id,
        answer: null,
        isCorrect: null,
        isSkipped: false,
        timePerQuestionSeconds: null
      }));
      setUserAnswers(initialAnswers);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    let isCorrect = null;
    
    // Determine correctness based on question type
    if (currentQuestion.type === 'multiple-choice') {
      isCorrect = answer === currentQuestion.correct_answer;
    } else if (currentQuestion.type === 'identification') {
      isCorrect = answer.toLowerCase().trim() === currentQuestion.identification_answer.toLowerCase().trim();
    } else if (currentQuestion.type === 'fill-in-the-blanks') {
      // For fill-in-the-blanks, answer is an object with blank indices as keys
      const correctAnswers = currentQuestion.blank_answers || [];
      isCorrect = Object.keys(answer).every((blankIndex) => {
        const userAnswer = answer[blankIndex].trim().toLowerCase();
        const correctAnswer = correctAnswers[parseInt(blankIndex)]?.toLowerCase() || '';
        return userAnswer === correctAnswer;
      });
    } else if (currentQuestion.type === 'open-ended') {
      // Open-ended questions are subjectively graded, mark as answered (not auto-graded)
      isCorrect = null; // No auto-grading for open-ended
    }
    
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      answer,
      isCorrect,
      isSkipped: false,
      timePerQuestionSeconds: Math.floor((Date.now() - (startTime || Date.now())) / 1000)
    };
    setUserAnswers(updatedAnswers);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Use the freshest answers to avoid missing the last response
      handleQuizComplete(false, updatedAnswers);
    }
  };

  const handleSkip = () => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: quiz.questions[currentQuestionIndex].id,
      answer: null,
      isCorrect: null,
      isSkipped: true,
      timePerQuestionSeconds: Math.floor((Date.now() - (startTime || Date.now())) / 1000)
    };
    setUserAnswers(updatedAnswers);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Use the freshest answers on final skip
      handleQuizComplete(false, updatedAnswers);
    }
  };

  const handleQuizComplete = async (timeUp = false, answersOverride = null) => {
    const answers = answersOverride || userAnswers;
    
    // Prepare answers in the format expected by the backend
    const formattedAnswers = answers.map((ans, idx) => ({
      questionId: idx + 1, // 1-based question number
      answer: ans?.answer || undefined,
      isSkipped: ans?.isSkipped || false,
      timePerQuestionSeconds: ans?.timePerQuestionSeconds || 0
    }));

    try {
      // Submit quiz to backend
      const submitResponse = await submitQuiz(quiz._id, formattedAnswers);
      
      // Extract result from backend response
      const result = submitResponse.result || {};
      const total = result.total || quiz.questions.length;
      const correct = result.correct || 0;
      const percentage = result.scorePercent || 0;

      // Save to quiz history
      try {
        await saveQuizAttempt({
          reviewerId,
          reviewerTitle: quiz.reviewerTitle || quiz.reviewer?.title || undefined,
          quizId: quiz._id,
          title: quiz.title,
          finishedAt: new Date().toISOString(),
          stats: { correct, total, percentage },
          questions: quiz.questions,
          answers,
        });
      } catch (historyError) {
        console.error('Failed to save to quiz history:', historyError);
      }

      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      // Fallback to client-side calculation if backend fails
      const total = quiz.questions.length;
      const correct = answers.filter(a => a?.isCorrect === true).length;
      const percentage = Math.round((correct / total) * 100);
      
      try {
        await saveQuizAttempt({
          reviewerId,
          reviewerTitle: quiz.reviewerTitle || quiz.reviewer?.title || undefined,
          quizId: quiz._id,
          title: quiz.title,
          finishedAt: new Date().toISOString(),
          stats: { correct, total, percentage },
          questions: quiz.questions,
          answers,
        });
      } catch {}
      
      setIsCompleted(true);
    }
  };

  const calculateProgress = () => ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleBackClick = () => {
    if (!isCompleted) setShowExitModal(true);
    else navigate(-1);
  };

  const handleConfirmLeave = async () => {
    try {
      setShowExitModal(false);
      if (quiz && quiz._id) await deleteQuiz(quiz._id);
      navigate(-1);
    } catch { navigate(-1); }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go Back</button>
      </div>
    </div>
  );

  if (!quiz) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <p className="text-gray-600 mb-4">No quiz found for this reviewer.</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go Back</button>
      </div>
    </div>
  );

  if (isCompleted) return (
    <QuizResults
      quiz={quiz}
      userAnswers={userAnswers}
      onRetake={() => {
        setCurrentQuestionIndex(0);
        setIsCompleted(false);
        setUserAnswers(quiz.questions.map(q => ({
          questionId: q.id,
          answer: null,
          isCorrect: null,
          isSkipped: false,
          timePerQuestionSeconds: null
        })));
        setStartTime(Date.now());
        if (quiz.settings.timerMinutes > 0) setTimeLeft(quiz.settings.timerMinutes * 60);
      }}
      onGoBack={handleBackClick}
    />
  );

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Render Multiple Choice Quiz
  if (currentQuestion.type === 'multiple-choice') return (
    <>
      <MultipleChoiceQuiz
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        progress={calculateProgress()}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onGoBack={handleBackClick}
        quizTitle={quiz.title}
      />
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Leave Quiz?</h3>
            <p className="text-gray-600 text-sm mb-6">Leaving this page will reset all questions and progress.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowExitModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
              <button onClick={handleConfirmLeave} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">Leave</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Render Essay Quiz (open-ended questions)
  if (currentQuestion.type === 'open-ended') return (
    <>
      <EssayQuiz
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        progress={calculateProgress()}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onGoBack={handleBackClick}
        quizTitle={quiz.title}
      />
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Leave Quiz?</h3>
            <p className="text-gray-600 text-sm mb-6">Leaving this page will reset all questions and progress.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowExitModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
              <button onClick={handleConfirmLeave} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">Leave</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Render Fill in the Blanks Quiz
  if (currentQuestion.type === 'fill-in-the-blanks') return (
    <>
      <FillInTheBlanksQuiz
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        progress={calculateProgress()}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onGoBack={handleBackClick}
        quizTitle={quiz.title}
      />
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Leave Quiz?</h3>
            <p className="text-gray-600 text-sm mb-6">Leaving this page will reset all questions and progress.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowExitModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
              <button onClick={handleConfirmLeave} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">Leave</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Render Identification Quiz (default/fallback)
  return (
    <>
      <IdentificationQuiz
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        progress={calculateProgress()}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onGoBack={handleBackClick}
        quizTitle={quiz.title}
      />
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Leave Quiz?</h3>
            <p className="text-gray-600 text-sm mb-6">Leaving this page will reset all questions and progress.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowExitModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
              <button onClick={handleConfirmLeave} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">Leave</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuizPage;



