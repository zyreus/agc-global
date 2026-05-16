import { ADMIN_TOKEN_STORAGE, API_BASE_URL } from './config.js'

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE) ?? ''
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE)
}

export async function fetchAdminOverview() {
  const token = getAdminToken().trim()
  if (!token) {
    return { ok: false, status: 401, data: null }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/overview`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json().catch(() => ({}))
    return { ok: response.ok, status: response.status, data }
  } catch {
    return { ok: false, status: 0, data: null }
  }
}

export async function adminLogin(identifier, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })
    const data = await response.json().catch(() => ({}))
    return { ok: response.ok, status: response.status, data }
  } catch {
    return { ok: false, status: 0, data: null }
  }
}

/**
 * Authenticated admin API calls. `path` is relative to API_BASE_URL (e.g. `/admin/announcements`).
 */
export async function adminApi(path, init = {}) {
  const token = getAdminToken().trim()
  if (!token) {
    return { ok: false, status: 401, data: null }
  }

  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(init.headers ?? undefined)
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(url, { ...init, headers })
    const data = await response.json().catch(() => ({}))
    return { ok: response.ok, status: response.status, data }
  } catch {
    return { ok: false, status: 0, data: null }
  }
}
