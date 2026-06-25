import { useEffect, useState } from 'react';
import Map from '../../components/maps/Map';
import Sidebar from '../../components/layout/Sidebar';
import Charts from '../../components/charts/Charts';
import LoginButton from '../../components/common/LoginButton';
import DistanceAnalyzer from '../../components/maps/DistanceAnalyzer';
import { useCompanies } from '../../hooks/useCompanies';
import { useFiltersStore } from '../../store/useFiltersStore';
import { useCompanyStore } from '../../store/useCompanyStore';
import type { Company } from '../../types';
import logo from '../../assets/logo.png';

export default function Dashboard() {
  const { companies, loading, updateCompany } = useCompanies();
  const { selectedCompany, setSelectedCompany } = useCompanyStore();
  const { filters, radiusKm, showCharts, setFilters, setRadiusKm, setShowCharts } = useFiltersStore();
  const [localCompanies, setLocalCompanies] = useState<Company[]>(companies);
  
  const [layers, setLayers] = useState({
    regions: true,
    departments: false,
    cities: true,
    plants: true,
    localidades: true,  
    ypf: true,
    estacionesBlancas: true,          
  });

  const handleBackToList = () => {
    setSelectedCompany(null);
    setShowCharts(false);
  };

  const handleUpdateCompany = async (updated: any) => {
    await updateCompany(updated.id, updated);
    setSelectedCompany(updated);
  };

  const toggleLayer = (layerName: string) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName as keyof typeof prev]
    }));
  };

  const handleUpdateCompanyLocal = (updated: Company) => {
    setLocalCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedCompany(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      {/* Header azul oscuro */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-3 flex justify-between items-center flex-shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-12 h-12 object-contain rounded-lg bg-white/10 p-1"
          />
          <div>
            <h1 className="font-bold text-xl text-white tracking-tight">Biopyme Córdoba</h1>
            <p className="text-xs text-blue-200">Sistema de gestión de biodiesel</p>
          </div>
        </div>
        <LoginButton />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
          onUpdateCompany={handleUpdateCompany}
          onUpdateCompanyLocal={handleUpdateCompanyLocal}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          filters={filters}
          onFiltersChange={setFilters}
          onShowCharts={() => setShowCharts(!showCharts)}
          showCharts={showCharts}
          onBackToList={handleBackToList}
        />

        <div className="flex-1 flex flex-col p-4">
          {showCharts ? (
            <div className="flex-1 overflow-y-auto">
              <Charts companies={companies} selectedCompany={selectedCompany} />
            </div>
          ) : (
            <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-blue-200 bg-white">
              <Map
                companies={companies.filter(c => c.stockLiters >= filters.minStock)}
                selectedCompany={selectedCompany}
                onSelectCompany={setSelectedCompany}
                radiusKm={radiusKm}
                layers={layers}
                onToggleLayer={toggleLayer}
              />
            </div>
          )}
        </div>
      </div>

      {selectedCompany && selectedCompany.type === "planta" && (
        <div className="bg-white border-t border-blue-200 shadow-sm flex-shrink-0">
          <DistanceAnalyzer companies={companies} selectedCompany={selectedCompany} />
        </div>
      )}
    </div>
  );
}