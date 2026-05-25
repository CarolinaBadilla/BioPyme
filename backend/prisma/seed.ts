import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando base de datos...');

  // Limpiar
  await prisma.request.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@biopyme.com',
      password: adminPassword,
      role: 'ADMIN',
      name: 'Administrador',
    },
  });
  console.log('✅ Admin creado');

  // AFEMA S.A
  await prisma.company.create({
    data: {
      name: "AFEMA S.A",
      cuit: "30-59875257-1",
      address: "Calle Pública 2050 - Villa Retiro - Córdoba Capital",
      latitude: -31.4167,
      longitude: -64.1833,
      type: "PLANTA",
      biodieselPrice: 850,
      fossilDieselPrice: 950,
      variableCost: 620,
      fixedCost: 180000,
      stockLiters: 15000,
      monthlyDemand: 38000,
      dailyCapacity: 3000,
      employees: 45,
      productionMonth: 35000,
      isApproved: true,
      ownerId: admin.id,
      // Nuevos campos
      knowsChamber: true,
      isAssociated: true,
      wantsToAssociate: false,
      projectStatus: "En producción",
      equipment: "Powerbio",
      nominalCapacityRange: "2.000 a 4.000",
      hasSecEnergyLicense: false,
      hasSelloB100: true,
      secEnergyProcessStatus: "Renovado",
      qualityControlled: true,
      hasAnalysis: true,
      satisfactoryResult: true,
      labReference: "CEPROCOR",
      oilType: "Crudo desgomado",
      qualityCertified: true,
      selloB100: true,
    },
  });
  console.log('✅ AFEMA S.A creada');

  // Vial RG S.A.
  await prisma.company.create({
    data: {
      name: "Vial RG S.A.",
      cuit: "30710000243",
      address: "RN 148 km 959 Traslasierra, Córdoba",
      latitude: -31.95,
      longitude: -65.05,
      type: "PLANTA",
      biodieselPrice: 820,
      fossilDieselPrice: 950,
      variableCost: 710,
      fixedCost: 120000,
      stockLiters: 8000,
      monthlyDemand: 15000,
      dailyCapacity: 5000,
      employees: 18,
      productionMonth: 12000,
      isApproved: true,
      ownerId: admin.id,
      knowsChamber: true,
      isAssociated: true,
      wantsToAssociate: false,
      projectStatus: "Próximo a finalizar",
      equipment: "Powerbio",
      nominalCapacityRange: "4.000 a 6.000",
      hasSecEnergyLicense: true,
      hasSelloB100: false,
      secEnergyProcessStatus: "Medio término",
      qualityControlled: false,
      hasAnalysis: true,
      satisfactoryResult: true,
      labReference: "CEPROCOR",
      oilType: "Neutro seco",
      qualityCertified: false,
      selloB100: false,
    },
  });
  console.log('✅ Vial RG S.A. creada');

  // GREEN DIESEL SAS
  await prisma.company.create({
    data: {
      name: "GREEN DIESEL SAS",
      cuit: "33718121359",
      address: "SAN FRANCISCO CORDOBA",
      latitude: -31.4333,
      longitude: -62.0833,
      type: "PLANTA",
      biodieselPrice: 870,
      fossilDieselPrice: 950,
      variableCost: 580,
      fixedCost: 220000,
      stockLiters: 20000,
      monthlyDemand: 42000,
      dailyCapacity: 5000,
      employees: 52,
      productionMonth: 35000,
      isApproved: true,
      ownerId: admin.id,
      knowsChamber: true,
      isAssociated: true,
      wantsToAssociate: false,
      projectStatus: "En producción",
      equipment: "Powerbio",
      nominalCapacityRange: "4.000 a 6.000",
      hasSecEnergyLicense: true,
      hasSelloB100: true,
      secEnergyProcessStatus: "Completado",
      qualityControlled: true,
      hasAnalysis: true,
      satisfactoryResult: true,
      labReference: "CEPROCOR",
      oilType: "Crudo desgomado",
      qualityCertified: true,
      selloB100: true,
    },
  });
  console.log('✅ GREEN DIESEL SAS creada');

  // EPEC S.A.U
  await prisma.company.create({
    data: {
      name: "EPEC S.A.U",
      cuit: "30-99902748-9",
      address: "La Tablada 350 - Córdoba Capital",
      latitude: -31.41,
      longitude: -64.19,
      type: "ALMACENADORA",
      biodieselPrice: 840,
      fossilDieselPrice: 950,
      variableCost: 650,
      fixedCost: 90000,
      stockLiters: 12000,
      monthlyDemand: 14000,
      dailyCapacity: 2500,
      employees: 25,
      productionMonth: 12000,
      isApproved: true,
      ownerId: admin.id,
      knowsChamber: true,
      isAssociated: true,
      wantsToAssociate: false,
      projectStatus: "En producción",
      equipment: "Porta Hnos.",
      nominalCapacityRange: "2.000 a 4.000",
      hasSecEnergyLicense: true,
      hasSelloB100: false,
      secEnergyProcessStatus: "Medio término",
      qualityControlled: true,
      hasAnalysis: true,
      satisfactoryResult: true,
      labReference: "EPEC",
      oilType: "Crudo desgomado",
      qualityCertified: true,
      selloB100: false,
    },
  });
  console.log('✅ EPEC S.A.U creada');

  console.log('🎉 Seed completado!');
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });