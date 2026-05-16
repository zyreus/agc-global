import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, clearAdminToken } from '../lib/adminPortalApi.js'

const STATUS_OPTIONS = [
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'closed', label: 'Closed' },
]

export default function AdminLeads() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const load = async () => {
    setError('')
    const qs = new URLSearchParams()
    if (statusFilter) qs.set('status', statusFilter)
    const result = await adminApi(`/admin/crm/leads${qs.toString() ? `?${qs}` : ''}`)
    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not load leads.')
      return
    }
    setLeads(result.data?.leads ?? [])
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const setStatus = async (id, status) => {
    await adminApi(`/admin/crm/leads/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await load()
  }

  const archive = async (id, archived) => {
    await adminApi(`/admin/crm/leads/${id}/archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived }),
    })
    await load()
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text">Leads</h1>
          <p className="mt-2 text-sm text-brand-text/70">Representative requests submitted from chat.</p>
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <button type="button" onClick={load} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-text hover:bg-black/5">
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="max-h-[680px] overflow-y-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-brand-text/70">
              <tr>
                <th className="pb-2 pr-2">Session</th>
                <th className="pb-2 pr-2">Name</th>
                <th className="pb-2 pr-2">Email</th>
                <th className="pb-2 pr-2">Concern</th>
                <th className="pb-2 pr-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody className="align-top text-brand-text/85">
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-black/10">
                  <td className="py-2 pr-2 font-mono text-xs">{l.session_id}</td>
                  <td className="py-2 pr-2">{l.name}</td>
                  <td className="py-2 pr-2">{l.email}</td>
                  <td className="py-2 pr-2">{l.concern || '-'}</td>
                  <td className="py-2 pr-2 capitalize">{l.status}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((s) => (
                        <button key={s.id} type="button" onClick={() => setStatus(l.id, s.id)} className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-text hover:bg-black/5">
                          {s.label}
                        </button>
                      ))}
                      <button type="button" onClick={() => archive(l.id, true)} className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-text hover:bg-black/5">
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr className="border-t border-black/10">
                  <td colSpan={6} className="py-3 text-sm text-brand-text/70">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

