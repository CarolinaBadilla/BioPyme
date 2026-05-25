import api from './api';
import type { RegisterData } from '../types';  // ← Importar desde types

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: 'ADMIN' | 'ASSISTANT' | 'ORGANIZATION_MANAGER';
    companyId?: number;
  };
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return {
      user: {
        ...response.data.user,
        role: response.data.user.role as 'ADMIN' | 'ASSISTANT' | 'ORGANIZATION_MANAGER'
      },
      token: response.data.token
    };
  },
  
  async registerManager(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/auth/register/manager', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return {
      user: {
        ...response.data.user,
        role: response.data.user.role as 'ADMIN' | 'ASSISTANT' | 'ORGANIZATION_MANAGER'
      },
      token: response.data.token
    };
  },
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser(): LoginResponse['user'] | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};