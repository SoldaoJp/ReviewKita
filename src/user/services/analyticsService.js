import httpService from './httpService';

export const getOverallAccuracy = async () => {
  try {
    const response = await httpService.get('/analytics/overall-accuracy');
    return response;
  } catch (error) {
    console.error('Error fetching overall accuracy:', error);
    throw error;
  }
};

export const getCorrectWrongSkipped = async () => {
  try {
    const response = await httpService.get('/analytics/correct-wrong-skipped');
    return response;
  } catch (error) {
    console.error('Error fetching correct/wrong/skipped data:', error);
    throw error;
  }
};

export const getPerSubjectAccuracy = async () => {
  try {
    const response = await httpService.get('/analytics/per-subject-accuracy');
    return response;
  } catch (error) {
    console.error('Error fetching per-subject accuracy:', error);
    throw error;
  }
};

export const getPerSubjectCoverage = async () => {
  try {
    const response = await httpService.get('/analytics/per-subject-coverage');
    return response;
  } catch (error) {
    console.error('Error fetching per-subject coverage:', error);
    throw error;
  }
};

export const getAverageTime = async () => {
  try {
    const response = await httpService.get('/analytics/average-time');
    return response;
  } catch (error) {
    console.error('Error fetching average time:', error);
    throw error;
  }
};

export const getPerSubjectSpeed = async () => {
  try {
    const response = await httpService.get('/analytics/per-subject-speed');
    return response;
  } catch (error) {
    console.error('Error fetching per-subject speed:', error);
    throw error;
  }
};

export const getWeakestSubject = async () => {
  try {
    const response = await httpService.get('/analytics/weakest-subject');
    return response;
  } catch (error) {
    console.error('Error fetching weakest subject:', error);
    throw error;
  }
};

export const getStreak = async () => {
  try {
    const response = await httpService.get('/analytics/streak');
    return response;
  } catch (error) {
    console.error('Error fetching streak:', error);
    throw error;
  }
};

export const getSubjectMastery = async () => {
  try {
    const response = await httpService.get('/analytics/subject-mastery');
    return response;
  } catch (error) {
    console.error('Error fetching subject mastery:', error);
    throw error;
  }
};

export const getSubjectRanking = async () => {
  try {
    const response = await httpService.get('/analytics/subject-ranking');
    return response;
  } catch (error) {
    console.error('Error fetching subject ranking:', error);
    throw error;
  }
};

export const getDifficultyAnalysis = async () => {
  try {
    const response = await httpService.get('/analytics/difficulty-analysis');
    return response;
  } catch (error) {
    console.error('Error fetching difficulty analysis:', error);
    throw error;
  }
};

export const getImprovementTrajectory = async () => {
  try {
    const response = await httpService.get('/analytics/improvement-trajectory');
    return response;
  } catch (error) {
    console.error('Error fetching improvement trajectory:', error);
    throw error;
  }
};

export const getAnswerRateTrends = async () => {
  try {
    const response = await httpService.get('/analytics/answer-rate-trends');
    return response;
  } catch (error) {
    console.error('Error fetching answer rate trends:', error);
    throw error;
  }
};

export const extractUserDataset = async () => {
  try {
    const response = await httpService.get('/user/extract-dataset');
    return response;
  } catch (error) {
    console.error('Error extracting user dataset:', error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const response = await httpService.get('/analytics/user-stats');
    return response;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

export default {
  getOverallAccuracy,
  getCorrectWrongSkipped,
  getPerSubjectAccuracy,
  getPerSubjectCoverage,
  getAverageTime,
  getPerSubjectSpeed,
  getWeakestSubject,
  getStreak,
  getSubjectMastery,
  getSubjectRanking,
  getDifficultyAnalysis,
  getImprovementTrajectory,
  getAnswerRateTrends,
  extractUserDataset,
  getUserStats,
};

