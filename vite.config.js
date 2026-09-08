import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { googleApiMiddleware } from './server/google/vitePlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    googleApiMiddleware(),
  ],
})
