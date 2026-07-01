import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";
import type { Company } from "../../types";
import LayerControl from "./LayerControl";
import AddPointControl from "./AddPointControl";
import DistanceCalculator from "./DistanceCalculator";
import MapControls from "./MapControls";

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

const createTempPointIcon = () => {
  return L.divIcon({
    html: `<div style="
      background-color: #8b5cf6;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      animation: pulse 1.5s ease-in-out infinite;
    "></div>`,
    className: "temp-marker",
    iconSize: [16, 16],
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

// Icono para estaciones bandera blanca (distinto al de YPF)
const createEstacionBlancaIcon = () => {
  return L.divIcon({
    html: `<div style="
      background-color: #ffffff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: 2px solid #1e40af;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      color: #1e40af;
    ">⛽</div>`,
    className: "estacion-blanca-marker",
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
    localidades: boolean; 
    ypf: boolean;
    estacionesBlancas: boolean;
  };
  onToggleLayer: (layer: string) => void;
  filterDepartamento: string;
  filterEstacionTipo: string;
}

export default function Map({ companies, selectedCompany, onSelectCompany, radiusKm, layers, onToggleLayer, filterDepartamento, filterEstacionTipo }: MapProps) {
  const defaultCenter: [number, number] = [-31.4167, -64.1833];
  const [regions, setRegions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionsReady, setRegionsReady] = useState(false);
  const regionLayerRef = useRef<L.GeoJSON | null>(null);
  const departmentLayerRef = useRef<L.GeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isMeasuringDistance, setIsMeasuringDistance] = useState(false);
  const [distancePoints, setDistancePoints] = useState<any[]>([]);
  const [distanceResult, setDistanceResult] = useState<number | null>(null);
  const [tempPoints, setTempPoints] = useState<any[]>([]);
  const [departamentosDatos, setDepartamentosDatos] = useState<Record<string, any>>({});

  const [localidades, setLocalidades] = useState<any[]>([]);
  const [ypfStations, setYpfStations] = useState<any[]>([]);
  const [estacionesBlancas, setEstacionesBlancas] = useState<any[]>([]);

  // En el Map, al principio del componente (después de los useState)
  console.log('📊 MAP RENDER - Filtros recibidos:', {
    filterDepartamento,
    filterEstacionTipo,
    ypfCount: ypfStations.length,
    blancasCount: estacionesBlancas.length,
    ypfFiltradas: ypfStations.filter(s => filterDepartamento === "todos" || s.departamento === filterDepartamento).length,
    blancasFiltradas: estacionesBlancas.filter(s => filterDepartamento === "todos" || s.departamento === filterDepartamento).length
  });

  // Agregar este useEffect al principio del componente Map (con los otros useEffect)
    useEffect(() => {
      console.log('🔍 filterDepartamento:', filterDepartamento);
      console.log('🔍 filterEstacionTipo:', filterEstacionTipo);
      console.log('🔍 YPF con depto:', ypfStations.map(s => ({ nombre: s.nombre, depto: s.departamento })));
      console.log('🔍 Blancas con depto:', estacionesBlancas.map(s => ({ nombre: s.nombre, depto: s.departamento })));
    }, [filterDepartamento, filterEstacionTipo, ypfStations, estacionesBlancas]);


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

  // Reemplaza este useEffect en tu Map.tsx
useEffect(() => {
  fetch(`https://biopyme-backend.onrender.com/api/estaciones-blancas`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Estaciones blancas cargadas:', data.length);
      setEstacionesBlancas(data);
    })
    .catch(err => {
      console.warn('Error cargando estaciones blancas:', err);
      setEstacionesBlancas([]); // 👈 Importante: no romper la página
    });
}, []);

  // Manejar capa de polígonos de regiones (con control de interacción)
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
          // 👈 IMPORTANTE: controlar interacción cuando está activo agregar/medir
          interactive: !isAddingPoint && !isMeasuringDistance,
          onEachFeature: (feature, layer) => {
            if (feature?.properties) {
              // Solo bindear popup si no estamos en modo edición
              if (!isAddingPoint && !isMeasuringDistance) {
                layer.bindPopup(`<strong>🗺️ ${feature.properties.name}</strong>`);
              } else {
                // 👈 Si estamos en modo edición, NO mostrar popup
                layer.unbindPopup();
              }
            }
          },
        }).addTo(map);
      }
    }, [regions, regionsReady, layers.regions, isAddingPoint, isMeasuringDistance]);


