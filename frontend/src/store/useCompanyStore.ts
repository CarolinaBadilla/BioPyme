import { create } from 'zustand';
import type { Company } from '../types';

interface CompanyStore {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  clearSelectedCompany: () => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  clearSelectedCompany: () => set({ selectedCompany: null }),
}));