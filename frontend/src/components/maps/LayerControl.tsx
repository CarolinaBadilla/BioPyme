import React from 'react';

interface LayerControlProps {
  layers: {
    regions: boolean;
    departments: boolean;
    cities: boolean;
    plants: boolean;
    localidades: boolean;  
    ypf: boolean;
    estacionesBlancas: boolean;
  };
  onToggle: (layer: string) => void;
}

export default function LayerControl({ layers, onToggle }: LayerControlProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      fontSize: '12px',
      minWidth: '160px',
      border: '1px solid #e2e8f0'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1e3a5f' }}>🗺️ Capas del mapa</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.regions} onChange={() => onToggle('regions')} />
          <span>🗺️ Regiones</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.departments} onChange={() => onToggle('departments')} />
          <span>📋 Departamentos</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.cities} onChange={() => onToggle('cities')} />
          <span>🏙️ Ciudades</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.plants} onChange={() => onToggle('plants')} />
          <span>🌱 Plantas</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.localidades} onChange={() => onToggle('localidades')} />
          <span>🏘️ Localidades adheridas</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.ypf} onChange={() => onToggle('ypf')} />
          <span>⛽ Estaciones YPF</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.estacionesBlancas} onChange={() => onToggle('estacionesBlancas')} />
          <span>⚪ Estaciones bandera blanca</span>
        </label>
      </div>
    </div>
  );
}