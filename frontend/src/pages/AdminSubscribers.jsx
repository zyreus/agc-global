import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, clearAdminToken } from '../lib/adminPortalApi.js'

export default function AdminSubscribers() {
  const navigate = useNavigate()
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    const result = await adminApi('/admin/newsletter/subscribers')
    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not load subscribers.')
      setLoading(false)
      return
    }
    setSubscribers(result.data?.subscribers ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const remove = async (id) => {
    const result = await adminApi(`/admin/newsletter/subscribers/${id}`, { method: 'DELETE' })
    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not delete subscriber.')
      return
    }
    await load()
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text">Newsletter Subscribers</h1>
          <p className="mt-2 text-sm text-brand-text/70">View and manage newsletter subscribers.</p>
        </div>
        <button type="button" onClick={load} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-text hover:bg-black/5">
          Refresh
        </button>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="max-h-[620px] overflow-y-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-brand-text/70">
              <tr>
                <th className="pb-2 pr-2">Name</th>
                <th className="pb-2 pr-2">Email</th>
                <th className="pb-2 pr-2">Subscribed at</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody className="align-top text-brand-text/85">
              {subscribers.map((item) => (
                <tr key={item.id} className="border-t border-black/10">
                  <td className="py-2 pr-2">{item.name || '-'}</td>
                  <td className="py-2 pr-2">{item.email}</td>
                  <td className="py-2 pr-2">{item.subscribed_at ? new Date(item.subscribed_at).toLocaleString() : '-'}</td>
                  <td className="py-2">
                    <button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && subscribers.length === 0 && (
                <tr className="border-t border-black/10">
                  <td colSpan={4} className="py-3 text-sm text-brand-text/70">No subscribers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

