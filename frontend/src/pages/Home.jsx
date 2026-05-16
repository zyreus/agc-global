import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import ChatWidget from '../components/ChatWidget.jsx'
import { API_BASE_URL } from '../lib/config.js'
import {
  INDUSTRY_SOLUTIONS,
  PARTNER_LABELS,
  PORTFOLIO_ITEMS,
  PROCESS_STEPS,
  SERVICE_CATEGORIES,
  TESTIMONIALS,
} from '../data/marketingContent.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { useReveal } from '../hooks/useReveal.js'

const LEAD_SESSION_KEY = 'agc_web_inquiry_session'

function getLeadSessionId() {
  let id = sessionStorage.getItem(LEAD_SESSION_KEY)
  if (!id) {
    id = `web-${crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
    sessionStorage.setItem(LEAD_SESSION_KEY, id)
  }
  return id
}

function ServiceIcon({ name, className }) {
  const cn = className ?? 'h-5 w-5'
  if (name === 'layers') {
    return (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M3 13 12 18l9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M3 17 12 22l9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    )
  }
  if (name === 'code') {
    return (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 19V5M8 17V9M12 17v-4M16 17V7M20 17v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WaveDivider({ className }) {
  return (
    <div className={['relative -mt-px h-14 w-full overflow-hidden sm:h-16', className].filter(Boolean).join(' ')} aria-hidden>
      <svg className="h-full w-full text-brand-background dark:text-brand-night" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          fill="currentColor"
          d="M0 40 C 240 0, 480 80, 720 40 S 1200 0, 1440 40 L 1440 80 L 0 80 Z"
        />
      </svg>
    </div>
  )
}

function KpiCounter({ label, value, suffix, ariaLabel }) {
  const [ref, visible] = useReveal({ threshold: 0.35 })
  const reduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(0)
  const target = value
  const raf = useRef(null)

  useEffect(() => {
    if (!visible) return
    if (reduced) {
      const id = requestAnimationFrame(() => setDisplay(target))
      return () => cancelAnimationFrame(id)
    }
    const start = performance.now()
    const duration = 1200
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(target * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [visible, reduced, target])

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl" aria-label={ariaLabel}>
        {display}
        {suffix}
      </p>
    </div>
  )
}

export default function Home() {
  const [announcements, setAnnouncements] = useState([])
  const [newsletterName, setNewsletterName] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const [expandedServiceId, setExpandedServiceId] = useState(SERVICE_CATEGORIES[0]?.id ?? null)
  const [serviceCompareTab, setServiceCompareTab] = useState('deliverables')
  const [portfolioFilter, setPortfolioFilter] = useState('all')
  const [portfolioModalId, setPortfolioModalId] = useState(null)

  const [contactStep, setContactStep] = useState(1)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactCompany, setContactCompany] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactInterest, setContactInterest] = useState('it')
  const [contactMessage, setContactMessage] = useState('')
  const [contactLoading, setContactLoading] = useState(false)
  const [contactMessageText, setContactMessageText] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/announcements`)
        const data = await response.json().catch(() => ({}))
        if (!cancelled) setAnnouncements(data.announcements ?? [])
      } catch {
        if (!cancelled) setAnnouncements([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Amalgated Global Computek',
      alternateName: 'AGC',
      url: 'https://www.amalgatedcomputek.com',
      email: 'agc.billing2026@gmail.com',
      telephone: '+63-919-067-5099',
      slogan: 'Your Goals. Our Solutions.',
      areaServed: 'PH',
      knowsAbout: ['Software development', 'IT solutions', 'Business automation', 'System integration', 'Security'],
    }),
    []
  )

  useEffect(() => {
    const title = 'AGC | Enterprise IT & Business Solutions | Amalgated Global Computek'
    if (document.title !== title) document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute(
      'content',
      'AGC delivers enterprise-grade software, integrations, security, and business automation tailored to your operations.'
    )

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [structuredData])

  const subscribeNewsletter = async (event) => {
    event.preventDefault()
    if (!newsletterEmail.trim()) return

    setNewsletterLoading(true)
    setNewsletterMessage('')
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newsletterName.trim() || undefined,
          email: newsletterEmail.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Could not subscribe right now.')
      setNewsletterMessage(data?.message || 'Subscribed successfully.')
      setNewsletterName('')
      setNewsletterEmail('')
    } catch (error) {
      setNewsletterMessage(error.message)
    } finally {
      setNewsletterLoading(false)
    }
  }

  const filteredPortfolio = useMemo(() => {
    if (portfolioFilter === 'all') return PORTFOLIO_ITEMS
    return PORTFOLIO_ITEMS.filter((p) => p.category === portfolioFilter)
  }, [portfolioFilter])

  const portfolioModal = useMemo(
    () => PORTFOLIO_ITEMS.find((p) => p.id === portfolioModalId) ?? null,
    [portfolioModalId]
  )

  const submitInquiry = useCallback(async () => {
    setContactLoading(true)
    setContactMessageText('')
    try {
      const concern = [
        `Interest: ${contactInterest}`,
        contactMessage.trim() ? `Details: ${contactMessage.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n')

      const response = await fetch(`${API_BASE_URL}/chat/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getLeadSessionId(),
          name: contactName.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim() || undefined,
          company: contactCompany.trim() || undefined,
          concern,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Could not send your inquiry right now.')
      setContactMessageText('Thanks — your inquiry was received. Our team will follow up shortly.')
      setContactStep(1)
      setContactName('')
      setContactEmail('')
      setContactCompany('')
      setContactPhone('')
      setContactInterest('it')
      setContactMessage('')
    } catch (error) {
      setContactMessageText(error.message)
    } finally {
      setContactLoading(false)
    }
  }, [contactCompany, contactEmail, contactInterest, contactMessage, contactName, contactPhone])

  useEffect(() => {
    if (!portfolioModalId) return
    const onKey = (e) => {
      if (e.key === 'Escape') setPortfolioModalId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [portfolioModalId])

  const compareFields = useMemo(() => {
    const key =
      serviceCompareTab === 'deliverables' ? 'deliverables' : serviceCompareTab === 'timeline' ? 'timeline' : 'support'
    return SERVICE_CATEGORIES.map((s) => ({ id: s.id, title: s.title, value: s[key] }))
  }, [serviceCompareTab])

  return (
    <main id="main-content" className="flex-1">
      <section id="hero" className="relative overflow-hidden bg-brand-dark text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-primary/25 blur-3xl motion-safe:animate-blob" />
          <div className="absolute -right-28 top-10 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl motion-safe:animate-blob motion-safe:[animation-delay:-3s]" />
          <div className="absolute bottom-[-30%] left-[20%] h-[420px] w-[420px] rounded-full bg-brand-navy/55 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,140,26,0.35),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(255,213,128,0.18),transparent_45%),linear-gradient(135deg,rgba(10,15,31,0.95),rgba(5,8,22,0.98))]" />
        </div>

        <div className="app-container relative grid min-w-0 items-center gap-12 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:py-28">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">Your Goals. Our Solutions.</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Enterprise technology
              <span className="block bg-gradient-to-r from-brand-gold via-white to-brand-primary bg-clip-text text-transparent motion-safe:animate-shimmer">
                built for measurable outcomes
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Amalgated Global Computek (AGC) partners with startups, enterprises, and public institutions to ship reliable systems,
              modern interfaces, and integrations that hold up under real operational load.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover hover:shadow-[0_4px_12px_rgba(255,140,26,0.35)]"
              >
                Start Your Project
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/95 backdrop-blur-md transition hover:border-brand-gold/40 hover:bg-white/10"
              >
                View Portfolio
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <KpiCounter label="Projects delivered" value={210} suffix="+" ariaLabel="More than 210 projects delivered" />
              <KpiCounter label="Client satisfaction" value={98} suffix="%" ariaLabel="98 percent client satisfaction" />
              <KpiCounter label="Systems maintained" value={55} suffix="+" ariaLabel="More than 55 systems maintained" />
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
              <div className="absolute inset-x-[-45%] top-[-40%] h-64 rounded-[3rem] bg-brand-primary/25 blur-3xl" aria-hidden />
              <div className="relative space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-white/60">Command center</p>
                    <p className="text-sm font-semibold text-white">Delivery snapshot</p>
                  </div>
                  <span className="rounded-full bg-brand-primary/20 px-3 py-1 text-[10px] font-semibold text-brand-gold ring-1 ring-brand-primary/35">
                    AGC Enterprise
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 motion-safe:animate-float-slow">
                    <p className="text-[11px] text-white/60">Product</p>
                    <p className="mt-1 text-lg font-semibold text-brand-gold">UI systems</p>
                    <p className="mt-1 text-[11px] text-white/65">Design systems + responsive UX.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 motion-safe:animate-float-slow motion-safe:[animation-delay:-0.8s]">
                    <p className="text-[11px] text-white/60">Platform</p>
                    <p className="mt-1 text-lg font-semibold text-white">Integrations</p>
                    <p className="mt-1 text-[11px] text-white/65">APIs, events, and data flows.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 motion-safe:animate-float-slow motion-safe:[animation-delay:-1.6s]">
                    <p className="text-[11px] text-white/60">Reliability</p>
                    <p className="mt-1 text-lg font-semibold text-white">Security</p>
                    <p className="mt-1 text-[11px] text-white/65">Hardening + operational readiness.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/12 to-white/5 p-4 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/80">Program track</span>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/65">This quarter</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {['Discovery', 'Build', 'Scale'].map((x) => (
                      <div key={x} className="rounded-xl bg-black/20 px-2 py-2 text-center text-[11px] text-white/80 ring-1 ring-white/10">
                        {x}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WaveDivider />
      </section>

      <section id="partners" className="border-b border-black/5 bg-brand-background py-10 dark:border-white/10 dark:bg-brand-night">
        <div className="app-container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Trusted focus areas</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-brand-text dark:text-white">Built for regulated, high-stakes environments</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-brand-text/70 dark:text-white/65">
              Representative sectors we design for — from compliance-heavy workflows to customer-facing digital products.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/5 bg-white/70 py-4 shadow-soft dark:border-white/10 dark:bg-white/5">
            <div className="flex w-max gap-10 px-6 motion-safe:animate-marquee">
              {[...PARTNER_LABELS, ...PARTNER_LABELS].map((label, idx) => (
                <div key={`${label}-${idx}`} className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold text-brand-text/70 dark:text-white/70">
                  <span className="h-2 w-2 rounded-full bg-brand-primary" aria-hidden />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-brand-background py-16 dark:bg-brand-night">
        <div className="app-container grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">About AGC</p>
            <h2 className="text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Technology that aligns with how you operate</h2>
            <p className="text-base leading-relaxed text-brand-text/80 dark:text-white/75">
              We bridge the gap between business goals and engineering reality — shipping systems that teams can adopt, maintain, and extend.
            </p>
            <p className="text-base leading-relaxed text-brand-text/80 dark:text-white/75">
              Every engagement is structured around outcomes: clearer workflows, faster decisions, safer releases, and better customer experiences.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft dark:border-white/10 dark:bg-brand-navy/40 dark:shadow-none">
            <p className="text-sm font-semibold text-brand-text dark:text-white">What we deliver</p>
            <ul className="mt-4 space-y-3 text-sm text-brand-text/75 dark:text-white/70">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-primary" aria-hidden />
                Roadmaps you can execute — not slide decks you cannot.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-primary" aria-hidden />
                Engineering discipline: versioning, QA, and operational handover.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-primary" aria-hidden />
                Partnership mindset: measurable milestones and transparent communication.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-black/5 bg-brand-background-alt py-16 dark:border-white/10 dark:bg-brand-night">
        <div className="app-container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Core services</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Interactive service blueprint</h2>
              <p className="mt-3 text-base leading-relaxed text-brand-text/75 dark:text-white/70">
                Hover to explore categories, expand for details, and compare delivery expectations across offerings.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover"
            >
              Book a consultation
            </a>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {SERVICE_CATEGORIES.map((svc) => {
              const open = expandedServiceId === svc.id
              return (
                <article
                  key={svc.id}
                  className={[
                    'group rounded-3xl border bg-white p-6 shadow-soft transition will-change-transform dark:bg-brand-navy/35',
                    open ? 'border-brand-primary/50 ring-2 ring-brand-primary/20' : 'border-black/10 hover:-translate-y-0.5 hover:border-brand-primary/35 dark:border-white/10',
                  ].join(' ')}
                  onMouseEnter={() => setExpandedServiceId(svc.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/20 dark:bg-brand-primary/15">
                        <ServiceIcon name={svc.icon} className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-brand-text dark:text-white">{svc.title}</h3>
                        <p className="mt-1 text-sm text-brand-text/70 dark:text-white/65">{svc.summary}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-brand-text/80 transition group-hover:border-brand-primary/40 group-hover:text-brand-primary dark:border-white/10 dark:text-white/70 dark:group-hover:text-brand-gold"
                      onClick={() => setExpandedServiceId((cur) => (cur === svc.id ? null : svc.id))}
                      aria-expanded={open}
                    >
                      Learn more
                      <svg
                        className={['h-4 w-4 transition', open ? 'rotate-180' : ''].join(' ')}
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <ul className="mt-5 space-y-2 text-sm text-brand-text/75 dark:text-white/70">
                    {svc.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary/80" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {open && (
                    <div className="mt-5 rounded-2xl border border-brand-primary/20 bg-brand-background p-4 text-sm text-brand-text/75 dark:border-brand-gold/25 dark:bg-brand-night/40 dark:text-white/70">
                      <p>
                        <span className="font-semibold text-brand-text dark:text-white">Expanded detail:</span> {svc.deliverables.join(', ')}.
                      </p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          <div className="mt-12 rounded-3xl border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Service comparison</p>
                <h3 className="mt-2 text-xl font-semibold text-brand-text dark:text-white">Pick a lens</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'deliverables', label: 'Deliverables' },
                  { id: 'timeline', label: 'Timeline' },
                  { id: 'support', label: 'Support' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setServiceCompareTab(t.id)}
                    className={[
                      'rounded-full px-4 py-2 text-xs font-semibold transition',
                      serviceCompareTab === t.id
                        ? 'bg-brand-primary text-white shadow-brand-primary'
                        : 'border border-black/10 bg-brand-background text-brand-text/80 hover:border-brand-primary/35 dark:border-white/10 dark:bg-brand-night/40 dark:text-white/70',
                    ].join(' ')}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {compareFields.map((row) => (
                <div key={row.id} className="rounded-2xl border border-black/10 bg-brand-background p-4 dark:border-white/10 dark:bg-brand-night/40">
                  <p className="text-sm font-semibold text-brand-text dark:text-white">{row.title}</p>
                  <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{row.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Process workflow</p>
              <div className="mt-4 grid gap-4 md:grid-cols-5">
                {PROCESS_STEPS.map((step, idx) => (
                  <div key={step.title} className="relative rounded-2xl border border-black/10 bg-brand-background p-4 dark:border-white/10 dark:bg-brand-night/40">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">Step {idx + 1}</p>
                    <p className="mt-2 text-sm font-semibold text-brand-text dark:text-white">{step.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-brand-text/70 dark:text-white/65">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="industries" className="border-t border-black/5 bg-brand-background py-16 dark:border-white/10 dark:bg-brand-night">
        <div className="app-container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Industry solutions</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Specialized tracks for complex domains</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {INDUSTRY_SOLUTIONS.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-primary/35 dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none"
              >
                <h3 className="text-lg font-semibold text-brand-text dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-text/75 dark:text-white/70">{item.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span key={t} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-text/80 dark:bg-brand-primary/15 dark:text-white/80">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-t border-black/5 bg-brand-background-alt py-16 dark:border-white/10 dark:bg-brand-night">
        <div className="app-container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Portfolio</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Case studies &amp; solution patterns</h2>
              <p className="mt-3 text-base leading-relaxed text-brand-text/75 dark:text-white/70">
                Representative engagements illustrating how we combine UX, integrations, and operational rigor.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'crm', label: 'CRM' },
                { id: 'lending', label: 'Lending' },
                { id: 'ai', label: 'AI' },
                { id: 'legal', label: 'Legal' },
                { id: 'government', label: 'Government' },
                { id: 'integration', label: 'Integrations' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPortfolioFilter(f.id)}
                  className={[
                    'rounded-full px-4 py-2 text-xs font-semibold transition',
                    portfolioFilter === f.id
                      ? 'bg-brand-primary text-white'
                      : 'border border-black/10 bg-white text-brand-text/75 hover:border-brand-primary/35 dark:border-white/10 dark:bg-brand-navy/35 dark:text-white/70',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3">
            {filteredPortfolio.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPortfolioModalId(item.id)}
                className="break-inside-avoid w-full rounded-3xl border border-black/10 bg-white p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-brand-primary/35 dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none"
              >
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span key={t} className="rounded-full bg-brand-background px-3 py-1 text-[11px] font-semibold text-brand-text/70 dark:bg-brand-night/40 dark:text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-brand-text dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{item.outcome}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brand-primary">
                  Preview case study
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="border-t border-black/5 bg-brand-background py-16 dark:border-white/10 dark:bg-brand-night">
        <div className="app-container space-y-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Why choose AGC</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Trust is earned through delivery discipline</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-text/75 dark:text-white/70">
                We combine product thinking with engineering execution — so stakeholders see progress early and users feel the difference in day‑to‑day workflows.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Outcome clarity', detail: 'Milestones tied to measurable business signals.' },
                { title: 'Operational safety', detail: 'Security, backups, and release hygiene baked in.' },
                { title: 'Velocity without chaos', detail: 'Structured communication and predictable cadence.' },
                { title: 'Long-term maintainability', detail: 'Documentation, handover, and support pathways.' },
              ].map((c) => (
                <div key={c.title} className="rounded-3xl border border-black/10 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none">
                  <p className="text-sm font-semibold text-brand-text dark:text-white">{c.title}</p>
                  <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Delivery timeline</p>
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex min-w-[720px] gap-4">
                {[
                  { t: 'Week 0–1', d: 'Discovery workshops + success metrics' },
                  { t: 'Week 2–4', d: 'UX + architecture + phased plan' },
                  { t: 'Week 5+', d: 'Iterative build, QA, release readiness' },
                  { t: 'Post-launch', d: 'Monitoring, tuning, enablement' },
                ].map((x) => (
                  <div key={x.t} className="min-w-[220px] flex-1 rounded-2xl border border-black/10 bg-brand-background p-4 dark:border-white/10 dark:bg-brand-night/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">{x.t}</p>
                    <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{x.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Testimonials</p>
                <h3 className="mt-2 text-2xl font-semibold text-brand-text dark:text-white">What partners say</h3>
              </div>
            </div>

            <div className="mt-6">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={18}
                slidesPerView={1}
                autoplay={{ delay: 5200, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1280: { slidesPerView: 3 },
                }}
              >
                {TESTIMONIALS.map((t) => (
                  <SwiperSlide key={t.id}>
                    <figure className="h-full rounded-3xl border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none">
                      <blockquote className="text-sm leading-relaxed text-brand-text/80 dark:text-white/75">“{t.quote}”</blockquote>
                      <figcaption className="mt-4 text-sm font-semibold text-brand-text dark:text-white">
                        {t.name}
                        <span className="mt-1 block text-xs font-medium text-brand-text/60 dark:text-white/55">{t.org}</span>
                      </figcaption>
                    </figure>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <section id="updates" className="border-t border-black/5 bg-brand-background-alt py-16 dark:border-white/10 dark:bg-brand-night">
        <div className="app-container grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Blog / updates</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white">Latest announcements</h2>
            <div className="mt-6 space-y-4">
              {announcements.length === 0 && (
                <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none">
                  <p className="text-sm text-brand-text/70 dark:text-white/65">No announcements yet.</p>
                </article>
              )}
              {announcements.map((item) => (
                <article key={item.id} className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none">
                  <p className="text-sm font-semibold text-brand-text dark:text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{item.content}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Newsletter</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-brand-text dark:text-white">Lead magnet: stay ahead of releases</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-text/75 dark:text-white/70">
              Subscribe for service updates, security advisories (when applicable), and new engagement opportunities.
            </p>

            <form className="mt-6 space-y-3" onSubmit={subscribeNewsletter}>
              <input
                type="text"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-night/40 dark:text-white"
              />
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-night/40 dark:text-white"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
              >
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {newsletterMessage && <p className="mt-3 text-sm text-brand-text/80 dark:text-white/70">{newsletterMessage}</p>}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-black/5 bg-brand-background py-16 dark:border-white/10 dark:bg-brand-night">
        <div className="app-container grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Contact</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Let’s engineer your next release</h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-text/75 dark:text-white/70">
                Use the guided inquiry form, connect instantly, or open the on-site AI assistant for quick triage.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="https://wa.me/639190675099"
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-black/10 bg-white p-5 text-sm font-semibold text-brand-text shadow-soft transition hover:border-brand-primary/35 dark:border-white/10 dark:bg-brand-navy/35 dark:text-white dark:shadow-none"
              >
                WhatsApp quick connect
                <span className="mt-2 block text-xs font-medium text-brand-text/65 dark:text-white/60">Fast questions and scheduling.</span>
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('agc:open-chat'))}
                className="rounded-3xl border border-black/10 bg-white p-5 text-left text-sm font-semibold text-brand-text shadow-soft transition hover:border-brand-primary/35 dark:border-white/10 dark:bg-brand-navy/35 dark:text-white dark:shadow-none"
              >
                Live support (AI + team)
                <span className="mt-2 block text-xs font-medium text-brand-text/65 dark:text-white/60">Opens the chat widget when available.</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.362567785193!2d125.61011187581853!3d7.083899416395804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96da651e42635%3A0x5bd7a84c2784dcf!2sAmalgated%20Capital%2C%20Inc.!5e0!3m2!1sen!2sph!4v1775802797539!5m2!1sen!2sph"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Amalgated Capital location map"
                className="h-[280px] w-full grayscale contrast-125 sm:h-[320px] dark:invert dark:filter"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-text dark:text-white">Project inquiry</p>
              <p className="text-xs font-semibold text-brand-text/60 dark:text-white/55">Step {contactStep} of 3</p>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-background dark:bg-brand-night/40" aria-hidden>
              <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-gold" style={{ width: `${(contactStep / 3) * 100}%` }} />
            </div>

            {contactStep === 1 && (
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-name">
                  Full name
                </label>
                <input
                  id="inquiry-name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-night/40 dark:text-white"
                  autoComplete="name"
                />
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-email">
                  Work email
                </label>
                <input
                  id="inquiry-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-night/40 dark:text-white"
                  autoComplete="email"
                />
                <button
                  type="button"
                  className="mt-2 w-full rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
                  onClick={() => {
                    if (!contactName.trim() || !contactEmail.trim()) {
                      setContactMessageText('Please add your name and email to continue.')
                      return
                    }
                    setContactMessageText('')
                    setContactStep(2)
                  }}
                >
                  Continue
                </button>
              </div>
            )}

            {contactStep === 2 && (
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-company">
                  Company (optional)
                </label>
                <input
                  id="inquiry-company"
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.target.value)}
                  className="w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-night/40 dark:text-white"
                  autoComplete="organization"
                />
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-phone">
                  Phone (optional)
                </label>
                <input
                  id="inquiry-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-night/40 dark:text-white"
                  autoComplete="tel"
                />
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-interest">
                  Primary interest
                </label>
                <select
                  id="inquiry-interest"
                  value={contactInterest}
                  onChange={(e) => setContactInterest(e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-night/40 dark:bg-brand-night dark:text-white"
                >
                  <option value="it">IT solutions / systems</option>
                  <option value="dev">Software development</option>
                  <option value="biz">Business automation</option>
                  <option value="sec">Security &amp; maintenance</option>
                  <option value="ai">AI assistants / chatbots</option>
                </select>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-brand-text/80 transition hover:border-brand-primary/35 dark:border-white/10 dark:text-white/75"
                    onClick={() => setContactStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
                    onClick={() => setContactStep(3)}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {contactStep === 3 && (
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-message">
                  Project details
                </label>
                <textarea
                  id="inquiry-message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-night/40 dark:text-white"
                  placeholder="Goals, timelines, integrations, compliance needs…"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-brand-text/80 transition hover:border-brand-primary/35 dark:border-white/10 dark:text-white/75"
                    onClick={() => setContactStep(2)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={contactLoading}
                    className="w-full rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
                    onClick={submitInquiry}
                  >
                    {contactLoading ? 'Sending…' : 'Submit inquiry'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-dashed border-black/15 p-4 text-xs text-brand-text/70 dark:border-white/10 dark:text-white/60">
              <p className="font-semibold text-brand-text dark:text-white">Consultation booking</p>
              <p className="mt-2">
                Prefer a calendar hold? Email <a className="underline" href="mailto:agc.billing2026@gmail.com">agc.billing2026@gmail.com</a> with your
                timezone and preferred windows.
              </p>
            </div>

            {contactMessageText && <p className="mt-4 text-sm text-brand-text/80 dark:text-white/70">{contactMessageText}</p>}
          </div>
        </div>
      </section>

      {portfolioModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Case study: ${portfolioModal.title}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPortfolioModalId(null)
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl border border-white/10 bg-white p-6 shadow-2xl dark:bg-brand-navy">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Case preview</p>
                <h3 className="mt-2 text-2xl font-semibold text-brand-text dark:text-white">{portfolioModal.title}</h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-semibold text-brand-text/70 hover:border-brand-primary/40 dark:border-white/10 dark:text-white/70"
                onClick={() => setPortfolioModalId(null)}
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm text-brand-text/75 dark:text-white/70">{portfolioModal.outcome}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-brand-background p-4 dark:border-white/10 dark:bg-brand-night/40">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">Before</p>
                <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{portfolioModal.before}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-brand-background p-4 dark:border-white/10 dark:bg-brand-night/40">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">After</p>
                <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{portfolioModal.after}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {portfolioModal.tags.map((t) => (
                <span key={t} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-text/80 dark:bg-brand-primary/15 dark:text-white/80">
                  {t}
                </span>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
              onClick={() => setPortfolioModalId(null)}
            >
              Discuss a similar build
            </a>
          </div>
        </div>
      )}

      <ChatWidget />
    </main>
  )
}
