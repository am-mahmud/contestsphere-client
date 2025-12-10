import api from '../utils/api';

export const paymentAPI = {
  getConfig: async () => {
    const { data } = await api.get('/api/payments/config');
    return data;
  },

  createPaymentIntent: async (contestId) => {
    const { data } = await api.post('/api/payments/create-payment-intent', {
      contestId
    });
    return data;
  },

  confirmPayment: async (paymentIntentId, contestId) => {
    const { data } = await api.post('/api/payments/confirm-payment', {
      paymentIntentId,
      contestId
    });
    return data;
  },
};