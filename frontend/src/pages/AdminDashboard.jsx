import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_KEY_STORAGE, API_BASE_URL } from '../lib/config.js'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const adminKey = useMemo(() => window.localStorage.getItem(ADMIN_KEY_STORAGE) ?? '', [])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const logout = () => {
    window.localStorage.removeItem(ADMIN_KEY_STORAGE)
    navigate('/admin', { replace: true })
  }

  const load = async () => {
    if (!adminKey) {
      navigate('/admin', { replace: true })
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/admin/overview`, {
        method: 'GET',
        headers: { 'X-Admin-Key': adminKey },
      })

      if (!response.ok) {
        if (response.status === 401) logout()
        throw new Error('Could not load admin overview.')
      }

      const result = await response.json()
      setData(result)
    } catch (e) {
      setData(null)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="flex-1 bg-brand-background-alt">
      <section className="app-container py-12 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">Dashboard</h1>
            <p className="mt-2 text-sm text-brand-text/70">Chatbot analytics and recent messages.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-text/60">Total messages</p>
            <p className="mt-2 text-2xl font-semibold text-brand-text">{data?.stats?.total_messages ?? 0}</p>
          </article>
          <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-text/60">Total sessions</p>
            <p className="mt-2 text-2xl font-semibold text-brand-text">{data?.stats?.total_sessions ?? 0}</p>
          </article>
          <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-text/60">Messages today</p>
            <p className="mt-2 text-2xl font-semibold text-brand-text">{data?.stats?.messages_today ?? 0}</p>
          </article>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-sm font-semibold text-brand-text">Recent chat messages</p>
          <div className="table-scroll mt-4 max-h-[min(520px,65dvh)] overflow-y-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-brand-text/70">
                <tr>
                  <th className="pb-2 pr-2">Session</th>
                  <th className="pb-2 pr-2">Role</th>
                  <th className="pb-2 pr-2">Message</th>
                  <th className="pb-2">Time</th>
                </tr>
              </thead>
              <tbody className="align-top text-brand-text/85">
                {(data?.recent_messages ?? []).map((entry) => (
                  <tr key={entry.id} className="border-t border-black/10">
                    <td className="py-2 pr-2 font-mono text-xs">{entry.session_id}</td>
                    <td className="py-2 pr-2 capitalize">{entry.role}</td>
                    <td className="py-2 pr-2">{entry.message}</td>
                    <td className="py-2">{new Date(entry.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {!loading && (data?.recent_messages ?? []).length === 0 && (
                  <tr className="border-t border-black/10">
                    <td className="py-3 text-sm text-brand-text/70" colSpan={4}>
                      No chat messages yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}

