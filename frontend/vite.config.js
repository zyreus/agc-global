import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5172,
    proxy: {
      // Same-origin `/api` in dev → AGC Laravel API (port 8201; 8000/8001 often used by other XAMPP projects)
      '/api': {
        target: 'http://127.0.0.1:8201',
        changeOrigin: true,
      },
    },
  },
})
