import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Actualizando departamentos con datos demográficos...');

  const datos = [
    { nombre: "Capital", totalViviendas: 613263, viviendasColectivas: 284, viviendasParticulares: 612979, viviendasParticularesMoradores: 545786, hogares: 553470, poblacionTotal: 1505250, poblacionViviendasParticulares: 1498060, poblacionViviendasColectivas: 7090, poblacionCalle: 100, mujeres: 789418, varones: 715832 },
    { nombre: "Colón", totalViviendas: 107390, viviendasColectivas: 97, viviendasParticulares: 107293, viviendasParticularesMoradores: 96466, hogares: 97732, poblacionTotal: 295725, poblacionViviendasParticulares: 294511, poblacionViviendasColectivas: 1213, poblacionCalle: 1, mujeres: 151660, varones: 144065 },
    { nombre: "Calamuchita", totalViviendas: 44179, viviendasColectivas: 79, viviendasParticulares: 44100, viviendasParticularesMoradores: 27872, hogares: 28298, poblacionTotal: 75911, poblacionViviendasParticulares: 75462, poblacionViviendasColectivas: 449, poblacionCalle: 0, mujeres: 38395, varones: 37516 },
    { nombre: "Cruz del Eje", totalViviendas: 24366, viviendasColectivas: 42, viviendasParticulares: 24324, viviendasParticularesMoradores: 21155, hogares: 21425, poblacionTotal: 67112, poblacionViviendasParticulares: 64748, poblacionViviendasColectivas: 2364, poblacionCalle: 0, mujeres: 33487, varones: 33625 },
    { nombre: "General Roca", totalViviendas: 15965, viviendasColectivas: 21, viviendasParticulares: 15944, viviendasParticularesMoradores: 13506, hogares: 13556, poblacionTotal: 36242, poblacionViviendasParticulares: 36064, poblacionViviendasColectivas: 178, poblacionCalle: 0, mujeres: 18024, varones: 18218 },
    { nombre: "General San Martín", totalViviendas: 68017, viviendasColectivas: 49, viviendasParticulares: 67968, viviendasParticularesMoradores: 57410, hogares: 57886, poblacionTotal: 154269, poblacionViviendasParticulares: 152397, poblacionViviendasColectivas: 1867, poblacionCalle: 5, mujeres: 79053, varones: 75216 },
    { nombre: "Ischilín", totalViviendas: 14213, viviendasColectivas: 7, viviendasParticulares: 14206, viviendasParticularesMoradores: 11466, hogares: 11660, poblacionTotal: 36074, poblacionViviendasParticulares: 36023, poblacionViviendasColectivas: 51, poblacionCalle: 0, mujeres: 18592, varones: 17482 },
    { nombre: "Juárez Celman", totalViviendas: 28023, viviendasColectivas: 38, viviendasParticulares: 27985, viviendasParticularesMoradores: 24836, hogares: 24974, poblacionTotal: 68631, poblacionViviendasParticulares: 68317, poblacionViviendasColectivas: 314, poblacionCalle: 0, mujeres: 34743, varones: 33888 },
    { nombre: "Marcos Juárez", totalViviendas: 49366, viviendasColectivas: 45, viviendasParticulares: 49321, viviendasParticularesMoradores: 41670, hogares: 41894, poblacionTotal: 107764, poblacionViviendasParticulares: 107286, poblacionViviendasColectivas: 478, poblacionCalle: 0, mujeres: 55282, varones: 52482 },
    { nombre: "Minas", totalViviendas: 2536, viviendasColectivas: 1, viviendasParticulares: 2535, viviendasParticularesMoradores: 1797, hogares: 1815, poblacionTotal: 4870, poblacionViviendasParticulares: 4855, poblacionViviendasColectivas: 15, poblacionCalle: 0, mujeres: 2397, varones: 2473 },
    { nombre: "Pocho", totalViviendas: 2798, viviendasColectivas: 11, viviendasParticulares: 2787, viviendasParticularesMoradores: 1876, hogares: 1911, poblacionTotal: 5123, poblacionViviendasParticulares: 5070, poblacionViviendasColectivas: 53, poblacionCalle: 0, mujeres: 2535, varones: 2588 },
    { nombre: "Presidente Roque Sáenz Peña", totalViviendas: 16480, viviendasColectivas: 22, viviendasParticulares: 16458, viviendasParticularesMoradores: 14091, hogares: 14169, poblacionTotal: 37726, poblacionViviendasParticulares: 37551, poblacionViviendasColectivas: 175, poblacionCalle: 0, mujeres: 19057, varones: 18669 },
    { nombre: "Punilla", totalViviendas: 107485, viviendasColectivas: 190, viviendasParticulares: 107295, viviendasParticularesMoradores: 81727, hogares: 82780, poblacionTotal: 221273, poblacionViviendasParticulares: 219494, poblacionViviendasColectivas: 1779, poblacionCalle: 0, mujeres: 115640, varones: 105633 },
    { nombre: "Río Cuarto", totalViviendas: 126096, viviendasColectivas: 113, viviendasParticulares: 125983, viviendasParticularesMoradores: 105039, hogares: 105896, poblacionTotal: 279923, poblacionViviendasParticulares: 277979, poblacionViviendasColectivas: 1918, poblacionCalle: 26, mujeres: 145041, varones: 134882 },
    { nombre: "Río Primero", totalViviendas: 22293, viviendasColectivas: 17, viviendasParticulares: 22276, viviendasParticularesMoradores: 19053, hogares: 19338, poblacionTotal: 58428, poblacionViviendasParticulares: 58181, poblacionViviendasColectivas: 247, poblacionCalle: 0, mujeres: 29513, varones: 28915 },
    { nombre: "Río Seco", totalViviendas: 6492, viviendasColectivas: 7, viviendasParticulares: 6485, viviendasParticularesMoradores: 5073, hogares: 5150, poblacionTotal: 15302, poblacionViviendasParticulares: 15275, poblacionViviendasColectivas: 27, poblacionCalle: 0, mujeres: 7644, varones: 7658 },
    { nombre: "Río Segundo", totalViviendas: 45261, viviendasColectivas: 52, viviendasParticulares: 45209, viviendasParticularesMoradores: 40144, hogares: 40511, poblacionTotal: 113950, poblacionViviendasParticulares: 113311, poblacionViviendasColectivas: 639, poblacionCalle: 0, mujeres: 58723, varones: 55227 },
    { nombre: "San Alberto", totalViviendas: 19353, viviendasColectivas: 28, viviendasParticulares: 19325, viviendasParticularesMoradores: 14419, hogares: 14665, poblacionTotal: 42166, poblacionViviendasParticulares: 42029, poblacionViviendasColectivas: 137, poblacionCalle: 0, mujeres: 21584, varones: 20582 },
    { nombre: "San Javier", totalViviendas: 29004, viviendasColectivas: 37, viviendasParticulares: 28967, viviendasParticularesMoradores: 22577, hogares: 22830, poblacionTotal: 63377, poblacionViviendasParticulares: 62700, poblacionViviendasColectivas: 677, poblacionCalle: 0, mujeres: 32845, varones: 30532 },
    { nombre: "San Justo", totalViviendas: 96754, viviendasColectivas: 100, viviendasParticulares: 96654, viviendasParticularesMoradores: 84866, hogares: 85574, poblacionTotal: 230339, poblacionViviendasParticulares: 228951, poblacionViviendasColectivas: 1384, poblacionCalle: 4, mujeres: 117730, varones: 112609 },
    { nombre: "Santa María", totalViviendas: 58851, viviendasColectivas: 55, viviendasParticulares: 58796, viviendasParticularesMoradores: 46153, hogares: 46836, poblacionTotal: 144829, poblacionViviendasParticulares: 139012, poblacionViviendasColectivas: 5817, poblacionCalle: 0, mujeres: 71863, varones: 72966 },
    { nombre: "Sobremonte", totalViviendas: 1989, viviendasColectivas: 1, viviendasParticulares: 1988, viviendasParticularesMoradores: 1497, hogares: 1515, poblacionTotal: 4503, poblacionViviendasParticulares: 4381, poblacionViviendasColectivas: 122, poblacionCalle: 0, mujeres: 2248, varones: 2255 },
    { nombre: "Tercero Arriba", totalViviendas: 51336, viviendasColectivas: 54, viviendasParticulares: 51282, viviendasParticularesMoradores: 44901, hogares: 45250, poblacionTotal: 120918, poblacionViviendasParticulares: 120207, poblacionViviendasColectivas: 711, poblacionCalle: 0, mujeres: 62495, varones: 58423 },
    { nombre: "Totoral", totalViviendas: 9071, viviendasColectivas: 5, viviendasParticulares: 9066, viviendasParticularesMoradores: 7448, hogares: 7531, poblacionTotal: 22495, poblacionViviendasParticulares: 22473, poblacionViviendasColectivas: 22, poblacionCalle: 0, mujeres: 11294, varones: 11201 },
    { nombre: "Tulumba", totalViviendas: 7055, viviendasColectivas: 6, viviendasParticulares: 7049, viviendasParticularesMoradores: 5100, hogares: 5147, poblacionTotal: 14134, poblacionViviendasParticulares: 14092, poblacionViviendasColectivas: 42, poblacionCalle: 0, mujeres: 7082, varones: 7052 },
    { nombre: "Unión", totalViviendas: 48481, viviendasColectivas: 62, viviendasParticulares: 48419, viviendasParticularesMoradores: 42309, hogares: 42587, poblacionTotal: 114571, poblacionViviendasParticulares: 113635, poblacionViviendasColectivas: 936, poblacionCalle: 0, mujeres: 58165, varones: 56406 },
  ];

  for (const d of datos) {
    await prisma.department.updateMany({
      where: { name: d.nombre },
      data: {
        totalViviendas: d.totalViviendas,
        viviendasColectivas: d.viviendasColectivas,
        viviendasParticulares: d.viviendasParticulares,
        viviendasParticularesMoradores: d.viviendasParticularesMoradores,
        hogares: d.hogares,
        poblacionTotal: d.poblacionTotal,
        poblacionViviendasParticulares: d.poblacionViviendasParticulares,
        poblacionViviendasColectivas: d.poblacionViviendasColectivas,
        poblacionCalle: d.poblacionCalle,
        mujeres: d.mujeres,
        varones: d.varones,
      },
    });
  }
  console.log(`✅ ${datos.length} departamentos actualizados con datos demográficos`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());