import { create } from 'zustand';
import type { Filters } from '../types';

interface FiltersStore {
  filters: Filters;
  radiusKm: number;
  showCharts: boolean;
  setFilters: (filters: Filters) => void;
  setRadiusKm: (radius: number) => void;
  setShowCharts: (show: boolean) => void;
  resetFilters: () => void;
}

const defaultFilters: Filters = {
  search: '',
  type: 'todos',
  minStock: 0,
  minProduction: 0,
  maxProduction: 50000,
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  filters: defaultFilters,
  radiusKm: 10,
  showCharts: false,
  setFilters: (filters) => set({ filters }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),
  setShowCharts: (showCharts) => set({ showCharts }),
  resetFilters: () => set({ filters: defaultFilters, radiusKm: 10, showCharts: false }),
}));