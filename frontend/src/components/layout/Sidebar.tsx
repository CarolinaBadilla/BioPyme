import { useState, useEffect } from "react";
import type { Company, Filters } from "../../types";
import { Slider } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { logger } from '../../utils/logger';
import { verifyPassword } from '../../utils/passwordHash';
import consorciosData from "../../data/consorcios.json";
import api from '../../services/api';

interface SidebarProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
  onUpdateCompany: (updated: Company) => void;
  onUpdateCompanyLocal?: (updated: Company) => void;
  radiusKm: number;
  onRadiusChange: (value: number) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onShowCharts: () => void;
  showCharts: boolean;
  onBackToList: () => void;
  filterDepartamento: string; 
  setFilterDepartamento: (value: string) => void; 
  filterEstacionTipo: string; 
  setFilterEstacionTipo: (value: string) => void; 
  onFilterChange?: (depto: string, tipo: string) => void;
  ypfStations?: any[];
  estacionesBlancas?: any[];
}

export default function Sidebar({
  companies,
  selectedCompany,
  onSelectCompany,
  onUpdateCompany,
  onUpdateCompanyLocal,
  radiusKm,
  onRadiusChange,
  filters,
  onFiltersChange,
  onShowCharts,
  showCharts,
  onBackToList,
  filterDepartamento, 
  setFilterDepartamento,
  filterEstacionTipo, 
  setFilterEstacionTipo, 
  onFilterChange, 
  ypfStations = [],
  estacionesBlancas = [],
}: SidebarProps) {
  const { user } = useAuth();
  
  const isOwner = user?.role === 'ORGANIZATION_MANAGER' && user?.companyId === selectedCompany?.id;
  
  const [editData, setEditData] = useState({
    biodieselPrice:0,
    fossilDieselPrice:0,
    variableCost:0,
    fixedCost:0,
    stockLiters:0,
    monthlyDemand:0,
    dailyCapacity:0,
  });
  const [showMoreData, setShowMoreData] = useState(false);

  const [isStatsUnlocked, setIsStatsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showRadiusStations, setShowRadiusStations] = useState(false);
  const [searchConsorcio, setSearchConsorcio] = useState("");
  const [regionesExpandidas, setRegionesExpandidas] = useState<Record<string, boolean>>({});

  const [radiusStationsData, setRadiusStationsData] = useState<any>(null);
  // Datos de consorcios camineros
  const regiones = consorciosData.regiones;
  const totalConsorcios = regiones.reduce((acc, r) => acc + r.consorcios.length, 0);

  // Filtrar consorcios por búsqueda
  const getConsorciosFiltrados = (consorcios: string[]) => {
    if (!searchConsorcio.trim()) return consorcios;
    const term = searchConsorcio.toLowerCase().trim();
    return consorcios.filter(c => c.toLowerCase().includes(term));
  };

  // Contar consorcios visibles
  const consorciosVisibles = regiones.reduce((acc, r) => {
    return acc + getConsorciosFiltrados(r.consorcios).length;
  }, 0);

  // Toggle expandir región
  const toggleRegion = (nombre: string) => {
    setRegionesExpandidas(prev => ({
      ...prev,
      [nombre]: !prev[nombre]
    }));
  };


  const handlePasswordSubmit = () => {
    console.log('🔍 Contraseña ingresada:', passwordInput);
    console.log('🔍 Hash cargado:', import.meta.env.VITE_DASHBOARD_PASSWORD_HASH ? '✅ Sí' : '❌ No');
    
    if (verifyPassword(passwordInput)) {
      setIsStatsUnlocked(true);
      setShowPasswordModal(false);
      setPasswordInput("");
      logger.log('✅ Dashboard desbloqueado');
    } else {
      logger.warn('❌ Intento de contraseña incorrecta');
      alert("Contraseña incorrecta");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      setIsStatsUnlocked(false);
      setShowRadiusStations(false);
      setRadiusStationsData(null);

      setEditData({
        biodieselPrice: 0,
        fossilDieselPrice: 0,
        variableCost: 0,
        fixedCost: 0,
        stockLiters: 0,
        monthlyDemand: 0,
        dailyCapacity: 0,
      });
    }
  }, [selectedCompany]);

  // ============================================
  // CALCULAR DISTANCIA
  // ============================================
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ============================================
// ESTACIONES EN RADIO
// ============================================
const getStationsInRadius = async () => {
  if (!selectedCompany) return;

  const plantLat = selectedCompany.latitude;
  const plantLng = selectedCompany.longitude;

  if (!plantLat || !plantLng) {
    alert('La planta no tiene coordenadas');
    return;
  }

  try {
    console.log('🔄 Cargando estaciones desde la API...');
    
    const [ypfResponse, blancasResponse] = await Promise.all([
      api.get('/ypf'),
      api.get('/estaciones-blancas'),
    ]);

    const ypfData = Array.isArray(ypfResponse.data) ? ypfResponse.data : [];
    const blancasData = Array.isArray(blancasResponse.data) ? blancasResponse.data : [];

    console.log('📊 YPF cargadas:', ypfData.length);
    console.log('📊 Blancas cargadas:', blancasData.length);

    if (ypfData.length === 0 && blancasData.length === 0) {
      alert('No hay estaciones cargadas en el sistema');
      return;
    }

    const allStations = [
      ...ypfData.map((s: any) => ({ ...s, tipo: 'YPF' })),
      ...blancasData.map((s: any) => ({ ...s, tipo: 'Bandera Blanca' })),
    ];

    const withDistance = allStations.map((s: any) => {
      const dist = calculateDistance(plantLat, plantLng, s.latitud, s.longitud);
      return { ...s, distancia: dist };
    });

    const filtered = withDistance
      .filter(s => s.distancia <= radiusKm)
      .sort((a, b) => a.distancia - b.distancia);

    setRadiusStationsData({
      planta: selectedCompany.name,
      radio: radiusKm,
      total: filtered.length,
      estaciones: filtered,
    });
    setShowRadiusStations(true);
  } catch (error) {
    console.error('❌ Error cargando estaciones:', error);
    alert('Error al cargar las estaciones. Revisá la consola para más detalles.');
  }
};

