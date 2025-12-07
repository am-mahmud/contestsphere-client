import api from '../utils/api';

export const contestAPI = {
    
    getAllContests: async (params = {}) => {
    const { data } = await api.get('/api/contests', { params });
    return data;
    },

    // Get single contest
  getContest: async (id) => {
    const { data } = await api.get(`/api/contests/${id}`);
    return data;
  },
    

}
