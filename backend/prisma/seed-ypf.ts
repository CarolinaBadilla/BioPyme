import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando estaciones YPF...');

  const stations = [
    { nombre: "YPF - Fray Mamerto Esquiú", direccion: "Fray Mamerto Esquiú 615", telefono: "351 422-2112", latitud: -31.4167, longitud: -64.1833 },
    { nombre: "YPF ACA Córdoba Centro", direccion: "Gral. Paz 499", telefono: "351 423-5134", latitud: -31.42, longitud: -64.188 },
    { nombre: "YPF - Duarte Quirós 165", direccion: "Duarte Quirós 165", telefono: "0800-122-2973", latitud: -31.415, longitud: -64.19 },
    { nombre: "YPF - Duarte Quirós 3607", direccion: "Duarte Quirós 3607", telefono: "", latitud: -31.41, longitud: -64.195 },
    { nombre: "YPF - Av. Octavio Pinto y Av. Caraffa", direccion: "Av. Octavio Pinto y Av. Caraffa", telefono: "351 879-3736", latitud: -31.38, longitud: -64.2 },
    { nombre: "YPF - Dr. Arturo Capdevila 3618", direccion: "Dr. Arturo Capdevila 3618 esq. Circunvalación", telefono: "351 496-2700", latitud: -31.44, longitud: -64.17 },
    { nombre: "YPF Bornoroni Hnos.", direccion: "Av. Pueyrredón 2316", telefono: "351 488-1779", latitud: -31.4, longitud: -64.205 },
    { nombre: "YPF - Gral. José Artigas 987", direccion: "Gral. José Artigas 987", telefono: "351 745-2000", latitud: -31.395, longitud: -64.21 },
    { nombre: "YPF ACA - Av. Amadeo Sabattini 449", direccion: "Av. Amadeo Sabattini 449", telefono: "351 874-9472", latitud: -31.43, longitud: -64.175 },
    { nombre: "YPF Madrid y Los Matacos", direccion: "Madrid y Los Matacos", telefono: "351 455-6235", latitud: -31.39, longitud: -64.215 },
    { nombre: "YPF Maipú", direccion: "Av. Amadeo Sabattini 2014", telefono: "351 441-9046", latitud: -31.44, longitud: -64.17 },
    { nombre: "YPF - Av. Ciudad de Valparaíso 2812", direccion: "Av. Ciudad de Valparaíso 2812", telefono: "351 893-3343", latitud: -31.38, longitud: -64.22 },
  ];

  for (const station of stations) {
    await prisma.ypfStation.create({
      data: station
    });
  }
  console.log(`✅ ${stations.length} estaciones YPF creadas`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());