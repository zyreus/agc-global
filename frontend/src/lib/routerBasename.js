/**
 * React Router basename when the app is served under /app/ (XAMPP, Laravel public).
 * Vite preview on :5172 and domain root proxies use basename "/".
 */
export function resolveRouterBasename() {
  if (typeof window === 'undefined') return undefined

  const path = window.location.pathname
  const appMarker = '/app'
  const idx = path.indexOf(appMarker)
  if (idx >= 0) {
    return path.slice(0, idx + appMarker.length)
  }

  return undefined
}
