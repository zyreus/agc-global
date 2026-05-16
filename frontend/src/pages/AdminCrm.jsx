import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminApi, clearAdminToken } from '../lib/adminPortalApi.js'

const STATUS_OPTIONS = [
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'closed', label: 'Closed' },
]

export default function AdminCrm() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [leads, setLeads] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [tickets, setTickets] = useState(() => {
    try {
      const raw = window.localStorage.getItem('agc_admin_tickets')
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [detailLoading, setDetailLoading] = useState(false)
  const [detail, setDetail] = useState(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  const selectedSessionId = useMemo(() => selected?.session_id ?? null, [selected])
  const activeTab = searchParams.get('tab') || 'chats'
  const liveCount = conversations.filter((c) => c.status !== 'closed').length

  const load = async () => {
    setLoading(true)
    setError('')
    const qs = new URLSearchParams()
    if (statusFilter) qs.set('status', statusFilter)
    const result = await adminApi(`/admin/crm/conversations${qs.toString() ? `?${qs}` : ''}`)
    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not load conversations.')
      setLoading(false)
      return
    }
    setConversations(result.data?.conversations ?? [])
    setLoading(false)
  }

  const loadFeedback = async () => {
    const result = await adminApi('/admin/crm/feedback')
    if (!result.ok) return
    setFeedback(result.data?.feedback ?? [])
  }

  const loadLeads = async () => {
    const result = await adminApi('/admin/crm/leads')
    if (!result.ok) return
    setLeads(result.data?.leads ?? [])
  }

  const loadDetail = async (sessionId) => {
    setDetailLoading(true)
    setDetail(null)
    const result = await adminApi(`/admin/crm/conversations/${sessionId}`)
    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not load conversation.')
      setDetailLoading(false)
      return
    }
    setDetail(result.data)
    setDetailLoading(false)
  }

  useEffect(() => {
    load()
    loadFeedback()
    loadLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  useEffect(() => {
    if (!selectedSessionId) return
    loadDetail(selectedSessionId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSessionId])

  useEffect(() => {
    window.localStorage.setItem('agc_admin_tickets', JSON.stringify(tickets))
  }, [tickets])

  const setStatus = async (status) => {
    if (!selectedSessionId) return
    await adminApi(`/admin/crm/conversations/${selectedSessionId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await load()
    await loadDetail(selectedSessionId)
  }

  const setArchive = async (archived) => {
    if (!selectedSessionId) return
    await adminApi(`/admin/crm/conversations/${selectedSessionId}/archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived }),
    })
    setSelected(null)
    setDetail(null)
    await load()
  }

  const deleteConversation = async () => {
    if (!selectedSessionId) return
    await adminApi(`/admin/crm/conversations/${selectedSessionId}`, { method: 'DELETE' })
    setSelected(null)
    setDetail(null)
    await load()
  }

  const createTicket = () => {
    if (!selectedSessionId) return
    if (tickets.some((t) => t.session_id === selectedSessionId)) return
    const latest = detail?.messages?.[detail.messages.length - 1]
    setTickets((prev) => [
      {
        id: crypto?.randomUUID?.() ?? `${Date.now()}`,
        session_id: selectedSessionId,
        summary: latest?.message?.slice(0, 120) || 'Conversation ticket',
        status: detail?.conversation?.status || 'open',
        created_at: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const toggleSelectConversation = (sessionId) => {
    setSelectedIds((prev) => (prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]))
  }

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return
    for (const sessionId of selectedIds) {
      // eslint-disable-next-line no-await-in-loop
      await adminApi(`/admin/crm/conversations/${sessionId}`, { method: 'DELETE' })
    }
    setSelectedIds([])
    setSelected(null)
    setDetail(null)
    await load()
  }

  const sendReply = async (mode) => {
    if (!selectedSessionId) return
    if (mode === 'human' && !reply.trim()) return
    setSending(true)
    const result = await adminApi(`/admin/crm/conversations/${selectedSessionId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, message: reply.trim() || undefined }),
    })
    setSending(false)
    if (!result.ok) {
      setError(result.data?.message || 'Could not send reply.')
      return
    }
    setReply('')
    await loadDetail(selectedSessionId)
    await load()
  }

  return (
    <section className="min-h-[calc(100vh-92px)] overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="grid min-h-[calc(100vh-92px)] grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-r border-black/10 bg-[#f8f9fc] p-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[27px] font-semibold leading-none text-black/90">Chat & CRM</h2>
              <p className="mt-1 text-xs text-black/55">{activeTab === 'chats' ? `${conversations.length} conversations` : `${activeTab}`}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Live</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-[#e9edf5] p-1 text-xs font-semibold">
            {['chats', 'feedback', 'leads', 'analytics', 'tickets'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSearchParams({ tab })}
                className={`rounded-md px-2 py-1 ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-black/65 hover:bg-white/60'}`}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs">
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            {activeTab === 'chats' && (
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelectedIds(conversations.map((c) => c.session_id))} className="flex-1 rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs hover:bg-black/5">
                  Select all
                </button>
                <button type="button" onClick={() => setSelectedIds([])} className="flex-1 rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs hover:bg-black/5">
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 max-h-[67vh] space-y-2 overflow-y-auto pr-1">
            {activeTab === 'chats' &&
              conversations.map((c) => (
                <div key={c.session_id} className={`rounded-lg border p-2 ${selectedSessionId === c.session_id ? 'border-black/50 bg-white' : 'border-black/10 bg-white/70'}`}>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" checked={selectedIds.includes(c.session_id)} onChange={() => toggleSelectConversation(c.session_id)} />
                    <button type="button" onClick={() => setSelected(c)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-semibold text-black/85">Visitor</p>
                      <p className="font-mono text-[11px] text-black/50">{c.session_id.slice(0, 8)}</p>
                      <p className="mt-1 truncate text-[11px] text-black/60">{c.last_message?.message || 'No message yet'}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[10px] text-black/45">{c.last_message_at ? new Date(c.last_message_at).toLocaleString() : '-'}</span>
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold capitalize text-amber-700">{c.status}</span>
                      </div>
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === 'leads' && leads.length === 0 && <p className="text-center text-xs text-black/50">No leads yet</p>}
            {activeTab === 'feedback' && feedback.length === 0 && <p className="text-center text-xs text-black/50">No feedback yet</p>}
            {activeTab === 'tickets' && tickets.length === 0 && <p className="text-center text-xs text-black/50">No tickets</p>}
          </div>
        </aside>

        <main className="bg-[#fbfcff]">
          <div className="border-b border-black/10 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-black/90">{selectedSessionId ? 'Visitor' : 'No conversation selected'}</p>
                <p className="text-xs text-black/50">{selectedSessionId ? selectedSessionId : 'Open a chat from the left list'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs hover:bg-black/5">Mark read</button>
                <button type="button" className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs hover:bg-black/5">Mark unread</button>
                <button type="button" onClick={deleteSelected} className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700 hover:bg-rose-100">Delete selected</button>
                <button type="button" onClick={() => sendReply('ai')} disabled={!selectedSessionId || sending} className="rounded-md border border-brand-primary/30 bg-brand-primary/10 px-2 py-1 text-xs font-semibold text-brand-primary disabled:opacity-50">
                  AI reply
                </button>
                <select onChange={(e) => selectedSessionId && setStatus(e.target.value)} value={detail?.conversation?.status || ''} className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                  <option value="">Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <button type="button" onClick={deleteConversation} disabled={!selectedSessionId} className="rounded-md border border-black/10 bg-white p-1 text-xs disabled:opacity-50">🗑</button>
                <button type="button" onClick={createTicket} disabled={!selectedSessionId} className="rounded-md border border-brand-primary/30 bg-brand-primary/10 px-2 py-1 text-xs text-brand-primary hover:bg-brand-primary/15 disabled:opacity-50">
                  Create ticket
                </button>
              </div>
            </div>
          </div>

          {error && <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          {activeTab === 'chats' && (
            <div className="p-4">
              {!selectedSessionId && <p className="text-center text-sm text-black/45">Select a conversation to start managing messages.</p>}
              {detailLoading && <p className="text-sm text-black/55">Loading conversation…</p>}
              {detail && selectedSessionId && (
                <>
                  <div className="h-[52vh] space-y-2 overflow-y-auto rounded-lg border border-black/10 bg-white p-3">
                    {(detail.messages ?? []).map((m) => (
                      <div key={m.id} className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${m.role === 'user' ? 'ml-auto bg-[#2563eb] text-white' : m.role === 'admin' ? 'border border-emerald-200 bg-emerald-50 text-emerald-900' : 'bg-black/5 text-black/85'}`}>
                        <p className="whitespace-pre-wrap">{m.message}</p>
                        <p className="mt-1 text-right text-[10px] opacity-60">{new Date(m.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <textarea
                      rows={3}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Reply as human..."
                      className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563eb]/30"
                    />
                    <div className="flex w-40 flex-col gap-2">
                      <button type="button" disabled={!reply.trim() || sending} onClick={() => sendReply('human')} className="rounded-lg bg-brand-primary px-3 py-2 text-xs font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-50">
                        Send Human
                      </button>
                      <button type="button" disabled={sending} onClick={() => sendReply('ai')} className="rounded-lg border border-brand-primary/30 bg-brand-primary/10 px-3 py-2 text-xs text-brand-primary hover:bg-brand-primary/15 disabled:opacity-50">
                        Reply AI
                      </button>
                      <button type="button" onClick={() => setArchive(true)} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs hover:bg-black/5">
                        Archive
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-black/85">Customer Feedback</h3>
              <div className="mt-2 overflow-hidden rounded-lg border border-black/10 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/[0.02] text-black/60"><tr><th className="px-3 py-2">Conversation</th><th className="px-3 py-2">Rating</th><th className="px-3 py-2">Comment</th><th className="px-3 py-2">Created</th></tr></thead>
                  <tbody>{feedback.map((f) => <tr key={f.id} className="border-t border-black/10"><td className="px-3 py-2 font-mono text-xs">{f.conversation_id}</td><td className="px-3 py-2">{f.rating}/5</td><td className="px-3 py-2">{f.comment}</td><td className="px-3 py-2 text-xs">{new Date(f.created_at).toLocaleString()}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-black/85">CRM - Leads</h3>
              <div className="mt-2 overflow-hidden rounded-lg border border-black/10 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/[0.02] text-black/60"><tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Inquiry</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Created</th></tr></thead>
                  <tbody>{leads.map((l) => <tr key={l.id} className="border-t border-black/10"><td className="px-3 py-2">{l.name}</td><td className="px-3 py-2">{l.email}</td><td className="px-3 py-2">{l.concern || '-'}</td><td className="px-3 py-2 capitalize">{l.status}</td><td className="px-3 py-2 text-xs">{new Date(l.created_at).toLocaleString()}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              <div className="rounded-lg border border-black/10 bg-white p-4"><p className="text-xs text-black/55">Open chats</p><p className="mt-1 text-3xl font-semibold">{liveCount}</p></div>
              <div className="rounded-lg border border-black/10 bg-white p-4"><p className="text-xs text-black/55">Leads</p><p className="mt-1 text-3xl font-semibold">{leads.length}</p></div>
              <div className="rounded-lg border border-black/10 bg-white p-4"><p className="text-xs text-black/55">Feedback</p><p className="mt-1 text-3xl font-semibold">{feedback.length}</p></div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-black/85">Support Tickets</h3>
              <div className="mt-2 overflow-hidden rounded-lg border border-black/10 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/[0.02] text-black/60"><tr><th className="px-3 py-2">Session</th><th className="px-3 py-2">Summary</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Created</th></tr></thead>
                  <tbody>{tickets.map((t) => <tr key={t.id} className="border-t border-black/10"><td className="px-3 py-2 font-mono text-xs">{t.session_id}</td><td className="px-3 py-2">{t.summary}</td><td className="px-3 py-2 capitalize">{t.status}</td><td className="px-3 py-2 text-xs">{new Date(t.created_at).toLocaleString()}</td></tr>)}</tbody>
                </table>
                {tickets.length === 0 && <p className="px-3 py-5 text-center text-sm text-black/45">No tickets. Create one from a conversation.</p>}
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  )
}

