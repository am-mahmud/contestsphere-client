import api from '../utils/api';

export const userAPI = {
  getLeaderboard: async (limit = 50) => {
    const { data } = await api.get('/api/users/leaderboard', {
      params: { limit }
    });
    return data;
  },

  getMyProfile: async () => {
    const { data } = await api.get('/api/users/me');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/api/users/me', profileData);
    return data;
  },

  getAllUsers: async (params = {}) => {
    const { data } = await api.get('/api/users', { params });
    return data;
  },

  changeUserRole: async (userId, role) => {
    const { data } = await api.put(`/api/users/${userId}/role`, { role });
    return data;
  },
  
  deleteUser: async (userId) => {
    const { data } = await api.delete(`/api/users/${userId}`);
    return data;
  },
};