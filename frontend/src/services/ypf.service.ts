import api from './api';

export const ypfService = {
  async getAll() {
    const response = await api.get('/ypf');
    return response.data;
  },
};