import { PrismaClient } from '@prisma/client';

// Importás el código de los otros seeds (asegurate de que exporten su función main)
import { main as seedAgro } from './seed-agroservicios';
import { main as seedYpf } from './seed-ypf';
import { main as seedLocalidades } from './seed-localidades';
import { main as seedConsorcios } from './seed-consorcios';
import { main as seedExtrusoras } from './seed-extrusoras';
import { main as seedBlancas } from './seed-estaciones-blancas';
import { main as seedGeneral } from './seed';
import { main as updateDepartamentos } from './update-departamentos';
import { main as seedGeo } from './seed-geo';
import { main as seedUsuarios } from './seed-usuarios';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando carga masiva de seeds...');

  await seedAgro();
  await seedYpf();
  await seedLocalidades();
  await seedConsorcios();
  await seedExtrusoras();
  await seedBlancas();
  await seedGeneral();
  await updateDepartamentos();
  await seedGeo();
  await seedUsuarios();

  console.log('🎉 ¡Todos los seeds fueron cargados exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });