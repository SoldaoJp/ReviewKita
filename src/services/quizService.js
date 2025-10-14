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
