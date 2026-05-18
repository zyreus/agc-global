import { normalizeLaravelApiBase } from '../utils/laravelApi.js'

// In dev, default to same-origin `/api` so Vite can proxy to Laravel (see vite.config.js).
// In production on a public hostname, default to same-origin `/api` (reverse proxy to Laravel).
// Set VITE_API_BASE_URL when the API is on another origin (e.g. https://api.example.com).
function resolveApiBaseUrl() {
  const raw = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
  if (raw) return normalizeLaravelApiBase(raw.replace(/\/$/, ''))

  if (import.meta.env.DEV) return '/api'

  if (typeof window !== 'undefined') {
    const host = String(window.location?.hostname ?? '').toLowerCase()
    const loopback =
      !host ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]' ||
      host === '0.0.0.0'
    if (!loopback) return '/api'
  }

  return 'http://127.0.0.1:8201/api'
}

export const API_BASE_URL = resolveApiBaseUrl()

export const ADMIN_KEY_STORAGE = 'agc_admin_key'
export const ADMIN_TOKEN_STORAGE = 'agc_admin_token'
