import api from './api';

export const localidadesService = {
  async getAll() {
    const response = await api.get('/localidades');
    return response.data;
  },
};