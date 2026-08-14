import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando extrusoras de soja...');

  await prisma.extrusoraSoja.deleteMany();
  console.log('🗑️ Tabla extrusoras_soja limpiada');

  const extrusoras = [
    { razonSocial: "Aceitera Camilo Aldao SRL", localidad: "Camilo Aldao", latitud: -33.1259, longitud: -62.0935 },
    { razonSocial: "Aceitera Pascanas S.R.L.", localidad: "Pascanas", latitud: -33.1333, longitud: -63.0500 },
    { razonSocial: "AGR SRL", localidad: "Las Higueras", latitud: -33.0921, longitud: -64.2889 },
    { razonSocial: "Agroalimentos Diaz", localidad: "Gral. Cabrera", latitud: -32.8131, longitud: -63.8722 },
    { razonSocial: "Agroleaginosas SA", localidad: "Las Junturas", latitud: -31.8300, longitud: -63.4500 },
    { razonSocial: "Agromonte SA", localidad: "Monte Maiz", latitud: -33.2000, longitud: -62.6000 },
    { razonSocial: "Agrondustria Basilio SRL", localidad: "San Basilio", latitud: -33.5000, longitud: -64.3167 },
    { razonSocial: "Agropecuaria Santa María SA", localidad: "Leones", latitud: -32.6589, longitud: -62.3121 },
    { razonSocial: "Agroprocesadora S.A.", localidad: "Porteña", latitud: -31.0121, longitud: -62.0689 },
    { razonSocial: "Agroservicios Digon SRL", localidad: "Río Primero", latitud: -31.3389, longitud: -63.6312 },
    { razonSocial: "Agroservicios San Francisco S.A.", localidad: "San Francisco", latitud: -31.4289, longitud: -62.1120 },
    { razonSocial: "Aires del Litoral S.A.", localidad: "Jesus María", latitud: -30.9821, longitud: -64.0921 },
    { razonSocial: "Alimentos Carnerillo S.A.", localidad: "Carnerillo", latitud: -32.9167, longitud: -64.0167 },
    { razonSocial: "Alimentos Gran Parque SA", localidad: "B° Arguello Cba.", latitud: -31.3500, longitud: -64.2500 },
    { razonSocial: "Alimentos Josefina SRL", localidad: "San Francisco", latitud: -31.4200, longitud: -62.0900 },
    { razonSocial: "Alimentos Santa Rosa S.A", localidad: "Río Cuarto", latitud: -33.1251, longitud: -64.3491 },
    { razonSocial: "Alimentos Tancacha SA", localidad: "Tancacha", latitud: -32.2412, longitud: -63.9812 },
    { razonSocial: "ALV Las Varas S.A.", localidad: "Las Varas", latitud: -31.8083, longitud: -62.6056 },
    { razonSocial: "Avicola San José", localidad: "Córdoba", latitud: -31.4167, longitud: -64.1833 },
    { razonSocial: "Balini Ariel", localidad: "J. Posse", latitud: -32.8833, longitud: -62.6833 },
    { razonSocial: "Biodiesel Pilar SA", localidad: "Río Segundo", latitud: -31.6421, longitud: -63.8812 },
    { razonSocial: "Biordoñez SAU", localidad: "Gral Ordoñez", latitud: -32.8389, longitud: -62.8667 },
    { razonSocial: "Biosudcor SA", localidad: "Marcos Juarez", latitud: -32.6989, longitud: -62.0951 },
    { razonSocial: "Bormas SA (En formación)", localidad: "La Palestina", latitud: -32.5500, longitud: -63.3000 },
    { razonSocial: "Cabo San Lucas SA", localidad: "Despeñaderos", latitud: -31.8121, longitud: -64.2981 },
    { razonSocial: "Carrilobo", localidad: "Carrilobo", latitud: -31.8833, longitud: -63.1167 },
    { razonSocial: "Casa Ruibal S.A.", localidad: "Pascanas", latitud: -33.1250, longitud: -63.0400 },
    { razonSocial: "Codepro S.R.L.", localidad: "Gral. Cabrera", latitud: -32.8100, longitud: -63.8700 },
    { razonSocial: "Compañía Anglo Córdoba de Tierras SA", localidad: "Villa de María R.S.", latitud: -29.9058, longitud: -63.7258 },
    { razonSocial: "Complejo Industrial La Elisa SA", localidad: "Córdoba", latitud: -31.4000, longitud: -64.1500 },
    { razonSocial: "Coop Agricola Aceitera De Morteros Ltda", localidad: "Morteros", latitud: -30.7189, longitud: -61.9981 },
    { razonSocial: "Coop. Agricola, Ganadera y de Consumo de Freyre Ltda", localidad: "Freyre", latitud: -31.1712, longitud: -62.1021 },
    { razonSocial: "Coop. Ganadera, Agricola y de Consumo Porteña", localidad: "Porteña", latitud: -31.0150, longitud: -62.0650 },
    { razonSocial: "Cooperativa Agrícola Ganadera de Justiniano Posse", localidad: "J. Posse", latitud: -32.8800, longitud: -62.6800 },
    { razonSocial: "Cooperativa Agricultores del Sur Ltda.", localidad: "Jovita", latitud: -34.5070, longitud: -63.9388 },
    { razonSocial: "Deso SRL", localidad: "W. Escalante", latitud: -33.1667, longitud: -62.7667 },
    { razonSocial: "Diez SRL", localidad: "Pampayasta", latitud: -32.3167, longitud: -63.6333 },
    { razonSocial: "Don Oleo SA", localidad: "Chazón", latitud: -33.0833, longitud: -63.2833 },
    { razonSocial: "Dos Agros", localidad: "La Laguna", latitud: -32.8000, longitud: -63.2500 },
    { razonSocial: "Eduardo Lusso SA", localidad: "Monte Ralo", latitud: -31.8833, longitud: -64.2167 },
    { razonSocial: "El Destete S.A.", localidad: "Noetinger", latitud: -32.3667, longitud: -62.3167 },
    { razonSocial: "El Doradillo SA", localidad: "Laboulaye", latitud: -34.1289, longitud: -63.3921 },
    { razonSocial: "El Molino Cba", localidad: "Melo", latitud: -34.3500, longitud: -63.5333 },
    { razonSocial: "Energreen SA", localidad: "Pilar", latitud: -31.6821, longitud: -63.8689 },
    { razonSocial: "Establecimiento Guizzardi", localidad: "Elena", latitud: -32.5712, longitud: -64.3981 },
    { razonSocial: "Exporsoja SA", localidad: "Oliva", latitud: -32.0412, longitud: -63.5789 },
    { razonSocial: "Expsacor S.A.", localidad: "San Ant. Litín", latitud: -32.2167, longitud: -62.6333 },
    { razonSocial: "Extrusar", localidad: "Isla Verde", latitud: -33.2389, longitud: -62.4000 },
    { razonSocial: "Fidelcomiso Sierras Chicas", localidad: "Jesus María", latitud: -30.9800, longitud: -64.0900 },
    { razonSocial: "Gamajo SA", localidad: "Isla Verde", latitud: -33.2300, longitud: -62.3900 },
    { razonSocial: "Geval SA", localidad: "Monte Buey", latitud: -32.9189, longitud: -62.4581 },
    { razonSocial: "Gonzalez Eliana Belen", localidad: "Sampacho", latitud: -33.3833, longitud: -64.7167 },
    { razonSocial: "Grupo Barbisan", localidad: "La Playosa", latitud: -32.1012, longitud: -63.0312 },
    { razonSocial: "Grupo del Centro SRL", localidad: "J. Posse", latitud: -32.8850, longitud: -62.6850 },
    { razonSocial: "GTP SRL", localidad: "Tío Pujio", latitud: -32.2833, longitud: -63.3500 },
    { razonSocial: "HC Nutrición Animal SA", localidad: "Dean Funes", latitud: -30.4203, longitud: -64.3498 },
    { razonSocial: "Industria Alimentarias Pueblo Italiano SRL", localidad: "Pueblo Italiano", latitud: -33.5333, longitud: -62.8333 },
    { razonSocial: "Industrial Longo S.A.", localidad: "Serrano", latitud: -34.4689, longitud: -63.5381 },
    { razonSocial: "Jonfer S.A.", localidad: "Bell Ville", latitud: -32.6189, longitud: -62.6681 },
    { razonSocial: "L y H. Manzotti", localidad: "Cna. Almada", latitud: -32.0167, longitud: -63.8333 },
    { razonSocial: "La Campiña SA", localidad: "La Puerta", latitud: -31.1589, longitud: -63.2612 },
    { razonSocial: "Lapacor SRL", localidad: "La Paquita", latitud: -30.8833, longitud: -62.2000 },
    { razonSocial: "Las 3 Marías S.R.L.", localidad: "Oncativo", latitud: -31.9139, longitud: -63.6817 },
    { razonSocial: "Lorenzo Perlo CIA", localidad: "Gral. Cabrera", latitud: -32.8150, longitud: -63.8750 },
    { razonSocial: "Madagro S.R.L.", localidad: "Marcos Juarez", latitud: -32.6950, longitud: -62.0900 },
    { razonSocial: "Mapric SRL", localidad: "Bialet Massé", latitud: -31.3167, longitud: -64.4667 },
    { razonSocial: "Marcelo Pasini", localidad: "Marcos Juarez", latitud: -32.7000, longitud: -62.1000 },
    { razonSocial: "Marinsalda Hnos. S.R.L", localidad: "Oncativo", latitud: -31.9100, longitud: -63.6800 },
    { razonSocial: "Martina, Leandro Hector", localidad: "Arias", latitud: -33.6421, longitud: -62.4089 },
    { razonSocial: "Meals Soja SA", localidad: "Marul", latitud: -30.9639, longitud: -62.8258 },
    { razonSocial: "Migul SRL", localidad: "Arroyo Cabral", latitud: -32.4908, longitud: -63.4008 },
    { razonSocial: "Mileniun Trade SA", localidad: "Las Acequias", latitud: -33.2833, longitud: -63.9833 },
    { razonSocial: "Molinos Viada", localidad: "Va. del Rosario", latitud: -31.5567, longitud: -63.5350 },
    { razonSocial: "Mol-Prot SA", localidad: "Coronel Moldes", latitud: -33.6212, longitud: -64.5981 },
    { razonSocial: "Molyagro SA", localidad: "Tancacha", latitud: -32.2400, longitud: -63.9800 },
    { razonSocial: "Nueva Acetera Ticino S.A.", localidad: "Ticino", latitud: -32.6933, longitud: -63.4358 },
    { razonSocial: "Nutritegua S.A.", localidad: "A. Gigena", latitud: -32.7533, longitud: -64.3361 },
    { razonSocial: "Oleaginosa Centro Sur SA", localidad: "Viamonte", latitud: -33.7500, longitud: -63.1000 },
    { razonSocial: "Pegoraro Nelva, Bainotti Antonio y Bainotti Fernando SH", localidad: "Sampacho", latitud: -33.3800, longitud: -64.7100 },
    { razonSocial: "Pierucci Cereales S.R.L", localidad: "J. Posse", latitud: -32.8800, longitud: -62.6900 },
    { razonSocial: "Ponedoras Sur S.A.", localidad: "Gral. Cabrera", latitud: -32.8120, longitud: -63.8710 },
    { razonSocial: "Prac SA", localidad: "Río Tercero", latitud: -32.1812, longitud: -64.1451 },
    { razonSocial: "Proleo S.A", localidad: "Leones", latitud: -32.6550, longitud: -62.3100 },
    { razonSocial: "Pronor SA", localidad: "Va. Totoral", latitud: -30.8121, longitud: -63.7289 },
    { razonSocial: "Pronut S.R.L", localidad: "Ticino", latitud: -32.6900, longitud: -63.4300 },
    { razonSocial: "Prosac", localidad: "Río Tercero", latitud: -32.1850, longitud: -64.1400 },
    { razonSocial: "Protecor S.A.", localidad: "Suco", latitud: -33.4500, longitud: -64.8333 },
    { razonSocial: "Ronald Berti", localidad: "Pasco", latitud: -32.7500, longitud: -63.3333 },
    { razonSocial: "Sacoleos S.A.", localidad: "Sacanta", latitud: -31.6612, longitud: -63.0489 },
    { razonSocial: "Sieraas del Río SA", localidad: "Río Ceballos", latitud: -31.1667, longitud: -64.3167 },
    { razonSocial: "Soc. Coop. Tambera Huanchilla Ltda.", localidad: "Huanchilla", latitud: -33.6833, longitud: -63.5833 },
    { razonSocial: "SRS SA", localidad: "La Laguna", latitud: -32.8050, longitud: -63.2550 },
    { razonSocial: "Tecnomills", localidad: "Arias", latitud: -33.6400, longitud: -62.4000 },
    { razonSocial: "Terra Verde Oleos S.A.", localidad: "Gral. Ordoñez", latitud: -32.8350, longitud: -62.8650 },
    { razonSocial: "Trisoil SA", localidad: "Corralito", latitud: -32.0333, longitud: -64.1833 },
    { razonSocial: "Valor A", localidad: "El Tío", latitud: -31.3833, longitud: -62.8333 },
    { razonSocial: "Viotti Victor Martín", localidad: "La Para", latitud: -30.8953, longitud: -62.9992 }
  ];

  for (const item of extrusoras) {
    await prisma.extrusoraSoja.create({ data: item });
  }

  console.log(`✅ ${extrusoras.length} extrusoras de soja sembradas exitosamente.`);
}

main()
  .catch((e) => {
    console.error('❌ Error al ejecutar el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });