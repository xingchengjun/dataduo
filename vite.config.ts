import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/dataduo/',
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: [],
  },
  build: {
    target: 'esnext',
  },
  worker: {
    format: 'es',
  },
})
