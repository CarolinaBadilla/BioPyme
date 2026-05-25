import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface GeoLayerProps {
  url: string;
  visible: boolean;
  style?: (feature: any) => L.PathOptions;
  onEachFeature?: (feature: any, layer: L.Layer) => void;
}

export default function GeoLayer({ url, visible, style, onEachFeature }: GeoLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!map) {
      console.log('GeoLayer: map not ready');
      return;
    }

    const loadLayer = async () => {
      try {
        console.log(`GeoLayer: loading ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`GeoLayer: failed to load ${url} - status ${response.status}`);
          return;
        }
        
        const data = await response.json();
        console.log(`GeoLayer: loaded ${url}`, data);
        
        // Limpiar capa anterior
        if (layerRef.current) {
          map.removeLayer(layerRef.current);
        }

        if (visible && data && data.features) {
          console.log(`GeoLayer: adding layer with ${data.features.length} features`);
          layerRef.current = L.geoJSON(data, {
            style: style || defaultStyle,
            onEachFeature: onEachFeature,
          }).addTo(map);
        }
      } catch (error) {
        console.error(`GeoLayer: error loading ${url}:`, error);
      }
    };

    loadLayer();

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, url, visible]);

  return null;
}

const defaultStyle = {
  color: "#3b82f6",
  weight: 2,
  fillColor: "#93c5fd",
  fillOpacity: 0.3,
};