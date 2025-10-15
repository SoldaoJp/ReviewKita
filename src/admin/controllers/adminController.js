// src/admin/controllers/adminController.js
import { getAllUsers, searchUserByEmail, deleteUserById } from '../services/adminService';
import {
  getAllLlmConfigs,
  createLlmConfig,
  updateLlmConfig,
  deleteLlmConfig,
  recommendLlmConfig,
  rateLlmConfig,
} from '../../user/services/llmConfigService';

export const adminGetUsers = () => getAllUsers();
export const adminSearchUserByEmail = (email) => searchUserByEmail(email);
export const adminDeleteUser = (id) => deleteUserById(id);

export const adminGetLlmConfigs = () => getAllLlmConfigs();
export const adminCreateLlmConfig = (payload) => createLlmConfig(payload);
export const adminUpdateLlmConfig = (id, payload) => updateLlmConfig(id, payload);
export const adminDeleteLlmConfig = (id) => deleteLlmConfig(id);
export const adminRecommendLlmConfig = (id, remove = false) => recommendLlmConfig(id, remove);
export const adminRateLlmConfig = (id, rating) => rateLlmConfig(id, rating);

export default {
  adminGetUsers,
  adminSearchUserByEmail,
  adminDeleteUser,
  adminGetLlmConfigs,
  adminCreateLlmConfig,
  adminUpdateLlmConfig,
  adminDeleteLlmConfig,
  adminRecommendLlmConfig,
  adminRateLlmConfig,
};


