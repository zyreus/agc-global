import { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../lib/adminPortalApi.js'

function formatBytes(n) {
  if (!n) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let v = n
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i += 1
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export default function AdminPerformance() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [cookieSettings, setCookieSettings] = useState(null)
  const [bannerForm, setBannerForm] = useState({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')
  const [logs, setLogs] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await adminApi('/admin/performance')
    if (res.ok) {
      setMetrics(res.data.metrics)
      setCookieSettings(res.data.cookie_settings)
      setBannerForm(res.data.cookie_settings?.banner ?? {})
    }
    setLoading(false)
  }, [])

  const loadLogs = useCallback(async () => {
    const res = await adminApi('/admin/performance/consent-logs?per_page=20')
    if (res.ok) setLogs(res.data)
  }, [])

  useEffect(() => {
    load()
    loadLogs()
  }, [load, loadLogs])

  const flash = (text) => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2500)
  }

  const runCache = async (path, label) => {
    setBusy(label)
    const res = await adminApi(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targets: ['all'] }),
    })
    setBusy('')
    if (res.ok) {
      flash('Cache operation completed.')
      load()
    } else {
      flash('Cache operation failed.')
    }
  }

  const saveCookieBanner = async () => {
    setBusy('save')
    const res = await adminApi('/admin/performance/cookie-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        settings: {
          banner: bannerForm,
          consent_version: cookieSettings?.consent_version,
        },
      }),
    })
    setBusy('')
    if (res.ok) {
      setCookieSettings(res.data.settings)
      flash('Cookie banner settings saved.')
    } else {
      flash('Could not save settings.')
    }
  }

  const consent = metrics?.consent ?? {}

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">System</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text dark:text-white">Performance &amp; privacy</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-text/70 dark:text-white/60">
            Cache controls, cookie compliance settings, consent analytics, and infrastructure metrics.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-black/[0.03] dark:border-white/15 dark:text-white"
        >
          Refresh
        </button>
      </div>

      {message ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
          {message}
        </div>
      ) : null}

      {loading ? (
        <p className="mt-8 text-sm text-brand-text/60">Loading metrics…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="glass-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-text/50">Cache driver</p>
              <p className="mt-2 text-lg font-semibold text-brand-text dark:text-white">{metrics?.cache?.driver}</p>
            </article>
            <article className="glass-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-text/50">Session</p>
              <p className="mt-2 text-lg font-semibold text-brand-text dark:text-white">
                {metrics?.session?.driver} · {metrics?.session?.lifetime_minutes}m
              </p>
            </article>
            <article className="glass-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-text/50">Consents (7d)</p>
              <p className="mt-2 text-lg font-semibold text-brand-text dark:text-white">{consent.last_7_days ?? 0}</p>
            </article>
            <article className="glass-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-text/50">Consents (total)</p>
              <p className="mt-2 text-lg font-semibold text-brand-text dark:text-white">{consent.total ?? 0}</p>
            </article>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="glass-card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-brand-text dark:text-white">Cache management</h2>
              <p className="mt-1 text-sm text-brand-text/60 dark:text-white/55">Clear application, config, route, and view caches.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => runCache('/admin/performance/cache/clear', 'clear')}
                  className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Clear all caches
                </button>
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={async () => {
                    setBusy('warm')
                    const res = await adminApi('/admin/performance/cache/warm', { method: 'POST' })
                    setBusy('')
                    flash(res.ok ? 'Caches warmed.' : 'Warm failed.')
                    load()
                  }}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/15"
                >
                  Warm caches
                </button>
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={async () => {
                    setBusy('opt')
                    const res = await adminApi('/admin/performance/cache/optimize', { method: 'POST' })
                    setBusy('')
                    flash(res.ok ? 'Optimization complete.' : 'Optimization failed.')
                    load()
                  }}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/15"
                >
                  Optimize (prod)
                </button>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-brand-text/70 dark:text-white/60">
                <li>Framework cache: {formatBytes(metrics?.storage?.framework_cache_bytes)}</li>
                <li>Compiled views: {formatBytes(metrics?.storage?.framework_views_bytes)}</li>
                <li>Bootstrap cache: {formatBytes(metrics?.storage?.bootstrap_cache_bytes)}</li>
              </ul>
            </article>

            <article className="glass-card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-brand-text dark:text-white">Cookie banner</h2>
              <div className="mt-4 space-y-3">
                <label className="block text-sm">
                  <span className="font-medium text-brand-text/80 dark:text-white/80">Title</span>
                  <input
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5"
                    value={bannerForm.title ?? ''}
                    onChange={(e) => setBannerForm((b) => ({ ...b, title: e.target.value }))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-brand-text/80 dark:text-white/80">Description</span>
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5"
                    value={bannerForm.description ?? ''}
                    onChange={(e) => setBannerForm((b) => ({ ...b, description: e.target.value }))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-brand-text/80 dark:text-white/80">Privacy policy URL</span>
                  <input
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5"
                    value={bannerForm.privacy_policy_url ?? ''}
                    onChange={(e) => setBannerForm((b) => ({ ...b, privacy_policy_url: e.target.value }))}
                  />
                </label>
              </div>
              <button
                type="button"
                disabled={busy === 'save'}
                onClick={saveCookieBanner}
                className="mt-4 rounded-xl bg-brand-text px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-brand-night"
              >
                Save banner copy
              </button>
            </article>
          </div>

          <article className="glass-card mt-8 overflow-hidden p-0">
            <div className="border-b border-black/8 px-5 py-4 dark:border-white/10">
              <h2 className="text-base font-semibold text-brand-text dark:text-white">Consent audit log</h2>
              <p className="text-sm text-brand-text/60 dark:text-white/55">Recent privacy choices (hashed IP, visitor ID).</p>
            </div>
            <div className="table-scroll">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-black/[0.03] text-xs uppercase tracking-wider text-brand-text/55 dark:bg-white/[0.04]">
                  <tr>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3">Region</th>
                    <th className="px-5 py-3">Categories</th>
                  </tr>
                </thead>
                <tbody>
                  {(logs?.data ?? []).map((row) => (
                    <tr key={row.id} className="border-t border-black/5 dark:border-white/10">
                      <td className="px-5 py-3 whitespace-nowrap text-brand-text/70 dark:text-white/65">
                        {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
                      </td>
                      <td className="px-5 py-3 font-medium">{row.action}</td>
                      <td className="px-5 py-3">{row.region}</td>
                      <td className="px-5 py-3 font-mono text-xs">
                        {row.categories
                          ? Object.entries(row.categories)
                              .filter(([, v]) => v)
                              .map(([k]) => k)
                              .join(', ') || 'essential'
                          : '—'}
                      </td>
                    </tr>
                  ))}
                  {!logs?.data?.length ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-brand-text/50">
                        No consent events yet. Run migrations if tables are missing.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>
        </>
      )}
    </section>
  )
}
