import bcrypt from 'bcryptjs';

// Obtener el hash desde .env
const passwordHash = import.meta.env.VITE_DASHBOARD_PASSWORD_HASH || '';

// LOGS DE DEPURACIÓN (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔍 VITE_DASHBOARD_PASSWORD_HASH:', passwordHash ? '✅ Definido' : '❌ No definido');
  console.log('🔍 Longitud del hash:', passwordHash.length);
}

// passwordHash.ts - VERSIÓN CON FALLBACK
export const verifyPassword = (input: string): boolean => {
  // FALLBACK: comparación directa (temporal)
  const realPassword = 'Plantas$Biopyme#';
  return input === realPassword;
};