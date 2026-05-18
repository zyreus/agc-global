import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminOverview, getAdminToken } from '../../lib/adminPortalApi.js'

const THEME_KEY = 'agc-theme'

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h7V3H3v9zm11 9h7v-7h-7v7zm-11 0h7v-5H3v5zm11-11h7V3h-7v7z" />
    </svg>
  )
}

function LeadsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h5M20.5 5.5v5" />
    </svg>
  )
}

function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12c0 4.418-3.582 8-8 8-1.151 0-2.245-.243-3.234-.68L4 20l.86-3.766A7.963 7.963 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8Z" />
    </svg>
  )
}

function TicketIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6m6-6v6" />
    </svg>
  )
}

function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.09 6.26L21 9.27l-5 3.64L17.18 21 12 17.77 6.82 21 8 12.91l-5-3.64 6.91-1.01L12 3z" />
    </svg>
  )
}

function NewsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20V5a2 2 0 0 0-2-2H8a4 4 0 0 0-4 4v12.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm0 4l8 5 8-5" />
    </svg>
  )
}

function LayoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 21V9" />
    </svg>
  )
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function KanbanIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

function SparklesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}

function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 5-6" />
    </svg>
  )
}

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function InboxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .1 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1-.1 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.1-1 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0 .1-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.1 1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1 .1 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .35.03.69.1 1 .2.62.78 1.05 1.45 1.05H21a2 2 0 1 1 0 4h-.08c-.67 0-1.25.43-1.45 1.05-.07.31-.1.65-.1 1Z" />
    </svg>
  )
}

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

const NAV_GROUPS = [
  {
    heading: 'Overview',
    items: [{ label: 'Command center', to: '/admin/dashboard', icon: DashboardIcon }],
  },
  {
    heading: 'Revenue & CRM',
    items: [
      { label: 'Lead pipeline', to: '/admin/leads', icon: LeadsIcon, badgeKey: 'total_leads' },
      { label: 'Chat & CRM', to: '/admin/crm', icon: ChatIcon, badgeKey: 'total_messages' },
      { label: 'Support tickets', to: '/admin/crm?tab=tickets', icon: TicketIcon, matchTickets: true },
      { label: 'Feedback', to: '/admin/feedback', icon: StarIcon, badgeKey: 'total_feedback' },
    ],
  },
  {
    heading: 'Marketing & CMS',
    items: [
      { label: 'Announcements', to: '/admin/announcements', icon: NewsIcon, badgeKey: 'total_announcements' },
      { label: 'Newsletter', to: '/admin/subscribers', icon: MailIcon, badgeKey: 'total_subscribers' },
      { label: 'Website CMS', to: '/admin/workspace/cms', icon: LayoutIcon, roadmap: true },
    ],
  },
  {
    heading: 'Operations',
    items: [
      { label: 'HRIS', to: '/admin/workspace/hris', icon: UsersIcon, roadmap: true },
      { label: 'Projects', to: '/admin/workspace/projects', icon: KanbanIcon, roadmap: true },
      { label: 'AI & chatbot', to: '/admin/workspace/chatbot', icon: SparklesIcon, roadmap: true },
    ],
  },
  {
    heading: 'Insights & security',
    items: [
      { label: 'Analytics', to: '/admin/workspace/analytics', icon: ChartIcon, roadmap: true },
      { label: 'Security & infra', to: '/admin/workspace/security', icon: ShieldIcon, roadmap: true },
    ],
  },
  {
    heading: 'System',
    items: [
      { label: 'Messages', to: '/admin/messages', icon: InboxIcon },
      { label: 'Performance & privacy', to: '/admin/performance', icon: ShieldIcon },
      { label: 'Settings', to: '/admin/settings', icon: SettingsIcon },
    ],
  },
]

function itemIsActive(location, item) {
  if (item.matchTickets) {
    return location.pathname === '/admin/crm' && location.search.includes('tab=tickets')
  }
  if (item.to.includes('?')) {
    const [path, qs] = item.to.split('?')
    const params = new URLSearchParams(qs)
    if (location.pathname !== path) return false
    for (const [k, v] of params) {
      if (!location.search.includes(`${k}=${v}`)) return false
    }
    return true
  }
  if (item.to === '/admin/crm') {
    return location.pathname === '/admin/crm' && !location.search.includes('tab=tickets')
  }
  return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
}

function navLinkClass(active, roadmap) {
  const base =
    'group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200'
  if (active) {
    return `${base} bg-brand-primary/12 text-brand-text ring-1 ring-brand-primary/25 dark:bg-brand-primary/20 dark:text-white dark:ring-brand-primary/30`
  }
  return `${base} text-brand-text/70 hover:bg-black/[0.04] hover:text-brand-text dark:text-white/65 dark:hover:bg-white/[0.06] dark:hover:text-white ${roadmap ? 'opacity-90' : ''}`
}

