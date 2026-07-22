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
import { logger } from '../../utils/logger';

export default function Dashboard() {
  const { companies, loading, updateCompany } = useCompanies();
  const { selectedCompany, setSelectedCompany } = useCompanyStore();
  const { filters, radiusKm, showCharts, setFilters, setRadiusKm, setShowCharts } = useFiltersStore();
  const [localCompanies, setLocalCompanies] = useState<Company[]>(companies);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [filterDepartamento, setFilterDepartamento] = useState<string>("todos");
  const [filterEstacionTipo, setFilterEstacionTipo] = useState<string>("todos");
  const [ypfStations, setYpfStations] = useState<any[]>([]);
  const [estacionesBlancas, setEstacionesBlancas] = useState<any[]>([]);
  const [mapKey, setMapKey] = useState(0);

  // Cargar datos de YPF y banderas blancas
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    
    Promise.all([
      fetch(`${API_URL}/ypf`).then(res => res.json()),
      fetch(`${API_URL}/estaciones-blancas`).then(res => res.json()),
    ]).then(([ypfData, blancasData]) => {
      setYpfStations(ypfData);
      setEstacionesBlancas(blancasData);
      logger.log('✅ YPF cargadas en Dashboard:', ypfData.length);
      logger.log('✅ Blancas cargadas en Dashboard:', blancasData.length);
    }).catch(err => logger.error('Error loading estaciones:', err));
  }, []);

  useEffect(() => {
    logger.log('🔄 Filtro cambiado - Depto:', filterDepartamento, 'Tipo:', filterEstacionTipo);
  }, [filterDepartamento, filterEstacionTipo]);
  
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

  // Agregar después de handleUpdateCompanyLocal
  const handleFilterChange = (depto: string, tipo: string) => {
    setFilterDepartamento(depto);
    setFilterEstacionTipo(tipo);
    // Forzar actualización del mapa
    setMapKey(prev => prev + 1);
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

      {/* Disclaimer - Datos 2022 */}
      {showDisclaimer && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex justify-between items-center flex-shrink-0">
          <p className="text-sm text-amber-800">
            📌 <strong>Nota:</strong> La información mostrada en esta plataforma corresponde al año <strong>2022</strong> 
            (fuente: INDEC, Censo Nacional de Población, Hogares y Viviendas 2022).
          </p>
          <button 
            onClick={() => setShowDisclaimer(false)}
            className="text-amber-600 hover:text-amber-800 font-medium text-sm px-2 py-1 rounded hover:bg-amber-100 transition"
          >
            ✕ Cerrar
          </button>
        </div>
      )}

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
          filterDepartamento={filterDepartamento}
          setFilterDepartamento={setFilterDepartamento}
          filterEstacionTipo={filterEstacionTipo}
          setFilterEstacionTipo={setFilterEstacionTipo}
          onFilterChange={handleFilterChange}
          ypfStations={ypfStations}
          estacionesBlancas={estacionesBlancas}
        />

        <div className="flex-1 flex flex-col p-4">
          {showCharts ? (
            <div className="flex-1 overflow-y-auto">
              <Charts companies={companies} selectedCompany={selectedCompany} />
            </div>
          ) : (
            <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-blue-200 bg-white">
              <Map
                key={mapKey}
                companies={companies.filter(c => c.stockLiters >= filters.minStock)}
                selectedCompany={selectedCompany}
                onSelectCompany={setSelectedCompany}
                radiusKm={radiusKm}
                layers={layers}
                onToggleLayer={toggleLayer}
                filterDepartamento={filterDepartamento}
                filterEstacionTipo={filterEstacionTipo}
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