const exportRadiusStationsToExcel = () => {
  if (!radiusStationsData || radiusStationsData.estaciones.length === 0) {
    alert('No hay estaciones en este radio para exportar');
    return;
  }

  const data = [
      [`Reporte de estaciones en radio ${radiusStationsData.radio} km`],
      [`Planta: ${radiusStationsData.planta}`],
      [`Total estaciones: ${radiusStationsData.total}`],
      [],
      ['Tipo', 'Nombre', 'Dirección', 'Distancia (km)'],
    ];

    radiusStationsData.estaciones.forEach((s: any) => {
      data.push([s.tipo, s.nombre, s.direccion, s.distancia.toFixed(1)]);
    });

    import('xlsx').then(XLSX => {
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Estaciones en radio');
      XLSX.writeFile(wb, `estaciones_radio_${radiusStationsData.planta}_${radiusStationsData.radio}km.xlsx`);
    });
  };

  const savingsVsFossil = editData.fossilDieselPrice > 0 
    ? ((editData.fossilDieselPrice - editData.biodieselPrice) / editData.fossilDieselPrice * 100) : 0;
  const grossMargin = editData.biodieselPrice - editData.variableCost;
  const dailyDemand = editData.monthlyDemand / 30;
  const coverageDays = dailyDemand > 0 ? editData.stockLiters / dailyDemand : 0;
  const currentDailyProduction = editData.monthlyDemand / 25;
  const capacityPercent = editData.dailyCapacity > 0 ? (currentDailyProduction / editData.dailyCapacity * 100) : 0;

  const handleSave = () => {
    if (!selectedCompany) return;
    
    const updatedData = {
      ...selectedCompany,
      biodieselPrice: editData.biodieselPrice,
      fossilDieselPrice: editData.fossilDieselPrice,
      variableCost: editData.variableCost,
      fixedCost: editData.fixedCost,
      stockLiters: editData.stockLiters,
      monthlyDemand: editData.monthlyDemand,
      dailyCapacity: editData.dailyCapacity,
    };
    
    if (isOwner && onUpdateCompany) {
      onUpdateCompany(updatedData);
      alert('✅ Cambios guardados permanentemente');
    } else if (onUpdateCompanyLocal) {
      onUpdateCompanyLocal(updatedData);
      alert('📊 Cambios aplicados localmente');
    } else {
      onSelectCompany(updatedData);
    }
  };

  const exportToExcel = () => {
    import("xlsx").then(XLSX => {
      const data = [
        ["REPORTE COMPLETO DE BIODIESEL", ""],
        ["", ""],
        ["DATOS GENERALES", ""],
        ["Empresa", selectedCompany?.name || ""],
        ["CUIT", selectedCompany?.cuit || ""],
        ["Dirección", selectedCompany?.address || ""],
        ["", ""],
        ["CÁMARA BIOPYME", ""],
        ["Conoce la Cámara", selectedCompany?.knowsChamber ? "Sí" : "No"],
        ["Está asociado", selectedCompany?.isAssociated ? "Sí" : "No"],
        ["Desea asociarse", selectedCompany?.wantsToAssociate ? "Sí" : "No"],
        ["", ""],
        ["ESTADO DEL PROYECTO", ""],
        ["Grado de avance", selectedCompany?.projectStatus || ""],
        ["", ""],
        ["TECNOLOGÍA", ""],
        ["Equipamiento", selectedCompany?.equipment || ""],
        ["", ""],
        ["CAPACIDAD INSTALADA", ""],
        ["Capacidad nominal", selectedCompany?.nominalCapacityRange || ""],
        ["Producción actual", `${selectedCompany?.productionMonth?.toLocaleString() || 0} Lts/mes`],
        ["", ""],
        ["PRECIOS Y COSTOS", ""],
        ["Precio biodiesel", `$${editData.biodieselPrice}/L`],
        ["Precio diesel fósil", `$${editData.fossilDieselPrice}/L`],
        ["Ahorro vs fósil", `${savingsVsFossil.toFixed(1)}%`],
        ["Costo variable", `$${editData.variableCost}/L`],
        ["Costo fijo mensual", `$${editData.fixedCost.toLocaleString()}`],
        ["Margen bruto", `$${grossMargin.toFixed(0)}/L`],
        ["", ""],
        ["HABILITACIONES", ""],
        ["Presentación Sec. Energía Nación", selectedCompany?.hasSecEnergyLicense ? "Presentado" : "No presentado"],
        ["Sello B100 CBA", selectedCompany?.hasSelloB100 ? "Obtenido" : "No obtenido"],
        ["Avance de trámite", selectedCompany?.secEnergyProcessStatus || ""],
        ["", ""],
        ["CALIDAD", ""],
        ["Controlada", selectedCompany?.qualityControlled ? "Sí" : "No"],
        ["Posee análisis", selectedCompany?.hasAnalysis ? "Sí" : "No"],
        ["Resultado satisfactorio", selectedCompany?.satisfactoryResult ? "Sí" : "No"],
        ["Laboratorio de referencia", selectedCompany?.labReference || ""],
        ["", ""],
        ["ACEITE", ""],
        ["Tipo de aceite", selectedCompany?.oilType || ""],
        ["", ""],
        ["STOCK Y CAPACIDAD", ""],
        ["Stock actual", `${editData.stockLiters.toLocaleString()} L`],
        ["Demanda mensual", `${editData.monthlyDemand.toLocaleString()} L`],
        ["Días de cobertura", `${Math.floor(coverageDays)} días`],
        ["Capacidad diaria", `${editData.dailyCapacity.toLocaleString()} L/día`],
        ["Capacidad utilizada", `${capacityPercent.toFixed(0)}%`],
        ["", ""],
        ["EMPLEOS", ""],
        ["Empleados", selectedCompany?.employees || 0],
      ];
      
      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = [{ wch: 35 }, { wch: 35 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, selectedCompany?.name);
      XLSX.writeFile(wb, `${selectedCompany?.name}_reporte_completo_${new Date().toISOString().split("T")[0]}.xlsx`);
    });
  };

  const exportToPDF = () => {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(autoTable => {
        const doc = new jsPDF.default();
        doc.setFontSize(18);
        doc.setTextColor(37, 99, 235);
        doc.text("Reporte Completo de Biodiesel", 14, 20);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(selectedCompany?.name || "", 14, 32);
        doc.text(`CUIT: ${selectedCompany?.cuit || ""}`, 14, 42);
        doc.setFontSize(9);
        doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 50);
        
        const tableData = [
          ["DATOS GENERALES", ""],
          ["Empresa", selectedCompany?.name || ""],
          ["CUIT", selectedCompany?.cuit || ""],
          ["Dirección", selectedCompany?.address || ""],
          ["", ""],
          ["CÁMARA BIOPYME", ""],
          ["Conoce la Cámara", selectedCompany?.knowsChamber ? "Sí" : "No"],
          ["Está asociado", selectedCompany?.isAssociated ? "Sí" : "No"],
          ["Desea asociarse", selectedCompany?.wantsToAssociate ? "Sí" : "No"],
          ["", ""],
          ["ESTADO DEL PROYECTO", ""],
          ["Grado de avance", selectedCompany?.projectStatus || ""],
          ["", ""],
          ["TECNOLOGÍA", ""],
          ["Equipamiento", selectedCompany?.equipment || ""],
          ["", ""],
          ["CAPACIDAD INSTALADA", ""],
          ["Capacidad nominal", selectedCompany?.nominalCapacityRange || ""],
          ["Producción actual", `${selectedCompany?.productionMonth?.toLocaleString() || 0} L/mes`],
          ["", ""],
          ["PRECIOS Y COSTOS", ""],
          ["Precio biodiesel", `$${editData.biodieselPrice}/L`],
          ["Precio diesel fósil", `$${editData.fossilDieselPrice}/L`],
          ["Ahorro vs fósil", `${savingsVsFossil.toFixed(1)}%`],
          ["Costo variable", `$${editData.variableCost}/L`],
          ["Margen bruto", `$${grossMargin.toFixed(0)}/L`],
          ["", ""],
          ["HABILITACIONES", ""],
          ["Sec. Energía Nación", selectedCompany?.hasSecEnergyLicense ? "Presentado" : "No presentado"],
          ["Sello B100 CBA", selectedCompany?.hasSelloB100 ? "Obtenido" : "No obtenido"],
          ["Avance de trámite", selectedCompany?.secEnergyProcessStatus || ""],
          ["", ""],
          ["CALIDAD", ""],
          ["Controlada", selectedCompany?.qualityControlled ? "Sí" : "No"],
          ["Posee análisis", selectedCompany?.hasAnalysis ? "Sí" : "No"],
          ["Resultado satisfactorio", selectedCompany?.satisfactoryResult ? "Sí" : "No"],
          ["Laboratorio", selectedCompany?.labReference || ""],
          ["", ""],
          ["ACEITE", ""],
          ["Tipo de aceite", selectedCompany?.oilType || ""],
          ["", ""],
          ["STOCK", ""],
          ["Stock actual", `${editData.stockLiters.toLocaleString()} L`],
          ["Demanda mensual", `${editData.monthlyDemand.toLocaleString()} L`],
          ["Días de cobertura", `${Math.floor(coverageDays)} días`],
          ["Capacidad utilizada", `${capacityPercent.toFixed(0)}%`],
          ["", ""],
          ["EMPLEOS", ""],
          ["Empleados", selectedCompany?.employees || 0],
        ];
        
        autoTable.default(doc, {
          body: tableData,
          startY: 58,
          theme: "striped",
          headStyles: { fillColor: [37, 99, 235] },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 80 } },
        });
        
        doc.save(`${selectedCompany?.name}_reporte_completo.pdf`);
      });
    });
  };

  const filteredCompanies = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(filters.search.toLowerCase());
    let matchType = true;
    if (filters.type !== "todos") {
      matchType = c.type === filters.type.toUpperCase();
    }
    const matchStock = c.stockLiters >= filters.minStock;
    return matchSearch && matchType && matchStock;
  });

  // Vista de planta seleccionada
