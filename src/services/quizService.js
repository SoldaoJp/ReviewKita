import httpService from './httpService';

export const createQuiz = async (quizData) => {
  try {
    const response = await httpService.post('/api/quizzes', quizData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

export const getQuizByReviewer = async (reviewerId) => {
  try {
    const response = await httpService.get(`/api/quizzes/reviewer/${reviewerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};
