// In dev, default to same-origin `/api` so Vite can proxy to Laravel (see vite.config.js).
// Set VITE_API_BASE_URL when the API lives elsewhere (e.g. production).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '/api' : 'http://127.0.0.1:8000/api')

export const ADMIN_KEY_STORAGE = 'agc_admin_key'
export const ADMIN_TOKEN_STORAGE = 'agc_admin_token'
