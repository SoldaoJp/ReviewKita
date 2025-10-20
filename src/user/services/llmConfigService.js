// src/services/llmConfigService.js
import httpService from './httpService';

export const getAvailableLlmModelsReviewer = async () => {
  // GET /llm-configs/available returns shape: { models: [ { id, model_name, recommends } ] }
  return httpService.get('/llm-configs/available?use_type=reviewer');
};

export const getAvailableLlmModels = async (useType) => {
  const qs = useType ? `?use_type=${encodeURIComponent(useType)}` : '';
  return httpService.get(`/llm-configs/available${qs}`);
};

// Admin management endpoints for LLM configs
export const getAllLlmConfigs = async () => {
  return httpService.get('/llm-configs');
};

export const createLlmConfig = async (payload) => {
  return httpService.post('/llm-configs', payload);
};

export const updateLlmConfig = async (id, payload) => {
  return httpService.put(`/llm-configs/${id}`, payload);
};

export const deleteLlmConfig = async (id) => {
  return httpService.delete(`/llm-configs/${id}`);
};

export const recommendLlmConfig = async (id, remove = false) => {
  const sep = remove ? '?remove=true' : '?remove=false';
  return httpService.post(`/llm-configs/${id}/recommend${sep}`, {});
};

export const rateLlmConfig = async (id, rating) => {
  return httpService.post(`/llm-configs/${id}/rate`, { rating });
};

export const reportLlmConfigReviewer = async (id, { type, description, reviewer_id }) => {
  return httpService.post(`/llm-configs/${id}/report/reviewer`, { type, description, reviewer_id });
};

export default {
  getAvailableLlmModelsReviewer,
  getAvailableLlmModels,
  getAllLlmConfigs,
  createLlmConfig,
  updateLlmConfig,
  deleteLlmConfig,
  recommendLlmConfig,
  rateLlmConfig,
  reportLlmConfigReviewer,
};
