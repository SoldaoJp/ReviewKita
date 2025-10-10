// src/services/llmConfigService.js
import httpService from './httpService';

export const getAvailableLlmModelsReviewer = async () => {
  // GET /llm-configs/available returns shape: { models: [ { id, model_name, recommends } ] }
  return httpService.get('/llm-configs/available?use_type=reviewer');
};

export default {
  getAvailableLlmModelsReviewer,
};
