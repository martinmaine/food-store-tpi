import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    // three.js ya se separa en su propio chunk (import dinámico); se sube el umbral del aviso.
    chunkSizeWarningLimit: 800,
  },
})
