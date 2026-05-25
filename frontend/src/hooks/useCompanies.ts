import { useState, useEffect } from 'react';
import { companiesService } from '../services/companies.service';
import type { Company } from '../types';

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
  setLoading(true);
  try {
    const data = await companiesService.getMapCompanies();
    console.log('Datos recibidos del backend:', data);  // 👈 Verificar
    setCompanies(data);
    setError(null);
  } catch (err) {
    console.error('Error fetching companies:', err);
    setError('Error al cargar las empresas');
  } finally {
    setLoading(false);
  }
  };

  const updateCompany = async (id: number, data: Partial<Company>) => {
    try {
      const updated = await companiesService.updateCompany(id, data);
      setCompanies(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      console.error('Error updating company:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { companies, loading, error, fetchCompanies, updateCompany };
}