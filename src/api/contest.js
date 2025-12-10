import api from '../utils/api';

export const contestAPI = {
  
  getAllContests: async (params = {}) => {
    const { data } = await api.get('/api/contests', { params });
    return data;
  },

  getContest: async (id) => {
    const { data } = await api.get(`/api/contests/${id}`);
    return data;
  },

  getPopularContests: async (limit = 5) => {
    const { data } = await api.get('/api/contests', {
      params: { sort: 'popular', limit }
    });
    return data;
  },

  getMyContests: async () => {
    const { data } = await api.get('/api/contests/creator/my');
    return data;
  },

  createContest: async (contestData) => {
    const { data } = await api.post('/api/contests', contestData);
    return data;
  },

  updateContest: async (id, contestData) => {
    const { data } = await api.put(`/api/contests/${id}`, contestData);
    return data;
  },

  deleteContest: async (id) => {
    const { data } = await api.delete(`/api/contests/${id}`);
    return data;
  },

  approveContest: async (id) => {
    const { data } = await api.put(`/api/contests/${id}/approve`);
    return data;
  },

  rejectContest: async (id, reason) => {
    const { data } = await api.put(`/api/contests/${id}/reject`, { reason });
    return data;
  },
};