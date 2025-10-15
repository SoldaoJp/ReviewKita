// src/admin/services/adminService.js
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

export default {
  getAllUsers,
  searchUserByEmail,
  deleteUserById,
};


