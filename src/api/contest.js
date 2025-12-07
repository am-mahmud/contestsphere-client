import api from '../utils/api';

export const contestAPI = {
    
    getAllContests: async (params = {}) => {
    const { data } = await api.get('/api/contests', { params });
    return data;
    }
    
    

}
