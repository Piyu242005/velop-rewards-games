import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages needs the repository subpath; Vercel/Netlify/local builds use '/'.
const isGitHubPages = process.env.VITE_DEPLOY_TARGET === 'github-pages'
const base = process.env.VITE_BASE_PATH ?? (isGitHubPages ? '/velop-rewards-games/' : '/')

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
