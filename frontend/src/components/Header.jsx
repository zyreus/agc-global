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
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prev
    }
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
    { id: 'insights', label: 'News & insights' },
  ]

  const themeToggleBtn = (
    <button
      type="button"
      onClick={toggleTheme}
      className="touch-target rounded-full border border-black/10 text-brand-text transition hover:border-brand-primary/40 hover:text-brand-primary dark:border-white/15 dark:text-white dark:hover:border-brand-gold/40 dark:hover:text-brand-gold"
      aria-label="Toggle color theme"
    >
      <span className="hidden dark:inline" aria-hidden>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" strokeWidth="2" />
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
  )

  return (
    <header
      className={[
        'sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors safe-top',
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
      <div className="app-container flex items-center justify-between gap-2 py-3 sm:py-3.5 lg:py-4">
        <button
          type="button"
          onClick={() => goTo('hero')}
          className="flex min-w-0 shrink items-center gap-2.5 text-left transition hover:opacity-90 sm:gap-3"
        >
          <img
            src="/AGC.png"
            alt="Amalgated Global Computek"
            className="h-10 w-10 object-cover object-[0%_50%] sm:h-11 sm:w-11 lg:h-12 lg:w-12"
          />
          <span className="hidden min-w-0 flex-col leading-tight xs:flex">
            <span className="truncate text-xs font-semibold tracking-wide text-brand-text sm:text-sm dark:text-white">
              Amalgated Global Computek
            </span>
            <span className="hidden truncate text-[11px] text-brand-text/70 sm:block dark:text-white/65">
              Technologies &amp; Business Solutions
            </span>
          </span>
        </button>

        <nav
          className="hidden max-w-[42vw] items-center gap-0.5 overflow-x-auto text-sm font-medium text-brand-text md:flex lg:max-w-none lg:gap-1 xl:gap-2"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              className="nav-link shrink-0 whitespace-nowrap rounded-full px-2.5 py-2 lg:px-3"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          {themeToggleBtn}
          <button
            type="button"
            onClick={() => goTo('contact')}
            className="ml-1 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover sm:px-5"
          >
            <span className="hidden xl:inline">Book a Consultation</span>
            <span className="xl:hidden">Contact</span>
          </button>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 lg:hidden">
          {themeToggleBtn}
          <button
            type="button"
            className="touch-target rounded-lg text-brand-text hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[45] bg-black/45 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-y-0 right-0 z-[46] flex w-[min(100vw,20rem)] flex-col border-l border-black/10 bg-brand-background-alt/98 shadow-2xl backdrop-blur-xl safe-top safe-bottom dark:border-white/10 dark:bg-brand-night/98 lg:hidden"
            style={{ animation: 'agc-slide-up 0.3s ease-out' }}
          >
            <div className="flex items-center justify-between border-b border-black/8 px-4 py-4 dark:border-white/10">
              <p className="text-sm font-semibold text-brand-text dark:text-white">Menu</p>
              <button
                type="button"
                className="touch-target rounded-lg text-brand-text hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="mb-1 flex w-full min-h-11 items-center rounded-xl px-4 text-left text-base font-medium text-brand-text transition hover:bg-brand-primary/10 hover:text-brand-primary dark:text-white dark:hover:bg-white/10 dark:hover:text-brand-gold"
                  onClick={() => goTo(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="border-t border-black/8 p-4 dark:border-white/10">
              <button
                type="button"
                className="flex w-full min-h-12 items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white shadow-brand-primary"
                onClick={() => goTo('contact')}
              >
                Book a Consultation
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
