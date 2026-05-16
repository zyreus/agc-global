import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminOverview, getAdminToken } from '../../lib/adminPortalApi.js'

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function DotIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="8" />
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

function ApplicantIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h5M20.5 5.5v5" />
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

function ContentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h10M7 16h6" />
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

function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .1 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1-.1 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.1-1 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0 .1-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.1 1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1 .1 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .35.03.69.1 1 .2.62.78 1.05 1.45 1.05H21a2 2 0 1 1 0 4h-.08c-.67 0-1.25.43-1.45 1.05-.07.31-.1.65-.1 1Z" />
    </svg>
  )
}

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: DashboardIcon },
  { label: 'Applicant portal', to: '/admin/leads', icon: ApplicantIcon },
  { label: 'Careers & News', to: '/admin/announcements', icon: NewsIcon },
  { label: 'Content Management', to: '/admin/subscribers', icon: ContentIcon },
  { label: 'Chat & CRM', to: '/admin/crm', icon: ChatIcon },
  { label: 'Support tickets', to: '/admin/crm?tab=tickets', icon: TicketIcon },
  { label: 'Settings', to: '/admin/settings', icon: SettingsIcon },
]

export default function AdminShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [stats, setStats] = useState(null)

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

  const logout = () => {
    clearAdminToken()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#0f172a]">
      {mobileOpen && <button type="button" className="fixed inset-0 z-40 bg-black/35 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-60 border-r border-black/10 bg-[#f3f5f9] shadow-xl transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/40">Admin portal</p>
                <p className="text-sm font-semibold text-black/80">Amalgated Holdings</p>
              </div>
            </div>
            <button type="button" className="rounded-lg p-2 text-black/60 hover:bg-black/5 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="space-y-1 p-2.5">
            {NAV.map((item) => {
              const Icon = item.icon || DotIcon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-[#e9edf8] text-black ring-1 ring-black/10' : 'text-black/70 hover:bg-black/5 hover:text-black'
                    }`
                  }
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.to === '/admin/crm' && (stats?.total_messages ?? 0) > 0 && (
                    <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[11px] text-white">{stats.total_messages}</span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-auto border-t border-black/10 p-2.5">
            <button type="button" onClick={logout} className="w-full rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f6f7fb]/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-lg p-2 text-black/60 hover:bg-black/5 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open sidebar">
                <MenuIcon className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm font-semibold text-black/90">admin</p>
                <p className="text-xs text-black/50">Content, CRM & settings</p>
              </div>
            </div>
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <button type="button" className="rounded-lg border border-black/10 bg-white p-2 text-black/70 hover:bg-black/5" aria-label="Notifications">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" /></svg>
              </button>
              <Link to="/" className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/80 transition hover:bg-black/5">
                View site
              </Link>
              <Link to="/admin/settings" className="rounded-lg bg-brand-primary px-3 py-2 text-xs font-semibold text-white hover:bg-brand-primary-hover">
                Settings
              </Link>
            </div>
          </div>
        </header>

        <main className="px-3 py-3">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
