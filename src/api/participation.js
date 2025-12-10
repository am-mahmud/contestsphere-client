// import api from '../utils/api';

// export const participationAPI = {

//   getMyParticipations: async () => {
//     const { data } = await api.get('/api/participations/my');
//     return data;
//   },

//   getMyWinnings: async () => {
//     const { data } = await api.get('/api/participations/my/wins');
//     return data;
//   },

//   // Get submissions for a contest
//   getContestSubmissions: async (contestId) => {
//     const { data } = await api.get(`/api/participations/contest/${contestId}/submissions`);
//     return data;
//   },

//   // Declare winner
//   declareWinner: async (contestId, participationId) => {
//     const { data } = await api.post('/api/participations/declare-winner', {
//       contestId,
//       participationId
//     });
//     return data;
//   },
// };


import api from '../utils/api';

export const participationAPI = {
  // Join contest (payment simulation)
  joinContest: async (contestId) => {
    const { data } = await api.post('/api/participations/join', { contestId });
    return data;
  },

  // Submit task
  submitTask: async (contestId, submittedTask) => {
    const { data } = await api.post('/api/participations/submit', {
      contestId,
      submittedTask
    });
    return data;
  },

  // Get user's participated contests
  getMyParticipations: async () => {
    const { data } = await api.get('/api/participations/my');
    return data;
  },

  // Get user's winning contests
  getMyWinnings: async () => {
    const { data } = await api.get('/api/participations/wins');
    return data;
  },

  // Get submissions for a contest (Creator only)
  getContestSubmissions: async (contestId) => {
    const { data } = await api.get(`/api/participations/contest/${contestId}/submissions`);
    return data;
  },

  // Declare winner (Creator only)
  declareWinner: async (contestId, participationId) => {
    const { data } = await api.post('/api/participations/declare-winner', {
      contestId,
      participationId
    });
    return data;
  },
};