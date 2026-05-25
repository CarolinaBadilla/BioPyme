import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos geográficos de Córdoba...');

  // 1. Regiones
  const regions = [
    { name: "Región Capital", color: "#3b82f6" },
    { name: "Región Pampeana", color: "#10b981" },
    { name: "Región Norte", color: "#f59e0b" },
    { name: "Región Oeste", color: "#ef4444" },
    { name: "Región Sur", color: "#8b5cf6" },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { name: region.name },
      update: {},
      create: region,
    });
  }
  console.log('✅ Regiones creadas');

  // 2. Departamentos
  const departments = [
    // Capital
    { name: "Capital", regionName: "Región Capital", color: "#3b82f6" },
    { name: "Colón", regionName: "Región Capital", color: "#60a5fa" },
    { name: "Santa María", regionName: "Región Capital", color: "#60a5fa" },
    // Pampeana
    { name: "Río Cuarto", regionName: "Región Pampeana", color: "#10b981" },
    { name: "Juárez Celman", regionName: "Región Pampeana", color: "#34d399" },
    { name: "General San Martín", regionName: "Región Pampeana", color: "#34d399" },
    // Norte
    { name: "Cruz del Eje", regionName: "Región Norte", color: "#f59e0b" },
    { name: "Ischilín", regionName: "Región Norte", color: "#fbbf24" },
    { name: "Tulumba", regionName: "Región Norte", color: "#fbbf24" },
    // Oeste
    { name: "Punilla", regionName: "Región Oeste", color: "#ef4444" },
    { name: "San Alberto", regionName: "Región Oeste", color: "#f87171" },
    { name: "Calamuchita", regionName: "Región Oeste", color: "#f87171" },
    // Sur
    { name: "General Roca", regionName: "Región Sur", color: "#8b5cf6" },
    { name: "Presidente Roque Sáenz Peña", regionName: "Región Sur", color: "#a78bfa" },
  ];

  for (const dept of departments) {
    const region = await prisma.region.findUnique({ where: { name: dept.regionName } });
    if (region) {
      await prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: {
          name: dept.name,
          regionId: region.id,
          color: dept.color,
        },
      });
    }
  }
  console.log('✅ Departamentos creados');

  // 3. Ciudades cabeceras
  const cities = [
    // Capital
    { name: "Córdoba", departmentName: "Capital", latitude: -31.4167, longitude: -64.1833, isCapital: true, population: 1500000 },
    { name: "Jesús María", departmentName: "Colón", latitude: -30.9833, longitude: -64.1, isCapital: false, population: 35000 },
    { name: "Alta Gracia", departmentName: "Santa María", latitude: -31.65, longitude: -64.4333, isCapital: false, population: 50000 },
    // Pampeana
    { name: "Río Cuarto", departmentName: "Río Cuarto", latitude: -33.1333, longitude: -64.35, isCapital: false, population: 200000 },
    { name: "La Carlota", departmentName: "Juárez Celman", latitude: -33.4167, longitude: -63.3, isCapital: false, population: 15000 },
    { name: "Villa María", departmentName: "General San Martín", latitude: -32.4167, longitude: -63.2333, isCapital: false, population: 100000 },
    // Norte
    { name: "Cruz del Eje", departmentName: "Cruz del Eje", latitude: -30.7333, longitude: -64.8, isCapital: false, population: 35000 },
    { name: "Deán Funes", departmentName: "Ischilín", latitude: -30.4333, longitude: -64.35, isCapital: false, population: 25000 },
    { name: "Villa Tulumba", departmentName: "Tulumba", latitude: -30.4, longitude: -64.1167, isCapital: false, population: 5000 },
    // Oeste
    { name: "Carlos Paz", departmentName: "Punilla", latitude: -31.4167, longitude: -64.5, isCapital: false, population: 70000 },
    { name: "Mina Clavero", departmentName: "San Alberto", latitude: -31.7167, longitude: -65, isCapital: false, population: 15000 },
    { name: "Embalse", departmentName: "Calamuchita", latitude: -32.1833, longitude: -64.4167, isCapital: false, population: 12000 },
    // Sur
    { name: "Huinca Renancó", departmentName: "General Roca", latitude: -34.8333, longitude: -64.3833, isCapital: false, population: 12000 },
    { name: "Laboulaye", departmentName: "Presidente Roque Sáenz Peña", latitude: -34.1167, longitude: -63.3833, isCapital: false, population: 20000 },
  ];

  for (const city of cities) {
    const department = await prisma.department.findUnique({ where: { name: city.departmentName } });
    if (department) {
      await prisma.city.upsert({
        where: { name: city.name },
        update: {},
        create: {
          name: city.name,
          departmentId: department.id,
          latitude: city.latitude,
          longitude: city.longitude,
          isCapital: city.isCapital,
          population: city.population,
        },
      });
    }
  }
  console.log('✅ Ciudades creadas');

  console.log('🎉 Datos geográficos cargados correctamente');
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });