import api from './api';
import type { Company } from '../types';

export const companiesService = {
  async getMapCompanies(): Promise<Company[]> {
    const response = await api.get('/companies/map');
    return response.data;
  },

  async getCompanyById(id: number): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  async updateCompany(id: number, data: Partial<Company>): Promise<Company> {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },
};