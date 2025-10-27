import httpService from '../../user/services/httpService';

export const getAllUsers = async () => {
  return httpService.get('/admin/users');
};

export const searchUserByEmail = async (email) => {
  return httpService.get(`/admin/users/search?email=${encodeURIComponent(email)}`);
};

export const deleteUserById = async (id) => {
  return httpService.delete(`/admin/users/${id}`);
};

export const getUserActivityAnalytics = async (days = 30) => {
  return httpService.get(`/user/activity/analytics?days=${days}`);
};

export const extractDataset = async () => {
  return httpService.get('/admin/extract-dataset');
};

export default {
  getAllUsers,
  searchUserByEmail,
  deleteUserById,
  getUserActivityAnalytics,
  extractDataset,
};



