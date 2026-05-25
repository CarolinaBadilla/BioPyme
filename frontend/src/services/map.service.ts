import api from './api';

export const mapService = {
  async getRegions() {
    const response = await api.get('/map/regions');
    return response.data;
  },
  async getDepartments() {
    const response = await api.get('/map/departments');
    return response.data;
  },
  async getCities() {
    const response = await api.get('/map/cities');
    return response.data;
  },
};