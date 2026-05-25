import { create } from 'zustand';
import type { User } from '../types';

// Definir el tipo específico para el rol
export type UserRole = 'ADMIN' | 'ASSISTANT' | 'ORGANIZATION_MANAGER';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  companyId?: number;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));