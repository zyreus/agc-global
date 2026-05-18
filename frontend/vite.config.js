import { createRequire } from 'module'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const { resolveApiPort } = require('../scripts/resolve-api-port.cjs')
const apiPort = String(resolveApiPort())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const apiProxy = {
  '/api': {
    target: `http://127.0.0.1:${apiPort}`,
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs so the build works under /app/ (XAMPP) and Vite preview.
  base: './',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react-router-dom'],
  },
  build: {
    outDir: path.resolve(__dirname, '../backend/public/app'),
    emptyOutDir: true,
  },
  server: {
    port: 5172,
    host: '0.0.0.0',
    allowedHosts: ['agctek.co', 'www.agctek.co', 'localhost', '127.0.0.1'],
    proxy: apiProxy,
    hmr: process.env.AGC_VITE_HMR_HOST
      ? {
          host: process.env.AGC_VITE_HMR_HOST,
          protocol: process.env.AGC_VITE_HMR_PROTOCOL || 'wss',
          clientPort: Number(process.env.AGC_VITE_HMR_CLIENT_PORT || 443),
        }
      : undefined,
  },
  preview: {
    port: 5172,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['agctek.co', 'www.agctek.co', 'localhost', '127.0.0.1'],
    proxy: apiProxy,
  },
})

