import httpService from '../../user/services/httpService';

export const fetchLLMAnalytics = async () => {
  try {
    const response = await httpService.get('/llm-configs/analytics');
    return response;
  } catch (error) {
    console.error('Error fetching LLM analytics:', error);
    throw error;
  }
};
