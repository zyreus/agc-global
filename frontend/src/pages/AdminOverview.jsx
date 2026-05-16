import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminOverview } from '../lib/adminPortalApi.js'

export default function AdminOverview() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    const result = await fetchAdminOverview()

    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not load admin overview.')
      setLoading(false)
      return
    }

    setData(result.data ?? null)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">AGC Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text">Dashboard</h1>
          <p className="mt-2 text-sm text-brand-text/70">Overview of customer chat activity from Chat & CRM.</p>
        </div>
        <button type="button" onClick={load} disabled={loading} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-text hover:bg-black/5 disabled:opacity-60">
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-text/60">Customer messages</p>
          <p className="mt-2 text-3xl font-semibold text-brand-text">{data?.stats?.total_messages ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-text/60">Total sessions</p>
          <p className="mt-2 text-3xl font-semibold text-brand-text">{data?.stats?.total_sessions ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-text/60">Customer messages today</p>
          <p className="mt-2 text-3xl font-semibold text-brand-text">{data?.stats?.messages_today ?? 0}</p>
        </article>
      </div>
    </section>
  )
}
