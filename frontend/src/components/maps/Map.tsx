import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";
import type { Company } from "../../types";
import LayerControl from "./LayerControl";

// Agregar estos iconos después de los imports
const createLocalidadIcon = () => {
  return L.divIcon({
    html: `<div style="
      background-color: #f59e0b;
      width: 24px;
      height: 24px;
      border-radius: 12px 12px 4px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">🏘️</div>`,
    className: "localidad-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

const createYpfIcon = () => {
  return L.divIcon({
    html: `<div style="
      background-color: #2563eb;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">⛽</div>`,
    className: "ypf-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Componente para etiquetas de regiones
function RegionLabels({ regions, visible }: { regions: any[]; visible: boolean }) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  
  useEffect(() => {
    if (!map || !regions || !visible) return;
    
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    
    regions.forEach((region: any) => {
      if (!region.geometry || !region.geometry.coordinates) return;
      
      let coords: number[][] = [];
      if (region.geometry.type === "Polygon") {
        coords = region.geometry.coordinates[0];
      } else if (region.geometry.type === "MultiPolygon") {
        coords = region.geometry.coordinates[0][0];
      }
      
      if (coords.length === 0) return;
      
      let sumLat = 0, sumLng = 0;
      coords.forEach(coord => {
        sumLat += coord[1];
        sumLng += coord[0];
      });
      const centerLat = sumLat / coords.length;
      const centerLng = sumLng / coords.length;
      
      const icon = L.divIcon({
        html: `<div style="
          background: rgba(255,255,255,0.9);
          color: ${region.properties.color};
          font-size: 12px;
          font-weight: bold;
          padding: 4px 12px;
          border-radius: 20px;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid ${region.properties.color};
        ">${region.properties.name}</div>`,
        className: "region-label",
        iconSize: [150, 30],
        iconAnchor: [75, 15],
      });
      
      const marker = L.marker([centerLat, centerLng], { icon }).addTo(map);
      markersRef.current.push(marker);
    });
    
    return () => {
      markersRef.current.forEach(m => map.removeLayer(m));
    };
  }, [map, regions, visible]);
  
  return null;
}

// Componente para etiquetas de departamentos
function DepartmentLabels({ departments, visible }: { departments: any[]; visible: boolean }) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  
  useEffect(() => {
    if (!map || !departments || !visible) return;
    
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    
    departments.forEach((dept: any) => {
      if (!dept.geometry || !dept.geometry.coordinates) return;
      
      let coords: number[][] = [];
      if (dept.geometry.type === "Polygon") {
        coords = dept.geometry.coordinates[0];
      } else if (dept.geometry.type === "MultiPolygon") {
        coords = dept.geometry.coordinates[0][0];
      }
      
      if (coords.length === 0) return;
      
      let sumLat = 0, sumLng = 0;
      coords.forEach(coord => {
        sumLat += coord[1];
        sumLng += coord[0];
      });
      const centerLat = sumLat / coords.length;
      const centerLng = sumLng / coords.length;
      
      const icon = L.divIcon({
        html: `<div style="
          background: rgba(255,255,255,0.85);
          color: #475569;
          font-size: 10px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        ">${dept.properties.nombre}</div>`,
        className: "dept-label",
        iconSize: [100, 20],
        iconAnchor: [50, 10],
      });
      
      const marker = L.marker([centerLat, centerLng], { icon }).addTo(map);
      markersRef.current.push(marker);
    });
    
    return () => {
      markersRef.current.forEach(m => map.removeLayer(m));
    };
  }, [map, departments, visible]);
  
  return null;
}

interface MapProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  radiusKm: number;
  layers: {
    regions: boolean;
    departments: boolean;
    cities: boolean;
    plants: boolean;
    localidades: boolean;  // 👈 AGREGAR
    ypf: boolean;
  };
  onToggleLayer: (layer: string) => void;
}

export default function Map({ companies, selectedCompany, onSelectCompany, radiusKm, layers, onToggleLayer }: MapProps) {
  const defaultCenter: [number, number] = [-31.4167, -64.1833];
  const [regions, setRegions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionsReady, setRegionsReady] = useState(false);
  const regionLayerRef = useRef<L.GeoJSON | null>(null);
  const departmentLayerRef = useRef<L.GeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const [localidades, setLocalidades] = useState<any[]>([]);
  const [ypfStations, setYpfStations] = useState<any[]>([]);

  // Cargar datos
  useEffect(() => {
    Promise.all([
      fetch('https://biopyme-backend.onrender.com/api/localidades').then(res => res.json()),
      fetch('https://biopyme-backend.onrender.com/api/ypf').then(res => res.json()),
    ]).then(([localidadesData, ypfData]) => {
      setLocalidades(localidadesData);
      setYpfStations(ypfData);
    }).catch(err => console.error('Error loading data:', err));
  }, []);


  // Cargar regiones
  useEffect(() => {
    fetch('/data/geo/cordoba-regions.geojson')
      .then(res => res.json())
      .then(data => {
        const order = ["Región Centro", "Región Este", "Región Oeste", "Región Sur", "Región Noroeste", "Región Noreste"];
        const sortedFeatures = [...data.features].sort((a, b) => {
          return order.indexOf(a.properties.name) - order.indexOf(b.properties.name);
        });
        setRegions(sortedFeatures);
        setRegionsReady(true);
        setLoading(false);
        
        // ✅ FORZAR ACTUALIZACIÓN DEL MAPA después de cargar las regiones
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 100);
      })
      .catch(err => {
        console.error('Error loading regions:', err);
        setLoading(false);
      });
  }, []);

  // Cargar departamentos
  useEffect(() => {
    fetch('/data/geo/cordoba-departments.geojson')
      .then(res => res.json())
      .then(data => {
        setDepartments(data.features);
      })
      .catch(err => console.error('Error loading departments:', err));
  }, []);

  // Cargar ciudades
  useEffect(() => {
    fetch('/data/geo/cordoba-cities.json')
      .then(res => res.json())
      .then(data => {
        setCities(data.features);
      })
      .catch(err => console.error('Error loading cities:', err));
  }, []);

  // Manejar capa de polígonos de regiones
  useEffect(() => {
    if (!mapRef.current || !regionsReady || regions.length === 0) return;
    
    const map = mapRef.current;
    
    if (regionLayerRef.current) {
      map.removeLayer(regionLayerRef.current);
      regionLayerRef.current = null;
    }
    
    if (layers.regions) {
      regionLayerRef.current = L.geoJSON(regions as any, {
        style: (feature) => ({
          color: feature?.properties?.color || "#3b82f6",
          weight: 1.5,
          fillColor: feature?.properties?.fillColor || "#93c5fd",
          fillOpacity: 0.15,
        }),
        onEachFeature: (feature, layer) => {
          if (feature?.properties) {
            layer.bindPopup(`<strong>🗺️ ${feature.properties.name}</strong>`);
          }
        },
      }).addTo(map);
    }
  }, [regions, regionsReady, layers.regions]);

  // Manejar capa de polígonos de departamentos
  useEffect(() => {
    if (!mapRef.current || departments.length === 0) return;
    
    const map = mapRef.current;
    
    if (departmentLayerRef.current) {
      map.removeLayer(departmentLayerRef.current);
      departmentLayerRef.current = null;
    }
    
    if (layers.departments) {
      departmentLayerRef.current = L.geoJSON(departments as any, {
        style: {
          color: "#64748b",
          weight: 1,
          fillColor: "#cbd5e1",
          fillOpacity: 0.2,
        },
        onEachFeature: (feature, layer) => {
          if (feature?.properties) {
            layer.bindPopup(`<strong>📋 ${feature.properties.nombre}</strong>`);
          }
        },
      }).addTo(map);
    }
  }, [departments, layers.departments]);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando mapa...</div>;
  }

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={7.5} 
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <LayerControl layers={layers} onToggle={onToggleLayer} />

      {/* Etiquetas de regiones */}
      <RegionLabels regions={regions} visible={layers.regions} />

      {/* Etiquetas de departamentos */}
      <DepartmentLabels departments={departments} visible={layers.departments} />

      {/* Ciudades - puntos */}
      {layers.cities && cities.map((city: any, idx: number) => {
        const lat = city.geometry.coordinates[1];
        const lng = city.geometry.coordinates[0];
        return (
          <Marker
            key={`city-${idx}`}
            position={[lat, lng]}
            icon={L.divIcon({
              html: `<div style="
                background-color: ${city.properties.tipo === 'capital_provincial' ? '#ef4444' : '#3b82f6'}; 
                width: 8px; 
                height: 8px; 
                border-radius: 50%; 
                border: 2px solid white;
                box-shadow: 0 1px 2px rgba(0,0,0,0.2);
              "></div>`,
              className: "city-dot",
              iconSize: [8, 8],
            })}
          >
            <Popup>
              <strong>{city.properties.nombre}</strong><br/>
              Departamento: {city.properties.departamento}<br/>
              Población: {city.properties.poblacion?.toLocaleString()} hab.
            </Popup>
          </Marker>
        );
      })}

      {/* Localidades */}
      {layers.localidades && localidades.map((loc: any) => (
        <Marker
          key={`localidad-${loc.id}`}
          position={[loc.latitud, loc.longitud]}
          icon={createLocalidadIcon()}
        >
          <Popup>
            <strong>🏘️ {loc.nombre}</strong><br/>
            👥 Habitantes: {loc.habitantes.toLocaleString()}<br/>
            👤 Intendente: {loc.intendente}<br/>
            🔗 Vínculo: {loc.vinculo || 'No especificado'}<br/>
            🏭 Empresas: {loc.empresas || 'No especificadas'}<br/>
            📍 Departamento: {loc.departamento}<br/>
            🗺️ Región: {loc.region}
          </Popup>
        </Marker>
      ))}

      {/* Estaciones YPF */}
      {layers.ypf && ypfStations.map((station: any) => (
        <Marker
          key={`ypf-${station.id}`}
          position={[station.latitud, station.longitud]}
          icon={createYpfIcon()}
        >
          <Popup>
            <strong>⛽ {station.nombre}</strong><br/>
            📍 {station.direccion}<br/>
            📞 {station.telefono || 'No disponible'}
          </Popup>
        </Marker>
      ))}

      {/* Plantas */}
      {layers.plants && companies.map((company) => (
        <Marker
          key={company.id}
          position={[company.latitude, company.longitude]}
          eventHandlers={{ click: () => onSelectCompany(company) }}
        >
          <Popup>
            <div className="p-2">
              <strong>{company.name}</strong>
              <p className="text-sm">{company.address}</p>
              <p className="text-xs text-gray-500">CUIT: {company.cuit}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {selectedCompany && (
        <>
          <Circle
            center={[selectedCompany.latitude, selectedCompany.longitude]}
            radius={radiusKm * 1000}
            pathOptions={{ color: "#ef4444", fillColor: "#fca5a5", fillOpacity: 0.15, weight: 3, dashArray: "5, 5" }}
          />
          <MapController center={[selectedCompany.latitude, selectedCompany.longitude]} zoom={10} />
        </>
      )}
    </MapContainer>
  );
}