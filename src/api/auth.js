import api from '../utils/api';

export const authAPI = {
  // Register user
  register: async (userData) => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  },

  // Login user
  login: async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  },
};
