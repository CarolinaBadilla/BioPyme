const fs = require('fs');

try {
  if (!fs.existsSync('departamentos-argentina.geojson')) {
    console.error('❌ El archivo departamentos-argentina.geojson no existe');
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync('departamentos-argentina.geojson', 'utf8');
  console.log(`📄 Archivo cargado: ${fileContent.length} caracteres`);
  
  const data = JSON.parse(fileContent);
  console.log(`📊 Total de features: ${data.features?.length || 0}`);
  
  // Mostrar un ejemplo de propiedades
  if (data.features && data.features.length > 0) {
    console.log('📋 Ejemplo de propiedades:', Object.keys(data.features[0].properties));
  }
  
  // Filtrar Córdoba (ahora usando provincia.nombre)
  const cordobaFeatures = data.features.filter(f => {
    return f.properties.provincia?.nombre === "Córdoba";
  });
  
  console.log(`🔍 Encontrados ${cordobaFeatures.length} departamentos de Córdoba`);
  
  const cordobaDepartments = {
    type: "FeatureCollection",
    features: cordobaFeatures
  };
  
  fs.writeFileSync('cordoba-departments.geojson', JSON.stringify(cordobaDepartments, null, 2));
  console.log(`✅ Guardados ${cordobaDepartments.features.length} departamentos de Córdoba`);
  
  // Mostrar los nombres de los departamentos encontrados
  if (cordobaDepartments.features.length > 0) {
    console.log('📋 Departamentos encontrados:');
    cordobaDepartments.features.forEach(f => {
      const name = f.properties.nombre;
      console.log(`  - ${name}`);
    });
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
}