import { useState, useRef } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

interface AddPointControlProps {
  onPointAdded: (point: { lat: number; lng: number; name: string }) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export default function AddPointControl({ onPointAdded, isActive, setIsActive }: AddPointControlProps) {
  const map = useMap();
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const popupIdRef = useRef<string>('');

  useMapEvents({
    click: (e) => {
      if (!isActive) return;
      if (currentMarkerRef.current) return;

      const target = e.originalEvent?.target as HTMLElement;
      if (target?.closest?.('.leaflet-popup')) return;

      const { lat, lng } = e.latlng;
      const id = `point-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      popupIdRef.current = id;

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      currentMarkerRef.current = marker;

      marker.bindPopup(`
        <div style="min-width:220px;">
          <strong style="color:#1e3a5f;">📍 Nuevo punto</strong>
          <div style="margin:6px 0; font-size:12px; color:#64748b;">
            Lat: ${lat.toFixed(6)}<br/>
            Lng: ${lng.toFixed(6)}
          </div>
          <input id="point-name-${id}" type="text" placeholder="Nombre del punto" 
            style="width:100%; padding:6px; border:1px solid #e2e8f0; border-radius:6px; font-size:13px;"/>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button id="save-point-${id}" style="flex:1; background:#2563eb; color:white; border:none; padding:6px; border-radius:6px; cursor:pointer;">
              Guardar
            </button>
            <button id="cancel-point-${id}" style="flex:1; background:#ef4444; color:white; border:none; padding:6px; border-radius:6px; cursor:pointer;">
              Cancelar
            </button>
          </div>
        </div>
      `).openPopup();

      const handleSave = () => {
        const nameInput = document.getElementById(`point-name-${id}`) as HTMLInputElement;
        const name = nameInput?.value || `Punto ${Date.now()}`;
        // ✅ CORREGIDO: pasar un objeto, no 3 argumentos
        onPointAdded({ lat, lng, name });
        setIsActive(false);
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
          currentMarkerRef.current = null;
        }
      };

      const handleCancel = () => {
        setIsActive(false);
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
          currentMarkerRef.current = null;
        }
      };

      setTimeout(() => {
        const saveBtn = document.getElementById(`save-point-${id}`);
        const cancelBtn = document.getElementById(`cancel-point-${id}`);
        if (saveBtn) {
          saveBtn.addEventListener('click', handleSave);
        }
        if (cancelBtn) {
          cancelBtn.addEventListener('click', handleCancel);
        }
      }, 150);
    },
  });

  return null;
}