import { useState, useEffect } from "react";
import type { Company, Filters } from "../../types";
import { Slider } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

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
}: SidebarProps) {
  const { user } = useAuth();
  
  const isOwner = user?.role === 'ORGANIZATION_MANAGER' && user?.companyId === selectedCompany?.id;
  
  const [editData, setEditData] = useState({
    biodieselPrice: selectedCompany?.biodieselPrice || 0,
    fossilDieselPrice: selectedCompany?.fossilDieselPrice || 0,
    variableCost: selectedCompany?.variableCost || 0,
    fixedCost: selectedCompany?.fixedCost || 0,
    stockLiters: selectedCompany?.stockLiters || 0,
    monthlyDemand: selectedCompany?.monthlyDemand || 0,
    dailyCapacity: selectedCompany?.dailyCapacity || 0,
  });
  const [showMoreData, setShowMoreData] = useState(false);

  useEffect(() => {
    if (selectedCompany) {
      setEditData({
        biodieselPrice: selectedCompany.biodieselPrice,
        fossilDieselPrice: selectedCompany.fossilDieselPrice,
        variableCost: selectedCompany.variableCost,
        fixedCost: selectedCompany.fixedCost,
        stockLiters: selectedCompany.stockLiters,
        monthlyDemand: selectedCompany.monthlyDemand,
        dailyCapacity: selectedCompany.dailyCapacity,
      });
    }
  }, [selectedCompany]);

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
        {/* Header del sidebar - Azul oscuro */}
        <div className="p-4 bg-gradient-to-r from-blue-800 to-blue-700 text-white">
          <button
            onClick={() => { onBackToList(); onSelectCompany(null); }}
            className="mb-3 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition"
          >
            ← Volver
          </button>
          <h2 className="text-lg font-bold">{selectedCompany.name}</h2>
          <p className="text-xs text-blue-100 mt-1">
            {selectedCompany.type === "planta" ? "🌱 Planta productora" : 
             selectedCompany.type === "expendio" ? "⛽ Punto de expendio" : "📦 Almacenadora"}
          </p>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

          <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm">
            {isOwner ? '💾 Guardar' : '📊 Aplicar cambios'}
          </button>

          <div className="flex gap-2">
            <button onClick={exportToExcel} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium">📊 Excel</button>
            <button onClick={exportToPDF} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium">📄 PDF</button>
            <button onClick={onShowCharts} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">{showCharts ? "🗺️ Mapa" : "📈 Gráficos"}</button>
          </div>

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
        </div>

        <div className="p-4 border-t border-blue-200 bg-white">
          <label className="text-xs text-blue-600 block mb-2">Radio de influencia: {radiusKm} km</label>
          <Slider value={radiusKm} onChange={(_, v) => onRadiusChange(v as number)} min={0.5} max={30} step={0.5} sx={{ color: "#3b82f6" }} />
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

      <div className="p-4 space-y-4">
        <input type="text" placeholder="🔍 Buscar empresa..." value={filters.search} onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })} className="w-full p-2.5 text-sm bg-white border border-blue-200 rounded-lg text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        
        <select value={filters.type} onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })} className="w-full p-2.5 text-sm bg-white border border-blue-200 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="todos">📋 Todos los tipos</option>
          <option value="planta">🌱 Plantas</option>
          <option value="expendio">⛽ Expendios</option>
          <option value="almacenadora">📦 Almacenadoras</option>
        </select>

        <div>
          <label className="text-xs text-blue-600">Stock mínimo: {filters.minStock.toLocaleString()} L</label>
          <Slider value={filters.minStock} onChange={(_, v) => onFiltersChange({ ...filters, minStock: v as number })} min={0} max={30000} step={1000} sx={{ color: "#3b82f6" }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        <p className="text-xs font-semibold text-blue-500 px-2 py-2">Empresas ({filteredCompanies.length})</p>
        {filteredCompanies.map((c) => (
          <div key={c.id} onClick={() => onSelectCompany(c)} className="p-3 rounded-xl cursor-pointer bg-white hover:bg-blue-100 border border-blue-200 transition shadow-sm">
            <p className="font-semibold text-blue-800 text-sm">{c.name}</p>
            <p className="text-xs text-blue-600 mt-1">💰 ${c.biodieselPrice}/L | 📦 {c.stockLiters.toLocaleString()} L</p>
            <p className="text-xs text-blue-500 mt-1">CUIT: {c.cuit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}