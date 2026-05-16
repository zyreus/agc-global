import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, clearAdminToken } from '../lib/adminPortalApi.js'

const EMPTY_FORM = { title: '', content: '', is_published: true }

export default function AdminAnnouncements() {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const result = await adminApi('/admin/announcements')
    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not load announcements.')
      setLoading(false)
      return
    }
    setAnnouncements(result.data?.announcements ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      is_published: form.is_published,
    }
    if (!payload.title || !payload.content) return

    const result = editingId
      ? await adminApi(`/admin/announcements/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await adminApi('/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError(result.data?.message || 'Could not save announcement.')
      return
    }

    setForm(EMPTY_FORM)
    setEditingId(null)
    await load()
  }

  const edit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title ?? '',
      content: item.content ?? '',
      is_published: Boolean(item.is_published),
    })
  }

  const remove = async (id) => {
    const result = await adminApi(`/admin/announcements/${id}`, { method: 'DELETE' })
    if (!result.ok) {
      if (result.status === 401) {
        clearAdminToken()
        navigate('/admin', { replace: true })
        return
      }
      setError('Could not delete announcement.')
      return
    }
    await load()
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text">Announcements</h1>
          <p className="mt-2 text-sm text-brand-text/70">Create and manage website announcements.</p>
        </div>
        <button type="button" onClick={load} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-text hover:bg-black/5">
          Refresh
        </button>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-sm font-semibold text-brand-text">{editingId ? 'Edit announcement' : 'Create announcement'}</p>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Announcement title"
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none ring-brand-primary focus:ring-2"
            />
            <textarea
              rows={5}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Announcement content"
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none ring-brand-primary focus:ring-2"
            />
            <label className="inline-flex items-center gap-2 text-sm text-brand-text/80">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              />
              Published
            </label>
            <div className="flex gap-2">
              <button type="submit" className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover">
                {editingId ? 'Save changes' : 'Publish announcement'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setForm(EMPTY_FORM)
                  }}
                  className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-text hover:bg-black/5"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-sm font-semibold text-brand-text">Saved announcements</p>
          <div className="mt-4 space-y-3">
            {!loading && announcements.length === 0 && <p className="text-sm text-brand-text/70">No announcements found.</p>}
            {announcements.map((item) => (
              <article key={item.id} className="rounded-xl border border-black/10 bg-brand-background-alt p-3">
                <p className="text-sm font-semibold text-brand-text">{item.title}</p>
                <p className="mt-1 text-sm text-brand-text/75">{item.content}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => edit(item)} className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-text hover:bg-black/5">Edit</button>
                  <button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

