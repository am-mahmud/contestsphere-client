// import api from '../utils/api';

// export const contestAPI = {
//   getAllContests: async (params = {}) => {
//     const { data } = await api.get('/api/contests', { params });
//     return data;
//   },

//   getContest: async (id) => {
//     const { data } = await api.get(`/api/contests/${id}`);
//     return data;
//   },

//   createContest: async (contestData) => {
//     const { data } = await api.post('/api/contests', contestData);
//     return data;
//   },

//   updateContest: async (id, contestData) => {
//     const { data } = await api.put(`/api/contests/${id}`, contestData);
//     return data;
//   },

//   deleteContest: async (id) => {
//     const { data } = await api.delete(`/api/contests/${id}`);
//     return data;
//   },

//   getPopularContests: async (limit = 5) => {
//     const { data } = await api.get('/api/contests', {
//       params: { sort: 'popular', limit, status: 'confirmed' }
//     });
//     return data;
//   },

//   getMyContests: async () => {
//     const { data } = await api.get('/api/contests/creator/my-contests');
//     return data;
//   },

//   approveContest: async (id) => {
//     const { data } = await api.put(`/api/contests/${id}/approve`);
//     return data;
//   },

//   rejectContest: async (id, reason) => {
//     const { data } = await api.put(`/api/contests/${id}/reject`, { reason });
//     return data;
//   },
// };


import api from '../utils/api';

export const contestAPI = {
  // Get all contests (with filters)
  getAllContests: async (params = {}) => {
    const { data } = await api.get('/api/contests', { params });
    return data;
  },

  // Get single contest
  getContest: async (id) => {
    const { data } = await api.get(`/api/contests/${id}`);
    return data;
  },

  // Get popular contests (sorted by participants)
  getPopularContests: async (limit = 5) => {
    const { data } = await api.get('/api/contests', {
      params: { sort: 'popular', limit }
    });
    return data;
  },

  // Get creator's own contests
  getMyContests: async () => {
    const { data } = await api.get('/api/contests/creator/my');
    return data;
  },

  // Create contest (Creator only)
  createContest: async (contestData) => {
    const { data } = await api.post('/api/contests', contestData);
    return data;
  },

  // Update contest (Creator only)
  updateContest: async (id, contestData) => {
    const { data } = await api.put(`/api/contests/${id}`, contestData);
    return data;
  },

  // Delete contest (Creator/Admin)
  deleteContest: async (id) => {
    const { data } = await api.delete(`/api/contests/${id}`);
    return data;
  },

  // Approve contest (Admin only)
  approveContest: async (id) => {
    const { data } = await api.put(`/api/contests/${id}/approve`);
    return data;
  },

  // Reject contest (Admin only)
  rejectContest: async (id, reason) => {
    const { data } = await api.put(`/api/contests/${id}/reject`, { reason });
    return data;
  },
};