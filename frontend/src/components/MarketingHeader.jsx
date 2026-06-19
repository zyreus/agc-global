import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ROUTES } from '../data/siteContent.js'
import { useTheme } from '../hooks/useTheme.js'

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { toggleTheme } = useTheme()

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = prev }
  }, [mobileOpen])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      setScrollPct(total > 0 ? (doc.scrollTop / total) * 100 : 0)
      setScrolled(doc.scrollTop > 10)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path))

  const themeToggleBtn = (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-theme-toggle touch-target rounded-full transition"
      aria-label="Toggle color theme"
    >
      <span className="hidden dark:inline" aria-hidden>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" strokeWidth="2" /></svg>
      </span>
      <span className="inline dark:hidden" aria-hidden>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 8.5 8.5 0 1 0 21 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
      </span>
    </button>
  )

  const navLinkClass = (path) =>
    ['nav-link shrink-0 whitespace-nowrap rounded-full px-2.5 py-2 lg:px-3', isActive(path) ? 'theme-nav-link is-active' : 'theme-nav-link'].join(' ')

  return (
    <header className={`theme-header sticky top-0 z-40 w-full transition-colors safe-top ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="pointer-events-none absolute left-0 top-full z-50 h-0.5 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-primary" style={{ width: `${scrollPct}%` }} aria-hidden />
      <div className="app-container flex items-center justify-between gap-2 py-3 sm:py-3.5 lg:py-4">
        <Link to="/" className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3" onClick={() => setMobileOpen(false)}>
          <img src="/AGC.png" alt="Amalgated Global Computek" className="h-10 w-10 object-cover object-[0%_50%] sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
          <span className="hidden min-w-0 flex-col leading-tight xs:flex">
            <span className="theme-heading truncate text-xs font-semibold tracking-wide sm:text-sm">Amalgated Global Computek</span>
            <span className="theme-text hidden truncate text-[11px] sm:block">Technologies &amp; Business Solutions</span>
          </span>
        </Link>

        <nav className="hidden max-w-[42vw] items-center gap-0.5 overflow-x-auto text-sm font-medium md:flex lg:max-w-none lg:gap-1 xl:gap-2" aria-label="Primary">
          {NAV_ROUTES.map((item) => (
            <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>{item.label}</Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          {themeToggleBtn}
          <Link to="/contact" className="theme-btn-primary ml-1 px-4 sm:px-5">
            <span className="hidden xl:inline">Book a Consultation</span>
            <span className="xl:hidden">Contact</span>
          </Link>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 lg:hidden">
          {themeToggleBtn}
          <button
            type="button"
            className="theme-nav-link touch-target rounded-lg transition hover:bg-[color-mix(in_srgb,var(--text-primary)_5%,transparent)]"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button type="button" className="theme-modal-backdrop fixed inset-0 z-[45] lg:hidden" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Site navigation" className="theme-nav-drawer fixed inset-y-0 right-0 z-[46] flex w-[min(100vw,20rem)] flex-col shadow-2xl safe-top safe-bottom lg:hidden">
            <div className="theme-divider flex items-center justify-between border-b px-4 py-4">
              <p className="theme-heading text-sm font-semibold">Menu</p>
              <button type="button" className="theme-nav-link touch-target rounded-lg" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              {NAV_ROUTES.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mb-1 flex w-full min-h-11 items-center rounded-xl px-4 text-base font-medium transition hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] ${isActive(item.path) ? 'text-brand-primary' : 'theme-nav-link'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="theme-divider border-t p-4">
              <Link to="/contact" className="theme-btn-primary flex w-full min-h-12 items-center justify-center" onClick={() => setMobileOpen(false)}>
                Book a Consultation
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
