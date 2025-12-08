// import api from '../utils/api';

// export const participationAPI = {
//   // Get user's participated contests
//   getMyParticipations: async () => {
//     const { data } = await api.get('/api/participations/my');
//     return data;
//   },

//   // Get user's winning contests
//   getMyWinnings: async () => {
//     const { data } = await api.get('/api/participations/my/wins');
//     return data;
//   },
// };

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

  // Get submissions for a contest
  getContestSubmissions: async (contestId) => {
    const { data } = await api.get(`/api/participations/contest/${contestId}`);
    return data;
  },

  // Declare winner
  declareWinner: async (contestId, participationId) => {
    const { data } = await api.post(`/api/participations/declare-winner/${contestId}/${participationId}`);
    return data;
  },
};