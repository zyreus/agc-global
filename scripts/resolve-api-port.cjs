/**
 * Shared Laravel API port for local dev (Vite proxy, artisan serve, PM2).
 * Override with AGC_API_PORT. Default 8201 — 8000/8010 are often in use on Windows.
 */
function resolveApiPort() {
  const raw = String(process.env.AGC_API_PORT || '8201').trim()
  const n = parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1 || n > 65535) return 8201
  return n
}

module.exports = { resolveApiPort }
