// src/components/maps/MapControls.tsx
import React from 'react';

interface MapControlsProps {
  isAddingPoint: boolean;
  setIsAddingPoint: (value: boolean) => void;
  isMeasuringDistance: boolean;
  setIsMeasuringDistance: (value: boolean) => void;
  distancePoints: any[];
  distanceResult: number | null;
  setDistancePoints: (points: any[]) => void;  // 👈 AGREGAR
  setDistanceResult: (result: number | null) => void;  // 👈 AGREGAR
}

export default function MapControls({
  isAddingPoint,
  setIsAddingPoint,
  isMeasuringDistance,
  setIsMeasuringDistance,
  distancePoints,
  distanceResult,
  setDistancePoints,  // 👈 AGREGAR
  setDistanceResult,  // 👈 AGREGAR
}: MapControlsProps) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      right: '10px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backgroundColor: 'rgba(255,255,255,0.95)',
      padding: '10px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      border: '1px solid #e2e8f0',
      backdropFilter: 'blur(4px)',
      minWidth: '130px',
    }}>
      {/* Botón Agregar Punto */}
      <button
        onClick={() => {
          if (isAddingPoint) {
            setIsAddingPoint(false);
          } else {
            setIsAddingPoint(true);
            setIsMeasuringDistance(false);
            setDistancePoints([]);
            setDistanceResult(null);
          }
        }}
        style={{
          backgroundColor: isAddingPoint ? '#ef4444' : '#2563eb',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          width: '100%',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isAddingPoint) e.currentTarget.style.backgroundColor = '#1d4ed8';
        }}
        onMouseLeave={(e) => {
          if (!isAddingPoint) e.currentTarget.style.backgroundColor = '#2563eb';
        }}
      >
        {isAddingPoint ? '✖ Cancelar' : '📍 Agregar punto'}
      </button>

      {/* Botón Medir Distancia */}
      <button
        onClick={() => {
          if (isMeasuringDistance) {
            setIsMeasuringDistance(false);
            setDistancePoints([]);
            setDistanceResult(null);
          } else {
            setIsMeasuringDistance(true);
            setIsAddingPoint(false);
            setDistancePoints([]);
            setDistanceResult(null);
          }
        }}
        style={{
          backgroundColor: isMeasuringDistance ? '#ef4444' : '#2563eb',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          width: '100%',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isMeasuringDistance) e.currentTarget.style.backgroundColor = '#1d4ed8';
        }}
        onMouseLeave={(e) => {
          if (!isMeasuringDistance) e.currentTarget.style.backgroundColor = '#2563eb';
        }}
      >
        {isMeasuringDistance ? '✖ Cancelar' : '📏 Medir distancia'}
      </button>

      {/* Estado: Agregando punto */}
      {isAddingPoint && (
        <div style={{
          fontSize: '11px',
          color: '#6b7280',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '6px',
        }}>
          Haz clic en el mapa
        </div>
      )}

      {/* Estado: Midiendo distancia */}
      {isMeasuringDistance && (
        <div style={{
          fontSize: '11px',
          color: '#6b7280',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '6px',
        }}>
          {distancePoints.length === 0 ? 'Punto A: clic en mapa' :
           distancePoints.length === 1 ? 'Punto B: clic en mapa' : ''}
        </div>
      )}

      {/* Resultado de distancia */}
      {distanceResult !== null && !isMeasuringDistance && (
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#1e40af',
          textAlign: 'center',
          backgroundColor: '#dbeafe',
          padding: '4px 8px',
          borderRadius: '6px',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '6px',
        }}>
          📏 {distanceResult.toFixed(1)} km
        </div>
      )}
    </div>
  );
}