import api from '../utils/api';

export const participationAPI = {
  joinContest: async (contestId) => {
    const { data } = await api.post('/api/participations/join', { contestId });
    return data;
  },

  submitTask: async (contestId, submittedTask) => {
    const { data } = await api.post('/api/participations/submit', {
      contestId,
      submittedTask
    });
    return data;
  },

  getMyParticipations: async () => {
    const { data } = await api.get('/api/participations/my');
    return data;
  },

  getMyWinnings: async () => {
    const { data } = await api.get('/api/participations/wins');
    return data;
  },

  getContestSubmissions: async (contestId) => {
    const { data } = await api.get(`/api/participations/contest/${contestId}/submissions`);
    return data;
  },

  declareWinner: async (contestId, participationId) => {
    const { data } = await api.post('/api/participations/declare-winner', {
      contestId,
      participationId
    });
    return data;
  },
};