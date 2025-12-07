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

    // Create contest
    createContest: async (contestData) => {
        const { data } = await api.post('/api/contests', contestData);
        return data;
    },
    updateContest: async (id, contestData) => {
        const { data } = await api.put(`/api/contests/${id}`, contestData);
        return data;
    },
}
