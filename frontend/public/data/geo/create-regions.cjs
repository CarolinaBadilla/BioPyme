const fs = require('fs');

try {
  const departments = JSON.parse(fs.readFileSync('cordoba-departments.geojson', 'utf8'));
  console.log(`📊 Departamentos cargados: ${departments.features.length}`);
  
  // Crear índice de departamentos por nombre
  const deptIndex = {};
  departments.features.forEach(f => {
    const name = f.properties.nombre;
    if (name) {
      deptIndex[name] = f;
    }
  });
  
  // División CORRECTA de regiones de Córdoba
  const regionMapping = {
    "Región Noroeste": [
      "Cruz del Eje", "Ischilín", "Pocho", "Minas", "Sobremonte", 
      "Río Seco", "Tulumba"
    ],
    "Región Noreste": [
      "San Justo", "Río Primero", "San Javier", "Totoral"
    ],
    "Región Centro": [
      "Capital", "Colón", "Río Segundo", "Santa María", 
      "Tercero Arriba"
    ],
    "Región Oeste": [
      "Punilla", "Calamuchita", "San Alberto"
    ],
    "Región Este": [
      "Unión", "Marcos Juárez", "General San Martín"
    ],
    "Región Sur": [
      "Río Cuarto", "Juárez Celman", "Presidente Roque Sáenz Peña", 
      "General Roca"
    ]
  };
  
  const regionColors = {
    "Región Noroeste": { color: "#f59e0b", fillColor: "#fde68a" },      // Amarillo
    "Región Noreste": { color: "#10b981", fillColor: "#a7f3d0" },       // Verde
    "Región Centro": { color: "#3b82f6", fillColor: "#93c5fd" },        // Azul
    "Región Oeste": { color: "#ef4444", fillColor: "#fca5a5" },         // Rojo
    "Región Este": { color: "#06b6d4", fillColor: "#a5f3fc" },          // Celeste
    "Región Sur": { color: "#8b5cf6", fillColor: "#c4b5fd" }            // Violeta
  };
  
  const regionFeatures = [];
  
  for (const [regionName, deptNames] of Object.entries(regionMapping)) {
    const regionDepartments = [];
    for (const deptName of deptNames) {
      if (deptIndex[deptName]) {
        regionDepartments.push(deptIndex[deptName]);
        console.log(`✅ ${deptName} → ${regionName}`);
      } else {
        console.log(`⚠️ Departamento no encontrado: ${deptName}`);
      }
    }
    
    if (regionDepartments.length === 0) continue;
    
    const allCoordinates = [];
    regionDepartments.forEach(dept => {
      if (dept.geometry.type === "Polygon") {
        allCoordinates.push(dept.geometry.coordinates);
      } else if (dept.geometry.type === "MultiPolygon") {
        allCoordinates.push(...dept.geometry.coordinates);
      }
    });
    
    regionFeatures.push({
      type: "Feature",
      properties: {
        name: regionName,
        color: regionColors[regionName].color,
        fillColor: regionColors[regionName].fillColor,
        departments: deptNames.join(", ")
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: allCoordinates
      }
    });
  }
  
  const result = {
    type: "FeatureCollection",
    features: regionFeatures
  };
  
  fs.writeFileSync('cordoba-regions.geojson', JSON.stringify(result, null, 2));
  console.log(`✅ Creadas ${regionFeatures.length} regiones`);
  console.log('📋 Regiones creadas:');
  regionFeatures.forEach(r => console.log(`  - ${r.properties.name}`));
  
} catch (error) {
  console.error('❌ Error:', error.message);
}