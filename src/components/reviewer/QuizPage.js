import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizByReviewer } from '../../services/quizService';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';
import IdentificationQuiz from './IdentificationQuiz';
import QuizResults from './QuizResults';
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

  useEffect(() => {
    fetchQuiz();
  }, [reviewerId]);

  // Timer logic
  useEffect(() => {
    if (!quiz || !quiz.settings.timerMinutes || quiz.settings.timerMinutes === 0) return;
    
    if (!startTime) {
      setStartTime(Date.now());
      setTimeLeft(quiz.settings.timerMinutes * 60);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleQuizComplete(true); // Auto-submit when time runs out
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
      console.log('Fetching quiz for reviewerId:', reviewerId);
      const response = await getQuizByReviewer(reviewerId);
      console.log('Quiz response received:', response);
      
      // Backend returns { quiz: {...} }
      if (!response.quiz) {
        throw new Error('Quiz data not found in response');
      }
      
      setQuiz(response.quiz);
      
      // Initialize user answers array
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
      console.error('Error fetching quiz:', err);
      setError(err.message || 'Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = currentQuestion.type === 'multiple-choice' 
      ? answer === currentQuestion.correct_answer
      : answer.toLowerCase().trim() === currentQuestion.identification_answer.toLowerCase().trim();

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      answer: answer,
      isCorrect: isCorrect,
      isSkipped: false,
      timePerQuestionSeconds: Math.floor((Date.now() - (startTime || Date.now())) / 1000)
    };
    
    setUserAnswers(updatedAnswers);

    // Move to next question or complete quiz
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete(false);
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
      handleQuizComplete(false);
    }
  };

  const handleQuizComplete = (timeUp = false) => {
    // compute stats
    const total = quiz.questions.length;
    const correct = userAnswers.filter(a => a?.isCorrect === true).length;
    const percentage = Math.round((correct / total) * 100);

    // persist attempt locally for history page
    try {
      saveQuizAttempt({
        reviewerId,
        reviewerTitle: quiz.reviewerTitle || quiz.reviewer?.title || undefined,
        quizId: quiz._id,
        title: quiz.title,
        finishedAt: new Date().toISOString(),
        stats: { correct, total, percentage },
        questions: quiz.questions,
        answers: userAnswers,
      });
    } catch (e) {
      console.warn('Failed to save quiz attempt locally:', e);
    }

    setIsCompleted(true);
  };

  const calculateProgress = () => {
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No quiz found for this reviewer.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
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
          if (quiz.settings.timerMinutes > 0) {
            setTimeLeft(quiz.settings.timerMinutes * 60);
          }
        }}
        onGoBack={() => navigate(-1)}
      />
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Render appropriate quiz component based on question type
  if (currentQuestion.type === 'multiple-choice') {
    return (
      <MultipleChoiceQuiz
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        progress={calculateProgress()}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onGoBack={() => navigate(-1)}
        quizTitle={quiz.title}
      />
    );
  } else {
    return (
      <IdentificationQuiz
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        progress={calculateProgress()}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onGoBack={() => navigate(-1)}
        quizTitle={quiz.title}
      />
    );
  }
}

export default QuizPage;