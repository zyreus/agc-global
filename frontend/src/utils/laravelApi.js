/**
 * Laravel API base resolution for AGC Global.
 */

const STORAGE_KEY = 'agc_laravel_working_api_base'

function isLoopbackHostname(host) {
  if (!host) return true
  const h = String(host).toLowerCase()
  return h === '0.0.0.0' || h === '[::1]'
}

function addBase(bases, b) {
  const s = b === '' || b == null ? '' : String(b).replace(/\/$/, '')
  if (!bases.includes(s)) bases.push(s)
}

/**
 * Ensure absolute bases always end with `/api` for AGC Global routes.
 */
export function normalizeLaravelApiBase(base) {
  if (base === '' || base == null) return ''
  const s = String(base).trim().replace(/\/$/, '')
  if (!s) return ''
  if (!/^https?:\/\//i.test(s)) return s
  if (/\/api$/i.test(s)) return s
  return `${s}/api`
}

function buildUrl(base, path) {
  const p = path.startsWith('/') ? path : `/${path}`
  if (base === '' || base == null) {
    return `/api${p}`
  }
  return `${String(base).replace(/\/$/, '')}${p}`
}

export function laravelApiBases() {
  const bases = []
  const explicit = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')
  const winHost =
    typeof window !== 'undefined' && window.location?.hostname ? String(window.location.hostname) : ''
  const onPublicHost = !isLoopbackHostname(winHost)

  if (explicit) {
    addBase(bases, normalizeLaravelApiBase(explicit))
  }

  // Dev: use explicit if available, otherwise same-origin (assuming proxy is set up)
  if (typeof window !== 'undefined' && import.meta.env.DEV && !explicit) {
    addBase(bases, '')
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved != null) {
        const normalized = normalizeLaravelApiBase(saved)
        addBase(bases, normalized)
      }
    }
  } catch {
    /* ignore */
  }

  // Production, no build-time API URL: same-origin `/api` (Laravel docroot same as SPA) or subdomain URL in .env.production.
  if (typeof window !== 'undefined' && import.meta.env.PROD && onPublicHost && !explicit) {
    addBase(bases, '')
  }

  if (typeof window !== 'undefined' && import.meta.env.PROD && !onPublicHost && !explicit) {
    addBase(bases, '')
    addBase(bases, normalizeLaravelApiBase('http://127.0.0.1:8020'))
  }

  if (bases.length === 0) {
    addBase(bases, '')
  }
  return bases
}

export function rememberWorkingLaravelBase(base) {
  try {
    if (typeof localStorage === 'undefined') return
    const s = base === '' || base == null ? '' : normalizeLaravelApiBase(String(base).replace(/\/$/, ''))
    localStorage.setItem(STORAGE_KEY, s)
  } catch {
    /* ignore */
  }
}

function shouldRetryStatus(status) {
  // Retry other candidate bases on server-side failures and common gateway misses.
  return status === 404 || status >= 500
}

/**
 * Try each Laravel base. Does not hop on 401 (same credentials on all).
 */
export async function laravelRequest(path, init = {}) {
  const bases = laravelApiBases()
  let lastRes = null
  for (const base of bases) {
    const url = buildUrl(base, path)
    try {
      const res = await fetch(url, { cache: 'no-store', ...init })
      lastRes = res
      if (shouldRetryStatus(res.status)) continue
      if (res.ok) rememberWorkingLaravelBase(base)
      return { res, base }
    } catch {
      continue
    }
  }
  return { res: lastRes, base: null }
}