import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Requests to /api are forwarded to the Spring Boot backend, so the browser never hits CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
