import { useState, useEffect, useRef } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

interface DistanceCalculatorProps {
  onDistanceCalculated: (dist: number, p1: any, p2: any) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  onPointsUpdate?: (points: any[]) => void;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function DistanceCalculator({ 
  onDistanceCalculated, 
  isActive, 
  setIsActive,
  onPointsUpdate 
}: DistanceCalculatorProps) {
  const map = useMap();
  const [points, setPoints] = useState<any[]>([]);
  const markersRef = useRef<L.Layer[]>([]);
  const lineRef = useRef<L.Polyline | null>(null);
  const labelRef = useRef<L.Marker | null>(null);

  const resetMeasurement = () => {
    markersRef.current.forEach(m => map.removeLayer(m));
    if (lineRef.current) map.removeLayer(lineRef.current);
    if (labelRef.current) map.removeLayer(labelRef.current);
    markersRef.current = [];
    lineRef.current = null;
    labelRef.current = null;
    setPoints([]);
  };

  useMapEvents({
    click: (e) => {
      if (!isActive) return;
      if (points.length >= 2) return;

      const target = e.originalEvent?.target as HTMLElement;
      if (target?.closest?.('.leaflet-popup')) return;

      const { lat, lng } = e.latlng;
      const newPoints = [...points, { lat, lng }];
      setPoints(newPoints);
      if (onPointsUpdate) onPointsUpdate(newPoints);

      // Marcador con número
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          html: `<div style="
            background-color: ${newPoints.length === 1 ? '#2563eb' : '#ef4444'};
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">${newPoints.length}</div>`,
          className: "distance-marker",
          iconSize: [22, 22],
        }),
      }).addTo(map);
      markersRef.current.push(marker);

      if (newPoints.length === 2) {
        const dist = calculateDistance(
          newPoints[0].lat, newPoints[0].lng,
          newPoints[1].lat, newPoints[1].lng
        );
        
        // Línea
        const line = L.polyline(
          [[newPoints[0].lat, newPoints[0].lng], [newPoints[1].lat, newPoints[1].lng]],
          { color: '#2563eb', weight: 3, dashArray: '8, 4' }
        ).addTo(map);
        lineRef.current = line;

        // Etiqueta
        const midLat = (newPoints[0].lat + newPoints[1].lat) / 2;
        const midLng = (newPoints[0].lng + newPoints[1].lng) / 2;
        const label = L.marker([midLat, midLng], {
          icon: L.divIcon({
            html: `<div style="
              background: white;
              padding: 4px 14px;
              border-radius: 20px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
              font-weight: bold;
              font-size: 13px;
              border: 1px solid #2563eb;
            ">📏 ${dist.toFixed(1)} km</div>`,
            className: "distance-label",
            iconSize: [100, 30],
          }),
        }).addTo(map);
        labelRef.current = label;

        onDistanceCalculated(dist, newPoints[0], newPoints[1]);

        setTimeout(() => {
          setIsActive(false);
          resetMeasurement();
        }, 3000);
      }
    },
  });

  useEffect(() => {
    if (!isActive) {
      resetMeasurement();
    }
  }, [isActive]);

  return null;
}