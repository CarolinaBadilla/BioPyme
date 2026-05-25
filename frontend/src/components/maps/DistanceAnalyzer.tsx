import { useState } from "react";
import type { Company } from "../../types";
import { calculateDistance } from "../../utils/geoUtils";

interface DistanceAnalyzerProps {
  companies: Company[];
  selectedCompany: Company | null;
}

export default function DistanceAnalyzer({ companies, selectedCompany }: DistanceAnalyzerProps) {
  const [selectedExpendioId, setSelectedExpendioId] = useState<number | null>(null);

  if (!selectedCompany || selectedCompany.type !== "planta") return null;

  const expendios = companies.filter(c => c.type === "expendio");
  const selectedExpendio = expendios.find(e => e.id === selectedExpendioId);

  let distance = 0;
  let litersSold = 0;
  let transportCost = 0;

  if (selectedExpendio) {
    distance = calculateDistance(
      selectedCompany.latitude, selectedCompany.longitude,
      selectedExpendio.latitude, selectedExpendio.longitude
    );
    const saleRelation = selectedCompany.sellsTo?.find(s => s.expendioId === selectedExpendio.id);
    litersSold = saleRelation?.monthlyLiters || 0;
    transportCost = distance * 2 * litersSold;
  }

  return (
    <div className="p-3 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚚</span>
          <span className="font-bold text-gray-700">Análisis logístico:</span>
        </div>
        
        <select
          value={selectedExpendioId || ""}
          onChange={(e) => setSelectedExpendioId(Number(e.target.value))}
          className="p-2 border border-gray-200 rounded-lg bg-white text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Seleccionar expendio...</option>
          {expendios.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        {selectedExpendio && (
          <div className="flex gap-4 text-sm flex-wrap">
            <span>📍 Distancia: <strong>{distance.toFixed(1)} km</strong></span>
            <span>⛽ Litros/mes: <strong>{litersSold.toLocaleString()} L</strong></span>
            <span>💰 Transporte: <strong>${transportCost.toLocaleString()}</strong></span>
            {litersSold === 0 && (
              <span className="text-amber-600">⚠️ Potencial de negocio</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}