import httpService from './httpService';

// Get overall accuracy analytics
export const getOverallAccuracy = async () => {
  try {
    const response = await httpService.get('/analytics/overall-accuracy');
    return response;
  } catch (error) {
    console.error('Error fetching overall accuracy:', error);
    throw error;
  }
};

// Get correct/wrong/skipped weekly data
export const getCorrectWrongSkipped = async () => {
  try {
    const response = await httpService.get('/analytics/correct-wrong-skipped');
    return response;
  } catch (error) {
    console.error('Error fetching correct/wrong/skipped data:', error);
    throw error;
  }
};

// Get per-subject accuracy
export const getPerSubjectAccuracy = async () => {
  try {
    const response = await httpService.get('/analytics/per-subject-accuracy');
    return response;
  } catch (error) {
    console.error('Error fetching per-subject accuracy:', error);
    throw error;
  }
};

// Get per-subject coverage
export const getPerSubjectCoverage = async () => {
  try {
    const response = await httpService.get('/analytics/per-subject-coverage');
    return response;
  } catch (error) {
    console.error('Error fetching per-subject coverage:', error);
    throw error;
  }
};

// Get average time per question
export const getAverageTime = async () => {
  try {
    const response = await httpService.get('/analytics/average-time');
    return response;
  } catch (error) {
    console.error('Error fetching average time:', error);
    throw error;
  }
};

// Get per-subject speed
export const getPerSubjectSpeed = async () => {
  try {
    const response = await httpService.get('/analytics/per-subject-speed');
    return response;
  } catch (error) {
    console.error('Error fetching per-subject speed:', error);
    throw error;
  }
};

// Get weakest subject
export const getWeakestSubject = async () => {
  try {
    const response = await httpService.get('/analytics/weakest-subject');
    return response;
  } catch (error) {
    console.error('Error fetching weakest subject:', error);
    throw error;
  }
};

// Get streak data
export const getStreak = async () => {
  try {
    const response = await httpService.get('/analytics/streak');
    return response;
  } catch (error) {
    console.error('Error fetching streak:', error);
    throw error;
  }
};

// Get subject mastery
export const getSubjectMastery = async () => {
  try {
    const response = await httpService.get('/analytics/subject-mastery');
    return response;
  } catch (error) {
    console.error('Error fetching subject mastery:', error);
    throw error;
  }
};

// Get subject ranking
export const getSubjectRanking = async () => {
  try {
    const response = await httpService.get('/analytics/subject-ranking');
    return response;
  } catch (error) {
    console.error('Error fetching subject ranking:', error);
    throw error;
  }
};

// Get difficulty analysis
export const getDifficultyAnalysis = async () => {
  try {
    const response = await httpService.get('/analytics/difficulty-analysis');
    return response;
  } catch (error) {
    console.error('Error fetching difficulty analysis:', error);
    throw error;
  }
};

// Get improvement trajectory
export const getImprovementTrajectory = async () => {
  try {
    const response = await httpService.get('/analytics/improvement-trajectory');
    return response;
  } catch (error) {
    console.error('Error fetching improvement trajectory:', error);
    throw error;
  }
};

// Get answer rate trends
export const getAnswerRateTrends = async () => {
  try {
    const response = await httpService.get('/analytics/answer-rate-trends');
    return response;
  } catch (error) {
    console.error('Error fetching answer rate trends:', error);
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
};
