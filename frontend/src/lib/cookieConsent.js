import { API_BASE_URL } from './config.js'

export const CONSENT_STORAGE_KEY = 'agc_cookie_consent'
export const VISITOR_STORAGE_KEY = 'agc_visitor_id'

const DEFAULT_CATEGORIES = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
}

export function createVisitorId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

export function getVisitorId() {
  try {
    const stored = localStorage.getItem(VISITOR_STORAGE_KEY)
    if (stored) return stored
  } catch {
    /* ignore */
  }
  const id = createVisitorId()
  try {
    localStorage.setItem(VISITOR_STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
  return id
}

export function readStoredConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function writeStoredConsent(payload) {
  const record = {
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record))
  } catch {
    /* ignore */
  }
  return record
}

export function defaultCategories(overrides = {}) {
  return { ...DEFAULT_CATEGORIES, ...overrides, essential: true }
}

export function detectRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    const euHints = ['Europe/', 'Atlantic/Reykjavik']
    if (euHints.some((h) => tz.startsWith(h))) return 'EU'
  } catch {
    /* ignore */
  }
  return 'ALL'
}

export function requiresExplicitConsent(region, compliance = {}) {
  const gdpr = compliance?.gdpr_regions ?? ['EU', 'EEA', 'UK']
  if (!compliance?.require_consent_before_tracking) return false
  return gdpr.includes(region)
}

export async function fetchCookieConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/privacy/cookie-config`)
    if (!res.ok) throw new Error('config failed')
    const data = await res.json()
    return data.config ?? null
  } catch {
    return null
  }
}

export async function syncConsentToServer({ visitorId, action, categories, region, consentVersion }) {
  try {
    const res = await fetch(`${API_BASE_URL}/privacy/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        visitor_id: visitorId,
        action,
        categories,
        region,
        consent_version: consentVersion,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function categoryAllows(category, consent) {
  if (category === 'essential') return true
  if (!consent?.categories) return false
  return Boolean(consent.categories[category])
}
