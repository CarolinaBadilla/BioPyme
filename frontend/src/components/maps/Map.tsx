import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";
import type { Company } from "../../types";
import LayerControl from "./LayerControl";
import AddPointControl from "./AddPointControl";
import DistanceCalculator from "./DistanceCalculator";
import MapControls from "./MapControls";
import { logger } from '../../utils/logger';

// Icono para puntos temporales (al agregar puntos en caliente)
const createTempPointIcon = () => {
  return L.divIcon({
    html: `<div style="
      background-color: #8b5cf6;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    "></div>`,
    className: "temp-marker",
    iconSize: [16, 16],
  });
};

// 🌟 ICONO DINÁMICO UNIVERSAL (Lee el color y emoji configurado por el admin)
const createDynamicMarkerIcon = (color: string = '#3b82f6', iconEmoji: string = '📍') => {
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${iconEmoji}</div>`,
    className: "dynamic-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
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
  layers: Record<string, boolean>; // Recibe un diccionario dinámico de capas activas
  onToggleLayer: (layer: string) => void;
  filterDepartamento: string;
  filterEstacionTipo: string;
}

export default function Map({ companies, selectedCompany, onSelectCompany, radiusKm, layers, onToggleLayer, filterDepartamento }: MapProps) {
  const defaultCenter: [number, number] = [-31.4167, -64.1833];
  const [regions, setRegions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionsReady, setRegionsReady] = useState(false);
  
  // 🌟 Estado unificado para las capas y puntos dinámicos de la base de datos
  const [dynamicLayersData, setDynamicLayersData] = useState<any[]>([]);

  const regionLayerRef = useRef<L.GeoJSON | null>(null);
  const departmentLayerRef = useRef<L.GeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isMeasuringDistance, setIsMeasuringDistance] = useState(false);
  const [distancePoints, setDistancePoints] = useState<any[]>([]);
  const [, setDistanceResult] = useState<number | null>(null);
  const [tempPoints, setTempPoints] = useState<any[]>([]);
  const [departamentosDatos, setDepartamentosDatos] = useState<Record<string, any>>({});

  const API_URL = import.meta.env.VITE_API_URL;

  // 🌟 CARGA ÚNICA DE CAPAS DINÁMICAS DESDE EL NUEVO ENDPOINT
  useEffect(() => {
    fetch(`${API_URL}/map-layers/full`)
      .then(res => res.json())
      .then(data => {
        logger.log('🗺️ Capas dinámicas cargadas en Mapa:', data);
        setDynamicLayersData(Array.isArray(data) ? data : []);
        setRegionsReady(true);
        setLoading(false);
      })
      .catch(err => {
        logger.error('Error loading dynamic map layers:', err);
        setLoading(false);
      });
  }, [API_URL]);

  // Cargar regiones geográficas
  useEffect(() => {
    fetch('/data/geo/cordoba-regions.geojson')
      .then(res => res.json())
      .then(data => {
        const order = ["Región Centro", "Región Este", "Región Oeste", "Región Sur", "Región Noroeste", "Región Noreste"];
        const sortedFeatures = [...data.features].sort((a: any, b: any) => {
          return order.indexOf(a.properties.name) - order.indexOf(b.properties.name);
        });
        setRegions(sortedFeatures);
        setTimeout(() => {
          if (mapRef.current) mapRef.current.invalidateSize();
        }, 100);
      })
      .catch(err => logger.error('Error loading regions:', err));
  }, []);

  // Cargar departamentos
  useEffect(() => {
    fetch('/data/geo/cordoba-departments.geojson')
      .then(res => res.json())
      .then(data => setDepartments(data.features))
      .catch(err => logger.error('Error loading departments:', err));
  }, []);

  // Cargar ciudades
  useEffect(() => {
    fetch('/data/geo/cordoba-cities.json')
      .then(res => res.json())
      .then(data => setCities(data.features))
      .catch(err => logger.error('Error loading cities:', err));
  }, []);

  // Cargar datos demográficos de departamentos
  useEffect(() => {
    fetch(`${API_URL}/departamentos`)
      .then(res => res.json())
      .then(data => {
        const map: Record<string, any> = {};
        data.forEach((d: any) => { map[d.name] = d; });
        setDepartamentosDatos(map);
      })
      .catch(err => logger.warn('Error cargando departamentos:', err));
  }, [API_URL]);

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
        interactive: !isAddingPoint && !isMeasuringDistance,
        onEachFeature: (feature, layer) => {
          if (feature?.properties && !isAddingPoint && !isMeasuringDistance) {
            layer.bindPopup(`<strong>🗺️ ${feature.properties.name}</strong>`);
          } else {
            layer.unbindPopup();
          }
        },
      }).addTo(map);
    }
  }, [regions, regionsReady, layers.regions, isAddingPoint, isMeasuringDistance]);

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
        style: { color: "#64748b", weight: 1, fillColor: "#cbd5e1", fillOpacity: 0.2 },
        interactive: !isAddingPoint && !isMeasuringDistance,
        onEachFeature: (feature, layer) => {
          if (feature?.properties) {
            const deptName = feature.properties.nombre;
            const datos = departamentosDatos[deptName];
            if (!isAddingPoint && !isMeasuringDistance) {
              let popupContent = `<strong>📋 ${deptName}</strong><hr style="margin: 4px 0"/>`;
              if (datos) {
                popupContent += `
                  🏠 Viviendas totales: ${datos.totalViviendas?.toLocaleString() || 'N/D'}<br/>
                  👥 Población total: ${datos.poblacionTotal?.toLocaleString() || 'N/D'}<br/>
                `;
              } else {
                popupContent += `<em>Datos no disponibles</em>`;
              }
              layer.bindPopup(popupContent);
            } else {
              layer.unbindPopup();
            }
          }
        },
      }).addTo(map);
    }
  }, [departments, layers.departments, isAddingPoint, isMeasuringDistance, departamentosDatos]);

  const handleAddPoint = (point: { lat: number; lng: number; name: string }) => {
    const newPoint = { id: `temp-${Date.now()}`, lat: point.lat, lng: point.lng, name: point.name };
    setTempPoints([...tempPoints, newPoint]);
    setIsAddingPoint(false);
  };

  const handleDistanceCalculated = (dist: number, p1: any, p2: any) => {
    setDistanceResult(dist);
    setDistancePoints([p1, p2]);
  };

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
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
        maxZoom={16}
      />
      
      {/* 🌟 LE PASAMOS LAS CATEGORÍAS DINÁMICAS AL CONTROL DE CAPAS */}
      <LayerControl categories={dynamicLayersData} layers={layers} onToggle={onToggleLayer} />
      
      <MapControls
        isAddingPoint={isAddingPoint}
        setIsAddingPoint={setIsAddingPoint}
        isMeasuringDistance={isMeasuringDistance}
        setIsMeasuringDistance={setIsMeasuringDistance}
        distancePoints={distancePoints}
        distanceResult={null}
        setDistancePoints={setDistancePoints}  
        setDistanceResult={setDistanceResult}   
      />

      <AddPointControl onPointAdded={handleAddPoint} isActive={isAddingPoint} setIsActive={setIsAddingPoint} />
      <DistanceCalculator onDistanceCalculated={handleDistanceCalculated} isActive={isMeasuringDistance} setIsActive={setIsMeasuringDistance} />

      <RegionLabels regions={regions} visible={layers.regions ?? true} />
      <DepartmentLabels departments={departments} visible={layers.departments ?? true} />

      {/* Ciudades - puntos */}
      {(layers.cities ?? true) && cities.map((city: any, idx: number) => {
        const lat = city.geometry.coordinates[1];
        const lng = city.geometry.coordinates[0];
        return (
          <Marker
            key={`city-${idx}`}
            position={[lat, lng]}
            icon={L.divIcon({
              html: `<div style="background-color: ${city.properties.tipo === 'capital_provincial' ? '#ef4444' : '#3b82f6'}; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white;"></div>`,
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

      {/* 🌟 RENDERIZADO UNIVERSAL DE CAPAS DINÁMICAS (YPF, Blancas, Agroservicios y NUEVAS CAPAS) */}
      {dynamicLayersData.map((category) => {
        // Si el usuario desmarcó esta capa en el menú, no se dibuja
        if (layers[category.slug] === false) return null;

        return category.features
          .filter((feature: any) => {
            if (filterDepartamento === "todos") return true;
            return feature.properties?.departamento === filterDepartamento || 
                   feature.properties?.localidad === filterDepartamento;
          })
          .map((feature: any) => (
            <Marker
              key={`cat-${category.id}-feat-${feature.id}`}
              position={[feature.latitude, feature.longitude]}
              icon={createDynamicMarkerIcon(category.color, category.icon)}
            >
              <Popup>
              <div style={{ minWidth: '200px', fontFamily: 'system-ui, sans-serif', padding: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '2px solid ' + category.color, paddingBottom: '6px' }}>
                  <span style={{ fontSize: '18px' }}>{category.icon || '📍'}</span>
                  <div>
                    <strong style={{ color: '#1e293b', fontSize: '14px', display: 'block' }}>{feature.name}</strong>
                    <span style={{ fontSize: '10px', color: category.color, fontWeight: 'bold', textTransform: 'uppercase' }}>{category.name}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569' }}>
                  {feature.properties && Object.entries(feature.properties).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ textTransform: 'capitalize', color: '#94a3b8' }}>{key}:</span>
                        <span style={{ fontWeight: 500, color: '#334155', textAlign: 'right' }}>{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Popup>
            </Marker>
          ));
      })}

      {/* Puntos temporales agregados en caliente */}
      {tempPoints.map((point) => (
        <Marker key={point.id} position={[point.lat, point.lng]} icon={createTempPointIcon()}>
          <Popup>
            <strong>📍 {point.name}</strong><br/>
            Lat: {point.lat.toFixed(6)}<br/>
            Lng: {point.lng.toFixed(6)}<br/>
            <button 
              onClick={() => setTempPoints(tempPoints.filter(p => p.id !== point.id))}
              style={{ marginTop: '8px', width: '100%', backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
            >
              🗑️ Eliminar punto
            </button>
          </Popup>
        </Marker>
      ))}

      {/* Plantas (Empresas) */}
      {(layers.plants ?? true) && companies.map((company) => (
        <Marker
          key={`company-${company.id}`}
          position={[company.latitude!, company.longitude!]}
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

      {selectedCompany && selectedCompany.latitude && selectedCompany.longitude && (
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