export default function AdminShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [stats, setStats] = useState(null)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
  )
  const notifyRef = useRef(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'dark') document.documentElement.classList.add('dark')
      else if (stored === 'light') document.documentElement.classList.remove('dark')
    } catch {
      /* ignore */
    }
    const id = requestAnimationFrame(() => {
      setDark(document.documentElement.classList.contains('dark'))
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!notifyOpen) return
    const onDoc = (e) => {
      if (notifyRef.current && !notifyRef.current.contains(e.target)) setNotifyOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [notifyOpen])

  useEffect(() => {
    if (!getAdminToken()) {
      navigate('/admin', { replace: true })
      return
    }

    let cancelled = false
    ;(async () => {
      const result = await fetchAdminOverview()
      if (cancelled) return

      if (!result.ok) {
        if (result.status === 401) {
          clearAdminToken()
          navigate('/admin', { replace: true })
        }
        return
      }
      setStats(result.data?.stats ?? null)
    })()

    return () => {
      cancelled = true
    }
  }, [location.pathname, navigate])

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark')
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem(THEME_KEY, 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem(THEME_KEY, 'light')
    }
    setDark(next)
  }

  const logout = () => {
    clearAdminToken()
    navigate('/admin', { replace: true })
  }

  const badgeFor = (key) => {
    const n = stats?.[key]
    if (n == null || n === 0) return null
    return (
      <span className="min-w-[1.25rem] rounded-full bg-brand-primary px-1.5 py-0.5 text-center text-[10px] font-bold text-white tabular-nums">
        {n > 99 ? '99+' : n}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-brand-background-alt text-brand-text transition-colors duration-300 dark:bg-brand-night dark:text-white/90">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-black/8 bg-white/90 shadow-[8px_0_40px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-brand-navy/90 dark:shadow-[8px_0_40px_rgba(0,0,0,0.35)] lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-2 border-b border-black/8 px-4 py-4 dark:border-white/10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-brand-primary">Command center</p>
            <p className="mt-1.5 text-base font-semibold tracking-tight text-brand-text dark:text-white">AGC Global</p>
            <p className="mt-0.5 text-xs text-brand-text/55 dark:text-white/50">Internal business OS</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-brand-text/50 transition hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.heading} className="mb-5 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/40 dark:text-white/35">{group.heading}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin/dashboard'}
                      onClick={() => setMobileOpen(false)}
                      className={() => navLinkClass(itemIsActive(location, item), item.roadmap)}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0 text-brand-primary/90 dark:text-brand-gold/90" />
                        <span className="truncate">{item.label}</span>
                        {item.roadmap && (
                          <span className="shrink-0 rounded-md bg-black/[0.06] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand-text/50 dark:bg-white/10 dark:text-white/45">
                            Soon
                          </span>
                        )}
                      </span>
                      {item.badgeKey ? badgeFor(item.badgeKey) : null}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-black/8 p-3 dark:border-white/10">
          <div className="mb-2 rounded-xl border border-black/8 bg-black/[0.02] px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-text/45 dark:text-white/40">Signed in</p>
            <p className="mt-0.5 truncate text-xs font-medium text-brand-text dark:text-white/90">Administrator</p>
            <p className="mt-1 inline-flex items-center rounded-md bg-brand-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-primary dark:bg-brand-primary/25 dark:text-brand-gold">
              Super admin
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[17.5rem]">
        <header className="sticky top-0 z-30 border-b border-black/8 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy/75">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                className="rounded-xl p-2 text-brand-text/60 transition hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-text dark:text-white">AGC Admin Portal</p>
                <p className="truncate text-xs text-brand-text/55 dark:text-white/50">CRM · Content · Operations</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
              <div className="relative" ref={notifyRef}>
                <button
                  type="button"
                  onClick={() => setNotifyOpen((v) => !v)}
                  className="relative rounded-xl border border-black/10 bg-white p-2.5 text-brand-text/70 transition hover:bg-black/[0.03] dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                  aria-expanded={notifyOpen}
                  aria-haspopup="true"
                  aria-label="Notifications"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                  </svg>
                </button>
                {notifyOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-brand-navy">
                    <p className="text-sm font-semibold text-brand-text dark:text-white">Notifications</p>
                    <p className="mt-2 text-xs leading-relaxed text-brand-text/60 dark:text-white/55">
                      Real-time alerts will appear here as workflows, CRM milestones, and security events are connected to the API.
                    </p>
                    <div className="mt-4 rounded-xl border border-dashed border-black/15 bg-brand-background/50 px-3 py-6 text-center text-xs text-brand-text/45 dark:border-white/15 dark:bg-white/[0.03] dark:text-white/40">
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-black/10 bg-white p-2.5 text-brand-text/70 transition hover:bg-black/[0.03] dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </button>

              <Link
                to="/"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-brand-text transition hover:bg-black/[0.03] dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                View site
              </Link>
              <Link
                to="/admin/settings"
                className="rounded-xl bg-brand-primary px-2.5 py-2 text-xs font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover sm:px-3"
              >
                Settings
              </Link>
            </div>
          </div>
        </header>

        <main className="relative min-h-[calc(100vh-4rem)] px-3 py-5 sm:px-5 sm:py-6">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-20"
            aria-hidden
          >
            <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-brand-primary/25 blur-3xl dark:bg-brand-primary/15" />
            <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-brand-secondary/10 blur-3xl dark:bg-brand-gold/10" />
          </div>
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