// ============================================
// Cargar datos demográficos de departamentos
// ============================================
useEffect(() => {
  const API_URL = import.meta.env.VITE_API_URL || 'https://biopyme-backend.onrender.com/api';
  fetch(`${API_URL}/departamentos`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      const map: Record<string, any> = {};
      data.forEach((d: any) => {
        map[d.name] = d;
      });
      setDepartamentosDatos(map);
      console.log('✅ Datos departamentos cargados:', Object.keys(map).length);
    })
    .catch(err => {
      console.warn('Error cargando departamentos:', err);
    });
}, []);

// ============================================
// Manejar capa de polígonos de departamentos
// ============================================
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
                🏢 Viviendas colectivas: ${datos.viviendasColectivas?.toLocaleString() || 'N/D'}<br/>
                🏡 Viviendas particulares: ${datos.viviendasParticulares?.toLocaleString() || 'N/D'}<br/>
                👨‍👩‍👧‍👦 Hogares: ${datos.hogares?.toLocaleString() || 'N/D'}<br/>
                <hr style="margin: 4px 0"/>
                👥 Población total: ${datos.poblacionTotal?.toLocaleString() || 'N/D'}<br/>
                👩 Mujeres: ${datos.mujeres?.toLocaleString() || 'N/D'}<br/>
                👨 Varones: ${datos.varones?.toLocaleString() || 'N/D'}
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

