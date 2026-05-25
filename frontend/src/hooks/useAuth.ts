import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import type { RegisterData } from '../types';

export function useAuth() {
  const { user, setUser, setAuthenticated, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await authService.registerManager(data);
      setUser(response.user);
      setAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    storeLogout();
  };

  return { user, isAuthenticated: !!user, loading, login, register, logout };
}