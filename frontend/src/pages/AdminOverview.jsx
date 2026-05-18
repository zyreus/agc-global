import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminOverview } from '../lib/adminPortalApi.js'
import { resolveRouterBasename } from '../lib/routerBasename.js'

function KpiCard({ label, value, hint, accent }) {
  return (
    <article className="glass-card relative overflow-hidden p-5 sm:p-6">
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-full ${accent ?? 'bg-brand-primary/80'}`}
        aria-hidden
      />
      <p className="pl-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-text/55 dark:text-white/45">{label}</p>
      <p className="mt-3 pl-3 font-mono text-3xl font-semibold tabular-nums tracking-tight text-brand-text dark:text-white">{value}</p>
      {hint ? <p className="mt-2 pl-3 text-xs text-brand-text/50 dark:text-white/40">{hint}</p> : null}
    </article>
  )
}

function QuickLink({ to, title, desc }) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-black/8 bg-white/60 p-4 transition hover:border-brand-primary/35 hover:bg-white hover:shadow-[0_12px_40px_rgba(255,140,26,0.08)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-brand-primary/30 dark:hover:bg-white/[0.07]"
    >
      <span className="text-sm font-semibold text-brand-text group-hover:text-brand-primary dark:text-white dark:group-hover:text-brand-gold">{title}</span>
      <span className="mt-1 text-xs text-brand-text/55 dark:text-white/45">{desc}</span>
    </Link>
  )
}

function ActivitySpark({ total, today }) {
  const pct = total > 0 ? Math.min(100, Math.round((today / total) * 100)) : 0
  const bars = [12, 28, 45, 62, 48, 72, 88, 55, 40, 95, 70, 38].map((h, i) => ({
    h: Math.min(100, h * (0.4 + (i % 4) * 0.15)),
    active: i === 11,
  }))
  return (
    <div className="mt-6">
      <div className="flex h-24 items-end justify-between gap-1">
        {bars.map((b, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm transition-all duration-500 ${
              b.active ? 'bg-gradient-to-t from-brand-primary to-brand-primary-hover' : 'bg-brand-text/10 dark:bg-white/15'
            }`}
            style={{ height: `${b.h}%` }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-brand-text/50 dark:text-white/40">
        Today’s share of all-time customer messages: <span className="font-semibold text-brand-primary">{pct}%</span>
      </p>
    </div>
  )
}

export default function AdminOverview() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const publicUpdatesUrl = `${resolveRouterBasename() ?? ''}/#updates`

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

  const stats = data?.stats
  const recent = useMemo(() => (Array.isArray(data?.recent_messages) ? data.recent_messages.slice(0, 6) : []), [data])

  return (
    <section>
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-brand-secondary via-brand-secondary to-brand-night p-6 text-white shadow-soft sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-brand-primary/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold/90">AGC command center</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Operational pulse</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
            Live engagement metrics from Chat & CRM, plus growth signals across leads, content, and audience — aligned with the public-site enterprise experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-secondary shadow-soft transition hover:bg-brand-background disabled:opacity-60"
            >
              {loading ? 'Refreshing…' : 'Refresh data'}
            </button>
            <Link
              to="/admin/crm"
              className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Open Chat & CRM
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Customer messages" value={stats?.total_messages ?? 0} hint="All-time (active sessions)" accent="bg-brand-primary" />
        <KpiCard label="Active sessions" value={stats?.total_sessions ?? 0} hint="Non-archived conversations" accent="bg-brand-gold/90" />
        <KpiCard label="Messages today" value={stats?.messages_today ?? 0} hint="User role only" accent="bg-emerald-500/90" />
        <KpiCard label="Captured leads" value={stats?.total_leads ?? 0} hint="From website & chat" accent="bg-sky-500/90" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Feedback entries" value={stats?.total_feedback ?? 0} hint="Customer voice" />
        <KpiCard label="Live news" value={stats?.published_news ?? 0} hint="Published on website" />
        <KpiCard label="Newsletter subscribers" value={stats?.total_subscribers ?? 0} hint="Audience growth" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-eyebrow">Engagement</p>
                <h2 className="mt-1 text-xl font-semibold text-brand-text dark:text-white">Message velocity</h2>
              </div>
            </div>
            <ActivitySpark total={stats?.total_messages ?? 0} today={stats?.messages_today ?? 0} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <QuickLink to="/admin/leads" title="Lead pipeline" desc="Review and qualify inbound leads" />
            <QuickLink to="/admin/crm" title="Chat & CRM" desc="Sessions, replies, and CRM hygiene" />
            <QuickLink to="/admin/announcements" title="Announcements" desc="News and product updates" />
            <QuickLink to="/admin/workspace/analytics" title="Analytics hub" desc="Revenue & conversion (roadmap)" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card border-brand-primary/20 p-6 dark:border-brand-primary/25">
            <p className="section-eyebrow">AI assistant</p>
            <h2 className="mt-1 text-lg font-semibold text-brand-text dark:text-white">Copilot workspace</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-text/65 dark:text-white/55">
              Train FAQs, monitor intents, and tune escalation — wired to the enterprise chatbot roadmap.
            </p>
            <Link
              to="/admin/workspace/chatbot"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-primary py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
            >
              Open AI & chatbot
            </Link>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-text/55 dark:text-white/45">Recent customer messages</h2>
            <ul className="mt-4 space-y-3">
              {recent.length === 0 ? (
                <li className="rounded-xl border border-dashed border-black/10 px-3 py-6 text-center text-xs text-brand-text/45 dark:border-white/15 dark:text-white/40">
                  No recent messages yet.
                </li>
              ) : (
                recent.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-xl border border-black/6 bg-white/50 px-3 py-2.5 text-xs dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <p className="font-mono text-[10px] text-brand-text/40 dark:text-white/35">{m.session_id?.slice(0, 12)}…</p>
                    <p className="mt-1 line-clamp-2 text-brand-text/80 dark:text-white/75">{m.message}</p>
                  </li>
                ))
              )}
            </ul>
            <Link to="/admin/crm" className="mt-4 block text-center text-xs font-semibold text-brand-primary hover:underline">
              View all in CRM →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
