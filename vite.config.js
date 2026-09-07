import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from /velop-rewards-games/ — set base accordingly.
// For a custom domain or Vercel/Netlify, change base back to '/'.
const base = process.env.VITE_BASE_PATH ?? '/velop-rewards-games/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
