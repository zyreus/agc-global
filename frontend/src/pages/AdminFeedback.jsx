import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, clearAdminToken } from '../lib/adminPortalApi.js'

export default function AdminFeedback() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    const result = await adminApi('/admin/crm/feedback')
    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not load feedback.')
      return
    }
    setItems(result.data?.feedback ?? [])
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text">Feedback</h1>
          <p className="mt-2 text-sm text-brand-text/70">Customer feedback submitted from the chat widget.</p>
        </div>
        <button type="button" onClick={load} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-text hover:bg-black/5">
          Refresh
        </button>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="table-scroll max-h-[min(700px,70dvh)] overflow-y-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="text-brand-text/70">
              <tr>
                <th className="pb-2 pr-2">Conversation</th>
                <th className="pb-2 pr-2">Rating</th>
                <th className="pb-2 pr-2">Name</th>
                <th className="pb-2 pr-2">Email</th>
                <th className="pb-2 pr-2">Comment</th>
                <th className="pb-2">Time</th>
              </tr>
            </thead>
            <tbody className="align-top text-brand-text/85">
              {items.map((f) => (
                <tr key={f.id} className="border-t border-black/10">
                  <td className="py-2 pr-2 font-mono text-xs">{f.conversation_id}</td>
                  <td className="py-2 pr-2">{f.rating}/5</td>
                  <td className="py-2 pr-2">{f.name}</td>
                  <td className="py-2 pr-2">{f.email}</td>
                  <td className="py-2 pr-2">{f.comment}</td>
                  <td className="py-2">{new Date(f.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr className="border-t border-black/10">
                  <td colSpan={6} className="py-3 text-sm text-brand-text/70">No feedback yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

