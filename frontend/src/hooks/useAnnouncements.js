import { useEffect, useState } from 'react'
import { fetchPublicApi } from '../lib/publicApi.js'

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchPublicApi('/announcements')
        if (!cancelled) setAnnouncements(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { announcements, loading, error }
}
