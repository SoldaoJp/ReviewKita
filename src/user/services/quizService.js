// Get finished quiz history
export const getQuizHistory = async () => {
  try {
    // Backend reference: GET /api/quizzes/history (or similar)
    const response = await httpService.get('/quizzes/history');
    return response.data || response;
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    throw error;
  }
};
import httpService from './httpService';

export const createQuiz = async (quizData) => {
  try {
    console.log('Creating quiz with data:', quizData);
    const response = await httpService.post('/quizzes', quizData);
    console.log('Quiz creation response:', response);
    return response;
  } catch (error) {
    console.error('Error creating quiz:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const getQuizByReviewer = async (reviewerId) => {
  try {
    console.log('Fetching quiz for reviewer:', reviewerId);
    const response = await httpService.get(`/quizzes/reviewer/${reviewerId}`);
    console.log('Quiz fetch response:', response);
    return response; // Backend returns { quiz: {...} }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const submitQuizAnswer = async (quizId, answerData) => {
  try {
    console.log('Submitting quiz answer:', { quizId, answerData });
    const response = await httpService.post(`/quizzes/${quizId}/answer`, answerData);
    console.log('Submit answer response:', response);
    return response; // Return the full response
  } catch (error) {
    console.error('Error submitting quiz answer:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    console.log('Deleting quiz:', quizId);
    const response = await httpService.delete(`/quizzes/${quizId}`);
    console.log('Delete quiz response:', response);
    return response;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const submitQuiz = async (quizId, answers) => {
  try {
    console.log('Submitting quiz:', { quizId, answers });
    const response = await httpService.post(`/quizzes/${quizId}/submit`, { answers });
    console.log('Submit quiz response:', response);
    return response;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const createRetakeQuiz = async (originalQuizId) => {
  try {
    console.log('Creating retake quiz for original quiz:', originalQuizId);
    const response = await httpService.post('/quiz-retakes', { originalQuizId });
    console.log('Retake quiz creation response:', response);
    return response;
  } catch (error) {
    console.error('Error creating retake quiz:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const getRetakeQuiz = async (retakeQuizId) => {
  try {
    console.log('Fetching retake quiz:', retakeQuizId);
    const response = await httpService.get(`/quiz-retakes/${retakeQuizId}`);
    console.log('Retake quiz fetch response:', response);
    return response; // Backend returns { quiz: {...} }
  } catch (error) {
    console.error('Error fetching retake quiz:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const submitRetakeQuiz = async (retakeQuizId, answers) => {
  try {
    console.log('Submitting retake quiz:', { retakeQuizId, answers });
    const response = await httpService.post(`/quiz-retakes/${retakeQuizId}/submit`, { answers });
    console.log('Submit retake quiz response:', response);
    return response;
  } catch (error) {
    console.error('Error submitting retake quiz:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const deleteRetakeQuiz = async (retakeQuizId) => {
  try {
    console.log('Deleting retake quiz:', retakeQuizId);
    const response = await httpService.delete(`/quiz-retakes/${retakeQuizId}`);
    console.log('Delete retake quiz response:', response);
    return response;
  } catch (error) {
    console.error('Error deleting retake quiz:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};
