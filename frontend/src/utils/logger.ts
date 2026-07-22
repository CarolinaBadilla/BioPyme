// frontend/src/utils/logger.ts

const isDev = import.meta.env.DEV;
const enableLogs = import.meta.env.VITE_ENABLE_LOGS === 'true';

export const logger = {
  log: (...args: any[]) => {
    if (isDev && enableLogs) console.log(...args);
  },
  info: (...args: any[]) => {
    if (isDev && enableLogs) console.info('ℹ️', ...args);
  },
  warn: (...args: any[]) => {
    if (isDev && enableLogs) console.warn('⚠️', ...args);
  },
  error: (...args: any[]) => {
    // Siempre mostrar errores, incluso en producción
    console.error('❌', ...args);
  },
  data: (...args: any[]) => {
    if (isDev && enableLogs) console.log('📊', ...args);
  },
};