import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminOverview } from '../lib/adminPortalApi.js'

export default function AdminMessages() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState([])

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
      setError('Could not load chat messages.')
      setLoading(false)
      return
    }

    setMessages(result.data?.recent_messages ?? [])
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
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text">Chat Messages</h1>
          <p className="mt-2 text-sm text-brand-text/70">Recent user and assistant messages from the AI chat widget.</p>
        </div>
        <button type="button" onClick={load} disabled={loading} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-text hover:bg-black/5 disabled:opacity-60">
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>}

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="table-scroll max-h-[min(620px,70dvh)] overflow-y-auto">
          <table className="w-full min-w-[740px] text-left text-sm">
            <thead className="text-brand-text/70">
              <tr>
                <th className="pb-2 pr-2">Session</th>
                <th className="pb-2 pr-2">Role</th>
                <th className="pb-2 pr-2">Message</th>
                <th className="pb-2">Time</th>
              </tr>
            </thead>
            <tbody className="align-top text-brand-text/85">
              {messages.map((entry) => (
                <tr key={entry.id} className="border-t border-black/10">
                  <td className="py-2 pr-2 font-mono text-xs">{entry.session_id}</td>
                  <td className="py-2 pr-2 capitalize">{entry.role}</td>
                  <td className="py-2 pr-2">{entry.message}</td>
                  <td className="py-2">{new Date(entry.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {!loading && messages.length === 0 && (
                <tr className="border-t border-black/10">
                  <td className="py-3 text-sm text-brand-text/70" colSpan={4}>No chat messages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