useEffect(() => {
  if (!mapRef.current || !isMeasuringDistance) return;
  
  const map = mapRef.current;
  
  const handleMapClick = (e: any) => {
    if (distancePoints.length >= 2) return;
    
    const { lat, lng } = e.latlng;
    const newPoints = [...distancePoints, { lat, lng }];
    setDistancePoints(newPoints);
    
    // Crear marcador visual temporal
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
    
    // Guardar referencia para limpiar después
    setTimeout(() => {
      map.removeLayer(marker);
    }, 5000);
    
    if (newPoints.length === 2) {
      const R = 6371;
      const dLat = (newPoints[1].lat - newPoints[0].lat) * Math.PI / 180;
      const dLon = (newPoints[1].lng - newPoints[0].lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(newPoints[0].lat * Math.PI / 180) * Math.cos(newPoints[1].lat * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;
      
      setDistanceResult(dist);
      
      // Dibujar línea
      const polyline = L.polyline(
        [[newPoints[0].lat, newPoints[0].lng], [newPoints[1].lat, newPoints[1].lng]],
        { color: '#2563eb', weight: 3, dashArray: '8, 4' }
      ).addTo(map);
      
      setTimeout(() => {
        map.removeLayer(polyline);
      }, 5000);
      
      // Desactivar después de 2 segundos
      setTimeout(() => {
        setIsMeasuringDistance(false);
      }, 2000);
    }
  };
  
  map.on('click', handleMapClick);
  
  return () => {
    map.off('click', handleMapClick);
  };
}, [isMeasuringDistance, distancePoints, mapRef.current]);



// ============================================
// EFECTO: AGREGAR PUNTO - Con popup en el mapa
// ============================================
useEffect(() => {
  if (!mapRef.current || !isAddingPoint) return;

  const map = mapRef.current;
  let currentMarker: L.Marker | null = null;

  const handleMapClick = (e: any) => {
    if (currentMarker) return; // Si ya hay un popup abierto, ignorar

    const { lat, lng } = e.latlng;
    const id = `point-${Date.now()}`;

    // Crear marcador temporal
    currentMarker = L.marker([lat, lng], { draggable: true }).addTo(map);

    // Crear popup con formulario
    currentMarker.bindPopup(`
      <div style="min-width:200px;">
        <strong>📍 Nuevo punto</strong><br/>
        Lat: ${lat.toFixed(6)}<br/>
        Lng: ${lng.toFixed(6)}<br/>
        <input id="point-name-${id}" type="text" placeholder="Nombre del punto" style="margin-top: 5px; width: 100%; padding: 4px;"/>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button id="save-point-${id}" style="flex:1; background: #2563eb; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer;">
            Guardar
          </button>
          <button id="cancel-point-${id}" style="flex:1; background: #ef4444; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer;">
            Cancelar
          </button>
        </div>
      </div>
    `).openPopup();

    // Función para guardar
    const handleSave = () => {
      const nameInput = document.getElementById(`point-name-${id}`) as HTMLInputElement;
      const name = nameInput?.value || `Punto ${tempPoints.length + 1}`;
      
      const newPoint = {
        id: `temp-${Date.now()}`,
        lat,
        lng,
        name,
      };
      setTempPoints([...tempPoints, newPoint]);
      console.log('✅ Punto agregado:', newPoint);
      
      if (currentMarker) {
        currentMarker.remove();
        currentMarker = null;
      }
      setIsAddingPoint(false);
    };

    // Función para cancelar
    const handleCancel = () => {
      if (currentMarker) {
        currentMarker.remove();
        currentMarker = null;
      }
      setIsAddingPoint(false);
    };

    // Esperar a que el DOM esté listo
    setTimeout(() => {
      const saveBtn = document.getElementById(`save-point-${id}`);
      const cancelBtn = document.getElementById(`cancel-point-${id}`);
      if (saveBtn) saveBtn.addEventListener('click', handleSave);
      if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
    }, 200);
  };

  map.on('click', handleMapClick);

  return () => {
    map.off('click', handleMapClick);
    if (currentMarker) {
      currentMarker.remove();
      currentMarker = null;
    }
  };
}, [isAddingPoint, mapRef.current, tempPoints]);



// Cargar datos demográficos de departamentos
// ============================================
useEffect(() => {
  const API_URL = import.meta.env.VITE_API_URL || 'https://biopyme-backend.onrender.com/api';
  fetch(`${API_URL}/departamentos`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      const map: Record<string, any> = {};
      data.forEach((d: any) => {
        map[d.name] = d;
      });
      setDepartamentosDatos(map);
      console.log('✅ Datos departamentos cargados:', Object.keys(map).length);
    })
    .catch(err => {
      console.warn('Error cargando departamentos:', err);
    });
}, []);

const handleAddPoint = (point: { lat: number; lng: number; name: string }) => {
  const newPoint = {
    id: `temp-${Date.now()}`,
    lat: point.lat,
    lng: point.lng,
    name: point.name,
  };
  setTempPoints([...tempPoints, newPoint]);
  console.log('✅ Punto agregado:', newPoint);
  setIsAddingPoint(false);
};

// FUNCIÓN handleDistanceCalculated
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
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <LayerControl layers={layers} onToggle={onToggleLayer} />
  <MapControls
    isAddingPoint={isAddingPoint}
    setIsAddingPoint={setIsAddingPoint}
    isMeasuringDistance={isMeasuringDistance}
    setIsMeasuringDistance={setIsMeasuringDistance}
    distancePoints={distancePoints}
    distanceResult={distanceResult}
    setDistancePoints={setDistancePoints}  
    setDistanceResult={setDistanceResult}   
  />

  {/* 👈 Lógica de agregar punto */}
  <AddPointControl
    onPointAdded={handleAddPoint}
    isActive={isAddingPoint}
    setIsActive={setIsAddingPoint}
  />

  {/* 👈 Lógica de medir distancia */}
  <DistanceCalculator
    onDistanceCalculated={handleDistanceCalculated}
    isActive={isMeasuringDistance}
    setIsActive={setIsMeasuringDistance}
  />

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
      {layers.ypf && ypfStations
      .filter((station: any) => {
        // 👈 CORREGIR: Filtrar por departamento
        if (filterDepartamento === "todos") return true;
        return station.departamento === filterDepartamento;
      })
      .map((station: any) => (
        <Marker
          key={`ypf-${station.id}`}
          position={[station.latitud, station.longitud]}
          icon={createYpfIcon()}
        >
          <Popup>
            <div style={{ minWidth: '150px' }}>
              <strong style={{ color: '#1e40af', fontSize: '14px' }}>⛽ {station.nombre}</strong><br/>
              📍 {station.direccion}
              {station.departamento && <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>📍 {station.departamento}</div>}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Estaciones bandera blanca */}
      {layers.estacionesBlancas && estacionesBlancas
        .filter((estacion: any) => {
          // 👈 CORREGIR: Filtrar por departamento
          if (filterDepartamento === "todos") return true;
          return estacion.departamento === filterDepartamento;
        })
        .map((estacion: any) => (
          <Marker
            key={`blanca-${estacion.id}`}
            position={[estacion.latitud, estacion.longitud]}
            icon={createEstacionBlancaIcon()}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <strong style={{ color: '#1e40af' }}>⛽ {estacion.nombre}</strong><br/>
                📍 {estacion.direccion}
                {estacion.departamento && <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>📍 {estacion.departamento}</div>}
              </div>
            </Popup>
          </Marker>
        ))}

      {/* 👈 AGREGAR ESTE BLOQUE - Puntos temporales */}
      {tempPoints.map((point) => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          icon={createTempPointIcon()}
        >
          <Popup>
            <strong>📍 {point.name}</strong><br/>
            Lat: {point.lat.toFixed(6)}<br/>
            Lng: {point.lng.toFixed(6)}<br/>
            <button 
              onClick={() => {
                setTempPoints(tempPoints.filter(p => p.id !== point.id));
              }}
              style={{
                marginTop: '8px',
                width: '100%',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '5px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🗑️ Eliminar punto
            </button>
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