import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Para saber si estamos en producción
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    minify: 'esbuild',
  },
  esbuild: {
    drop: isProd ? ['console', 'debugger'] : [],
  },
})