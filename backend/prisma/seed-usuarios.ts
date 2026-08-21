import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function main() {
  const email = process.env.ADMIN_EMAIL;
  const rawPassword = process.env.ADMIN_PASSWORD;

  // Si no están configuradas las variables en el VPS, se saltea la creación del usuario
  if (!email || !rawPassword) {
    console.log('⚠️ Variables ADMIN_EMAIL o ADMIN_PASSWORD no definidas. Salteando seed de usuario admin.');
    return;
  }

  console.log(`🌱 Sembrando/Actualizando usuario administrador (${email})...`);
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'ADMIN' },
    create: {
      email,
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuario administrador configurado.');
}