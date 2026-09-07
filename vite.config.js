import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use the GitHub Pages subpath only when explicitly requested.
// Vercel/Netlify and local builds default to root ('/').
const base = process.env.VITE_BASE_PATH ?? '/'

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
