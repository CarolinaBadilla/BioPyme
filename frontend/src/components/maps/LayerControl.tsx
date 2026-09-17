import React from 'react';

interface LayerControlProps {
  categories: any[]; // 👈 Ahora recibe las categorías dinámicas de la BD
  layers: Record<string, boolean>; // Estado booleano por slug de capa
  onToggle: (slug: string) => void;
}

export default function LayerControl({ categories, layers, onToggle }: LayerControlProps) {
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
      minWidth: '180px',
      border: '1px solid #e2e8f0'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1e3a5f' }}>🗺️ Capas del mapa</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Capas base del sistema */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.regions ?? true} onChange={() => onToggle('regions')} />
          <span>🗺️ Regiones</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.departments ?? true} onChange={() => onToggle('departments')} />
          <span>📋 Departamentos</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.cities ?? true} onChange={() => onToggle('cities')} />
          <span>🏙️ Ciudades</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.plants ?? true} onChange={() => onToggle('plants')} />
          <span>🌱 Plantas</span>
        </label>

        <hr style={{ margin: '4px 0', borderColor: '#e2e8f0' }} />

        {/* Capas Dinámicas creadas por los administradores */}
        {categories.map((cat) => (
          <label key={cat.slug} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={layers[cat.slug] ?? true} 
              onChange={() => onToggle(cat.slug)} 
            />
            <span>{cat.icon || '📍'} {cat.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}