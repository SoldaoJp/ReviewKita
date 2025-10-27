import httpService from './httpService';

export const logUserActivity = async (activityType, reviewerId) => {
  try {
    const response = await httpService.post('/user/activity/mark', {
      activityType,
      reviewerId,
      timestamp: new Date().toISOString(),
    });
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('user-activity-logged', {
          detail: { response }
        }));
      }
    } catch (_) { /* no-op */ }
    return response;
  } catch (error) {
    console.error('Error logging user activity:', error);
    throw error;
  }
};

export const getUserActivityDays = async () => {
  try {
    const response = await httpService.get('/user/activity');
    return Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching user activity days:', error);
    throw error;
  }
};

