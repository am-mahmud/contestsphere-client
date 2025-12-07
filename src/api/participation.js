import api from '../utils/api';

export const participationAPI = {
  // Get user's participated contests
  getMyParticipations: async () => {
    const { data } = await api.get('/api/participations/my');
    return data;
  },

  // Get user's winning contests
  getMyWinnings: async () => {
    const { data } = await api.get('/api/participations/my/wins');
    return data;
  },
};