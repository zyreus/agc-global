import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const THEME_KEY = 'agc-theme'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark') document.documentElement.classList.add('dark')
    if (stored === 'light') document.documentElement.classList.remove('dark')
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goTo = (id) => {
    setMobileOpen(false)
    if (location.pathname !== '/') {
      navigate('/', { replace: false })
      window.setTimeout(() => scrollToSection(id), 50)
      return
    }
    scrollToSection(id)
  }

  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', nextIsDark)
    localStorage.setItem(THEME_KEY, nextIsDark ? 'dark' : 'light')
  }

  const navItems = [
    { id: 'solutions', label: 'Solutions' },
    { id: 'products', label: 'Products' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'industries', label: 'Industries' },
    { id: 'about', label: 'About' },
    { id: 'insights', label: 'Resources' },
  ]

  return (
    <header
      className={[
        'sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors',
        scrolled
          ? 'border-brand-secondary/25 bg-white/90 shadow-sm dark:border-white/10 dark:bg-brand-night/85'
          : 'border-brand-secondary/15 bg-brand-background-alt/90 dark:border-white/10 dark:bg-brand-night/75',
      ].join(' ')}
    >
      <div
        className="pointer-events-none absolute left-0 top-full z-50 h-0.5 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-primary"
        style={{ width: `${scrollPct}%` }}
        aria-hidden
      />
      <div className="app-container flex items-center justify-between gap-2 py-3 sm:py-4">
        <button
          type="button"
          onClick={() => goTo('hero')}
          className="flex shrink-0 items-center gap-3 text-left transition hover:opacity-90"
        >
          <img
            src="/AGC.png"
            alt="Amalgated Global Computek"
            className="h-11 w-11 object-cover object-[0%_50%] sm:h-12 sm:w-12"
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-wide text-brand-text dark:text-white">
              Amalgated Global Computek
            </span>
            <span className="text-xs text-brand-text/70 dark:text-white/65">
              Technologies &amp; Business Solutions
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 text-sm font-medium text-brand-text lg:flex xl:gap-2">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => goTo(item.id)} className="nav-link rounded-full px-3 py-2">
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-brand-text transition hover:border-brand-primary/40 hover:text-brand-primary dark:border-white/15 dark:text-white dark:hover:border-brand-gold/40 dark:hover:text-brand-gold"
            aria-label="Toggle color theme"
          >
            <span className="hidden dark:inline" aria-hidden>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="inline dark:hidden" aria-hidden>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 14.5A8.5 8.5 0 0 1 9.5 3 8.5 8.5 0 1 0 21 14.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <button
            type="button"
            onClick={() => goTo('contact')}
            className="ml-2 inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover hover:shadow-[0_4px_12px_rgba(255,140,26,0.35)]"
          >
            Book a Consultation
          </button>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-lg text-brand-text hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            aria-label="Toggle color theme"
          >
            <span className="hidden dark:inline" aria-hidden>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="inline dark:hidden" aria-hidden>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 14.5A8.5 8.5 0 0 1 9.5 3 8.5 8.5 0 1 0 21 14.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <button
            type="button"
            className="flex h-11 min-w-[44px] items-center justify-center rounded-lg text-brand-text hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-brand-secondary/20 bg-brand-background-alt/98 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-brand-night/95 lg:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="block w-full rounded-lg px-3 py-2.5 text-left text-brand-text hover:bg-brand-primary/10 hover:text-brand-primary dark:text-white dark:hover:bg-white/10 dark:hover:text-brand-gold"
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="mt-3 block w-full rounded-xl bg-brand-primary px-4 py-3 text-center text-sm font-semibold text-white"
            onClick={() => goTo('contact')}
          >
            Book a Consultation
          </button>
        </div>
      )}
    </header>
  )
}