if (selectedCompany) {
  return (
    <div className="w-80 bg-blue-50 border-r border-blue-200 flex flex-col h-full shadow-lg animate-slide-in">
      {/* Header del sidebar */}
      <div className="p-4 bg-gradient-to-r from-blue-800 to-blue-700 text-white">
        <button
          onClick={() => { onBackToList(); onSelectCompany(null); }}
          className="mb-3 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition"
        >
          ← Volver
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold">{selectedCompany.name}</h2>
            <p className="text-xs text-blue-100 mt-1">
              {selectedCompany.type === "planta" ? "🌱 Planta productora" : 
               selectedCompany.type === "expendio" ? "⛽ Punto de expendio" : "📦 Almacenadora"}
            </p>
          </div>
          {/* 👇 BOTÓN DE BLOQUEO */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="text-sm bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition"
          >
            {isStatsUnlocked ? "🔓" : "🔒"}
          </button>
        </div>
      </div>

      {/* 👇 MODAL DE CONTRASEÑA */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔒 Acceso a estadísticas</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ingresá la contraseña para ver las estadísticas y datos adicionales de la planta.
            </p>
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              className="w-full p-2.5 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Desbloquear
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👇 CONTENIDO PRINCIPAL */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isStatsUnlocked ? (
          <>
            {/* Precios */}
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">💰 Precios</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-blue-600 block mb-1">Precio biodiesel ($/L)</label>
                  <input type="number" value={editData.biodieselPrice} onChange={(e) => setEditData({ ...editData, biodieselPrice: Number(e.target.value) })} className="w-full p-2 text-sm bg-blue-50 border border-blue-200 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-blue-600 block mb-1">Precio diesel fósil ($/L)</label>
                  <input type="number" value={editData.fossilDieselPrice} onChange={(e) => setEditData({ ...editData, fossilDieselPrice: Number(e.target.value) })} className="w-full p-2 text-sm bg-blue-50 border border-blue-200 rounded-lg text-blue-800" />
                </div>
                <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                  <p className="text-xs font-semibold text-green-600">💚 Ahorro: {savingsVsFossil.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Costos */}
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">📊 Costos</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-blue-600 block mb-1">Costo variable ($/L)</label>
                  <input type="number" value={editData.variableCost} onChange={(e) => setEditData({ ...editData, variableCost: Number(e.target.value) })} className="w-full p-2 text-sm bg-blue-50 border border-blue-200 rounded-lg text-blue-800" />
                </div>
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600">💰 Margen bruto: ${grossMargin.toFixed(0)}/L</p>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">📦 Stock</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-blue-600 block mb-1">Stock actual (L)</label>
                  <input type="number" value={editData.stockLiters} onChange={(e) => setEditData({ ...editData, stockLiters: Number(e.target.value) })} className="w-full p-2 text-sm bg-blue-50 border border-blue-200 rounded-lg text-blue-800" />
                </div>
                <div>
                  <label className="text-xs text-blue-600 block mb-1">Demanda mensual (L)</label>
                  <input type="number" value={editData.monthlyDemand} onChange={(e) => setEditData({ ...editData, monthlyDemand: Number(e.target.value) })} className="w-full p-2 text-sm bg-blue-50 border border-blue-200 rounded-lg text-blue-800" />
                </div>
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-600">📆 Cobertura: {Math.floor(coverageDays)} días</p>
                </div>
              </div>
            </div>

            {/* Capacidad */}
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">🏭 Capacidad</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-blue-600 block mb-1">Capacidad diaria (L/día)</label>
                  <input type="number" value={editData.dailyCapacity} onChange={(e) => setEditData({ ...editData, dailyCapacity: Number(e.target.value) })} className="w-full p-2 text-sm bg-blue-50 border border-blue-200 rounded-lg text-blue-800" />
                </div>
                <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                  <p className="text-xs font-semibold text-purple-600">📈 Uso: {capacityPercent.toFixed(0)}%</p>
                </div>
              </div>
            </div>


          <div className="flex gap-2">
            <button onClick={exportToExcel} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium">📊 Excel</button>
            <button onClick={exportToPDF} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium">📄 PDF</button>
            {/*<button onClick={onShowCharts} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">{showCharts ? "🗺️ Mapa" : "📈 Gráficos"}</button>*/}
          </div>


            {/* Ver más datos */}
            <button onClick={() => setShowMoreData(!showMoreData)} className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-lg text-sm transition">
              ▼ {showMoreData ? "Menos" : "Más"} datos
            </button>
            
            {showMoreData && (
              <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-sm border border-blue-200">
                <div className="flex justify-between">
                  <span className="text-blue-600">Capacidad nominal:</span>
                  <span className="text-blue-800 font-medium">{selectedCompany.nominalCapacityRange || 'No especificado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Producción actual:</span>
                  <span className="text-blue-800 font-medium">{selectedCompany.productionMonth.toLocaleString()} L/mes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Empleados:</span>
                  <span className="text-blue-800 font-medium">{selectedCompany.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Certificado calidad:</span>
                  <span className={selectedCompany.qualityCertified ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                    {selectedCompany.qualityCertified ? '✓ Sí' : '✗ No'}
                  </span>
                </div>
              </div>
            )}  
          </>
        ) : (
/* BLOQUEADO */
          <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
            <p className="text-gray-500 mb-3">🔒 Estadísticas bloqueadas</p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Desbloquear estadísticas
            </button>
          </div>

        )}
      </div>
                          <div className="p-4 border-t border-blue-200 bg-white">
        <label className="text-xs text-blue-600 block mb-2">Radio de influencia: {radiusKm} km</label>
        <Slider value={radiusKm} onChange={(_, v) => onRadiusChange(v as number)} min={0.5} max={50} step={0.5} sx={{ color: "#3b82f6" }} />
      </div>

      {/* Botón y panel de estaciones en radio */}
      <div className="p-4 border-t border-blue-200 bg-white">
        {/* Botón para buscar estaciones en radio */}
        <button
          onClick={getStationsInRadius}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
        >
          🔍 Buscar estaciones en este radio
        </button>

        {/* Panel de resultados */}
        {showRadiusStations && radiusStationsData && (
          <div className="mt-3 bg-white rounded-lg border border-blue-200 p-3 max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-blue-800">
                📍 Estaciones en {radiusStationsData.radio} km
              </h4>
              <div className="flex gap-2 items-center">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Total: {radiusStationsData.total}
                </span>
                {radiusStationsData.total > 0 && (
                  <button
                    onClick={exportRadiusStationsToExcel}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded transition"
                  >
                    📊 Excel
                  </button>
                )}
                <button
                  onClick={() => setShowRadiusStations(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {radiusStationsData.total === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay estaciones en este radio
              </p>
            ) : (
              <div className="space-y-1">
                {radiusStationsData.estaciones.map((s: any, idx: number) => (
                  <div key={idx} className="text-xs flex justify-between items-center border-b border-gray-100 py-1">
                    <div className="flex items-center gap-2">
                      <span className={s.tipo === 'YPF' ? 'text-blue-600' : 'text-gray-600'}>
                        {s.tipo === 'YPF' ? '🔵' : '⚪'}
                      </span>
                      <span className="font-medium text-gray-700">{s.nombre}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-[10px] truncate max-w-[100px]">{s.direccion}</span>
                      <span className="font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                        {s.distancia.toFixed(1)} km
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

  // Vista de listado
  return (
    <div className="w-80 bg-blue-50 border-r border-blue-200 flex flex-col h-full shadow-lg">
      <div className="p-4 bg-gradient-to-r from-blue-800 to-blue-700 text-white">
        <h1 className="text-sm font-bold">Plantas productoras y/o comercializadoras de biocombustibles y cortes</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">

      <div className="p-4 space-y-4">
        <input type="text" placeholder="🔍 Buscar empresa o consorcio..." value={filters.search} onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })} className="w-full p-2.5 text-sm bg-white border border-blue-200 rounded-lg text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        
        <select value={filters.type} onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })} className="w-full p-2.5 text-sm bg-white border border-blue-200 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="todos">📋 Todos los tipos</option>
          <option value="planta">🌱 Plantas</option>
          <option value="expendio">⛽ Expendios</option>
          <option value="almacenadora">📦 Almacenadoras</option>
        </select>

        <select 
          value={filterDepartamento} 
          onChange={(e) => {
            const value = e.target.value;
            setFilterDepartamento(value);
            if (onFilterChange) onFilterChange(value, filterEstacionTipo);          }}
          className="w-full p-2.5 text-sm bg-white border border-blue-200 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">📍 Todos los departamentos</option>
          <option value="Capital">Capital</option>
          <option value="Colon">Colón</option>
          <option value="Calamuchita">Calamuchita</option>
          <option value="Cruz Del Eje">Cruz del Eje</option>
          <option value="General Roca">General Roca</option>
          <option value="General San Martín">General San Martín</option>
          <option value="Ischilin">Ischilín</option>
          <option value="Juarez Celman">Juárez Celman</option>
          <option value="Marcos Juarez">Marcos Juárez</option>
          <option value="Minas">Minas</option>
          <option value="Pocho">Pocho</option>
          <option value="Presidente Roque Saenz Peña">Presidente Roque Sáenz Peña</option>
          <option value="Punilla">Punilla</option>
          <option value="Rio Cuarto">Río Cuarto</option>
          <option value="Rio Primero">Río Primero</option>
          <option value="Rio Seco">Río Seco</option>
          <option value="Rio Segundo">Río Segundo</option>
          <option value="San Alberto">San Alberto</option>
          <option value="San Javier">San Javier</option>
          <option value="San Justo">San Justo</option>
          <option value="Santa Maria">Santa María</option>
          <option value="Sobremonte">Sobremonte</option>
          <option value="Tercero Arriba">Tercero Arriba</option>
          <option value="Totoral">Totoral</option>
          <option value="Tulumba">Tulumba</option>
          <option value="Union">Unión</option>
        </select>

        <select 
          value={filterEstacionTipo} 
          onChange={(e) => {
          const value = e.target.value;
          setFilterEstacionTipo(value);
          if (onFilterChange) onFilterChange(filterDepartamento, value);
        }}
          className="w-full p-2.5 text-sm bg-white border border-blue-200 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">⛽ Todas las estaciones</option>
          <option value="ypf">🔵 YPF</option>
          <option value="blanca">⚪ Bandera blanca</option>
        </select>

        <div>
          <label className="text-xs text-blue-600">Stock mínimo: {filters.minStock.toLocaleString()} L</label>
          <Slider value={filters.minStock} onChange={(_, v) => onFiltersChange({ ...filters, minStock: v as number })} min={0} max={30000} step={1000} sx={{ color: "#3b82f6" }} />
        </div>
      </div>

      {/* ===== SEPARADOR ===== */}
      <div className="border-t border-blue-200"></div>

        
        <p className="text-xs font-semibold text-blue-500 px-2 py-2">Empresas ({filteredCompanies.length})</p>
        {filteredCompanies.map((c) => (
          <div key={c.id} onClick={() => onSelectCompany(c)} className="p-3 rounded-xl cursor-pointer bg-white hover:bg-blue-100 border border-blue-200 transition shadow-sm">
            <p className="font-semibold text-blue-800 text-sm">{c.name}</p>
            <p className="text-xs text-blue-600 mt-1">📦 {c.stockLiters.toLocaleString()} L</p>
            <p className="text-xs text-blue-500 mt-1">CUIT: {c.cuit}</p>
          </div>
        ))}
        {/* ===== CONSORCIOS CAMINEROS ===== */}
        <div>
          <div className="flex justify-between items-center px-2 py-1">
            <p className="text-xs font-semibold text-blue-600">
              🛣️ Consorcios Camineros {searchConsorcio ? `(${consorciosVisibles})` : `(${totalConsorcios})`}
            </p>
            {searchConsorcio && (
              <span className="text-xs text-blue-400">
                {consorciosVisibles} encontrados
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {regiones.map((region) => {
              const consorciosFiltrados = getConsorciosFiltrados(region.consorcios);
              
              if (searchConsorcio && consorciosFiltrados.length === 0) {
                return null;
              }
              
              const isExpanded = regionesExpandidas[region.nombre] || false;
              const totalConsorciosRegion = region.consorcios.length;
              const encontradosRegion = consorciosFiltrados.length;
              
              return (
                <div key={region.nombre} className="bg-white rounded-lg border border-blue-100 overflow-hidden shadow-sm">
                  <div
                    onClick={() => toggleRegion(region.nombre)}
                    className="flex justify-between items-center px-3 py-1.5 cursor-pointer hover:bg-blue-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-700">
                        {isExpanded ? '▼' : '▶'} {region.nombre}
                      </span>
                    </div>
                    <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                      {searchConsorcio ? encontradosRegion : totalConsorciosRegion}
                    </span>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-3 pb-2 space-y-0.5">
                      {consorciosFiltrados.map((consorcio, idx) => (
                        <div
                          key={`${region.nombre}-${idx}`}
                          className="text-xs text-gray-600 py-0.5 px-1 hover:bg-blue-50 rounded transition flex items-center gap-1"
                        >
                          <span className="text-blue-400 text-[10px]">•</span>
                          {consorcio}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {searchConsorcio && consorciosVisibles === 0 && (
            <div className="text-center py-3 text-xs text-gray-500">
              No se encontraron consorcios para "{searchConsorcio}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}