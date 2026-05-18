import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import ChatWidget from '../components/ChatWidget.jsx'
import { API_BASE_URL } from '../lib/config.js'
import { fetchPublicApi } from '../lib/publicApi.js'
import {
  ABOUT_CONTENT,
  COMPANY,
  CTA_BLOCKS,
  DELIVERY_TIMELINE,
  EXPERTISE_AREAS,
  FAQ_ITEMS,
  HERO_STATS,
  INDUSTRY_SOLUTIONS,
  MISSION_VISION,
  PARTNER_LABELS,
  PORTFOLIO_ITEMS,
  PROCESS_STEPS,
  SERVICE_CATEGORIES,
  TESTIMONIALS,
  WHY_CHOOSE,
} from '../data/marketingContent.js'
import CtaBanner from '../components/marketing/CtaBanner.jsx'
import HeroSection from '../components/marketing/HeroSection.jsx'
import MetricsStrip from '../components/marketing/MetricsStrip.jsx'
import ProblemSolution from '../components/marketing/ProblemSolution.jsx'
import ProductShowcase from '../components/marketing/ProductShowcase.jsx'
import IntegrationsSection from '../components/marketing/IntegrationsSection.jsx'
import SolutionsSection from '../components/marketing/SolutionsSection.jsx'
import CaseStudyMetrics from '../components/marketing/CaseStudyMetrics.jsx'
import CareersNewsSection from '../components/marketing/CareersNewsSection.jsx'
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
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)
  const [announcementsError, setAnnouncementsError] = useState(false)
  const [expandedServiceId, setExpandedServiceId] = useState(null)
  const [openFaqId, setOpenFaqId] = useState(null)
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
      setAnnouncementsLoading(true)
      setAnnouncementsError(false)
      const result = await fetchPublicApi('/announcements')
      if (!cancelled) {
        setAnnouncements(result.ok ? result.data?.announcements ?? [] : [])
        setAnnouncementsError(!result.ok)
        setAnnouncementsLoading(false)
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
      name: COMPANY.name,
      alternateName: COMPANY.shortName,
      url: COMPANY.website,
      email: COMPANY.email,
      telephone: COMPANY.phone,
      slogan: COMPANY.slogan,
      areaServed: 'PH',
      knowsAbout: [
        'Custom software development',
        'Enterprise systems',
        'Cloud infrastructure',
        'Cybersecurity',
        'HRIS SmartDTR',
        'Business automation',
        'API integrations',
      ],
    }),
    []
  )

  useEffect(() => {
    const title = 'AGC | Enterprise Technology Solutions | Software, Cloud & Cybersecurity'
    if (document.title !== title) document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute(
      'content',
      'AGC Technologies delivers custom software, enterprise systems, cloud infrastructure, cybersecurity, HRIS SmartDTR, and business automation for organizations across the Philippines and beyond.'
    )

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [structuredData])

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
      setContactMessageText('Thanks ? your inquiry was received. Our team will follow up shortly.')
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
      <HeroSection />
      <MetricsStrip />
      <ProblemSolution />
      <ProductShowcase />
      <SolutionsSection />
      <IntegrationsSection />
      <CaseStudyMetrics />

      <section id="partners" className="page-section-tight border-b border-black/5 bg-brand-background dark:border-white/10 dark:bg-brand-night">
        <div className="app-container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Trusted focus areas</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-brand-text dark:text-white">Built for regulated, high-stakes environments</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-brand-text/70 dark:text-white/65">
              Representative sectors we design for ??????? from compliance-heavy workflows to customer-facing digital products.
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

      <section id="about" className="bg-brand-background page-section-surface">
        <div className="app-container card-grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">About AGC</p>
            <h2 className="text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">{ABOUT_CONTENT.headline}</h2>
            {ABOUT_CONTENT.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="text-base leading-relaxed text-brand-text/80 dark:text-white/75">
                {p}
              </p>
            ))}
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft dark:border-white/10 dark:bg-brand-navy/40 dark:shadow-none">
            <p className="text-sm font-semibold text-brand-text dark:text-white">Why organizations choose us</p>
            <ul className="mt-4 space-y-3 text-sm text-brand-text/75 dark:text-white/70">
              {ABOUT_CONTENT.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-primary" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="mission" className="page-section-alt border-t border-black/5 dark:border-white/10">
        <div className="app-container">
          <p className="section-eyebrow">Mission &amp; Vision</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Purpose-driven technology partnership</h2>
          <div className="section-block card-grid lg:grid-cols-2">
            <article className="glass-card p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">{MISSION_VISION.mission.title}</p>
              <p className="mt-4 text-base leading-relaxed text-brand-text/80 dark:text-white/75">{MISSION_VISION.mission.body}</p>
            </article>
            <article className="glass-card p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">{MISSION_VISION.vision.title}</p>
              <p className="mt-4 text-base leading-relaxed text-brand-text/80 dark:text-white/75">{MISSION_VISION.vision.body}</p>
            </article>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MISSION_VISION.values.map((v) => (
              <div key={v.title} className="enterprise-card p-5">
                <p className="text-sm font-semibold text-brand-text dark:text-white">{v.title}</p>
                <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{v.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="hidden page-section-alt border-t border-black/5 dark:border-white/10">
        <div className="app-container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Core services</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Nine pillars of enterprise delivery</h2>
              <p className="mt-3 text-base leading-relaxed text-brand-text/75 dark:text-white/70">
                From custom software and cloud infrastructure to HRIS SmartDTR and cybersecurity ??????? explore our full service portfolio.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover"
            >
              Book a consultation
            </a>
          </div>

          <div className="section-block card-grid sm:grid-cols-2 xl:grid-cols-3">
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

          <div className="section-block rounded-3xl border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none sm:p-8">
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

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Process workflow</p>
              <div className="mt-4 grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                {PROCESS_STEPS.map((step, idx) => (
                  <div
                    key={step.title}
                    className="relative flex h-full min-h-0 flex-col rounded-2xl border border-black/10 bg-brand-background p-4 dark:border-white/10 dark:bg-brand-night/40"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">Step {idx + 1}</p>
                    <p className="mt-2 text-sm font-semibold text-brand-text dark:text-white">{step.title}</p>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-brand-text/70 dark:text-white/65">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="page-section-surface border-t border-black/5 dark:border-white/10">
        <div className="app-container">
          <p className="section-eyebrow">Our expertise</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Deep technical capability across the stack</h2>
          <p className="mt-4 max-w-2xl text-base text-brand-text/75 dark:text-white/70">
            Laravel, React, cloud infrastructure, AI automation, and domain-specific platforms ??????? built for production, not prototypes.
          </p>
          <div className="section-block card-grid md:grid-cols-2 xl:grid-cols-3">
            {EXPERTISE_AREAS.map((area) => (
              <article key={area.title} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-brand-text dark:text-white">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-text/75 dark:text-white/70">{area.detail}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {area.tags.map((t) => (
                    <span key={t} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-text/80 dark:text-white/80">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="page-section-alt border-t border-black/5 dark:border-white/10">
        <div className="app-container">
          <p className="section-eyebrow">Industries we serve</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Specialized tracks for complex domains</h2>
          <div className="section-block card-grid md:grid-cols-2 xl:grid-cols-3">
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

      <section id="portfolio" className="page-section-alt border-t border-black/5 dark:border-white/10">
        <div className="app-container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Portfolio</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Web applications &amp; platforms we build</h2>
              <p className="mt-3 text-base leading-relaxed text-brand-text/75 dark:text-white/70">
                Flagship solutions across the Amalgated ecosystem ??????? lending, property, HRIS, and enterprise operations.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'platform', label: 'Platform' },
                { id: 'enterprise', label: 'Enterprise' },
                { id: 'lending', label: 'Lending' },
                { id: 'realestate', label: 'Real Estate' },
                { id: 'hris', label: 'HRIS' },
                { id: 'ai', label: 'AI' },
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

          <div className="section-block card-grid sm:grid-cols-2 xl:grid-cols-3">
            {filteredPortfolio.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPortfolioModalId(item.id)}
                className="glass-card overflow-hidden p-0 text-left"
              >
                <div className={`portfolio-mockup bg-gradient-to-br ${item.gradient} flex items-end p-5`}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{item.subtitle}</p>
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span key={t} className="rounded-full bg-brand-background px-3 py-1 text-[11px] font-semibold text-brand-text/70 dark:bg-brand-night/40 dark:text-white/70">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-brand-text/75 dark:text-white/70">{item.outcome}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brand-primary">
                    View case study
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="page-section-surface border-t border-black/5 dark:border-white/10">
        <div className="app-container section-stack-gap">
          <div className="trust-split">
            <div className="trust-split-copy">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Why choose AGC</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Trust is earned through delivery discipline</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-text/75 dark:text-white/70">
                We combine product thinking with engineering execution — so stakeholders see progress early and users feel the difference in day-to-day workflows.
              </p>
            </div>
            <div className="trust-split-cards">
              {WHY_CHOOSE.map((c) => (
                <div key={c.title} className="enterprise-card flex h-full min-h-0 flex-col">
                  <p className="text-sm font-semibold text-brand-text dark:text-white">{c.title}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-text/75 dark:text-white/70">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none sm:rounded-3xl sm:p-7 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Delivery timeline</p>
            <div className="mt-4 responsive-timeline sm:mt-5">
              {DELIVERY_TIMELINE.map((x) => (
                <div
                  key={x.phase}
                  className="flex h-full min-h-[5.5rem] flex-col rounded-2xl border border-black/10 bg-brand-background/90 p-4 dark:border-white/10 dark:bg-brand-night/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">{x.phase}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-text/75 dark:text-white/70">{x.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Testimonials</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-brand-text dark:text-white">What partners say</h3>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <Swiper
                className="testimonial-swiper !pb-10"
                modules={[Autoplay, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                autoplay={{ delay: 5200, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                  768: { slidesPerView: 2, spaceBetween: 18 },
                  1280: { slidesPerView: 3, spaceBetween: 20 },
                }}
              >
                {TESTIMONIALS.map((t) => (
                  <SwiperSlide key={t.id} className="!h-auto">
                    <figure className="flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_36px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-brand-navy/40 dark:shadow-none sm:rounded-3xl sm:p-6">
                      <blockquote className="text-sm leading-relaxed text-brand-text/80 dark:text-white/75">"{t.quote}"</blockquote>
                      <figcaption className="mt-5 border-t border-black/5 pt-4 text-sm font-semibold text-brand-text dark:border-white/10 dark:text-white">
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

      <section id="faq" className="page-section-alt border-t border-black/5 dark:border-white/10">
        <div className="app-container max-w-3xl">
          <p className="section-eyebrow">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-4 text-base text-brand-text/75 dark:text-white/70">Answers to common questions about our services, process, and partnership model.</p>
          <div className="mt-8 space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const id = `faq-${idx}`
              const open = openFaqId === id
              return (
                <div key={id} className="enterprise-card overflow-hidden p-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setOpenFaqId(open ? null : id)}
                    aria-expanded={open}
                  >
                    <span className="text-sm font-semibold text-brand-text dark:text-white">{item.q}</span>
                    <svg className={['h-5 w-5 shrink-0 text-brand-primary transition', open ? 'rotate-180' : ''].join(' ')} viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open && <p className="border-t border-black/5 px-5 pb-5 pt-0 text-sm leading-relaxed text-brand-text/75 dark:border-white/10 dark:text-white/70">{item.a}</p>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        headline={CTA_BLOCKS.primary.headline}
        subline={CTA_BLOCKS.primary.subline}
        primaryLabel={CTA_BLOCKS.primary.primaryLabel}
        secondaryHref="#portfolio"
        secondaryLabel={CTA_BLOCKS.primary.secondaryLabel}
      />

      <CareersNewsSection
        announcements={announcements}
        loading={announcementsLoading}
        error={announcementsError}
      />

      <section id="contact" className="page-section-surface border-t border-black/5 dark:border-white/10">
        <div className="app-container card-grid gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-x-12 lg:grid-rows-[auto_auto_auto_minmax(280px,1fr)] lg:items-stretch">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary lg:col-start-1 lg:row-start-1">
            Contact
          </p>

          <div className="lg:col-start-1 lg:row-start-2">
            <h2 className="text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">Talk to a product expert</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-text/75 dark:text-white/70">
              Use the guided inquiry form, connect instantly, or open the on-site AI assistant for quick triage.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-start-1 lg:row-start-3">
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

          <div className="flex min-h-[280px] flex-col lg:col-start-1 lg:row-start-4">
            <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-soft dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.362567785193!2d125.61011187581853!3d7.083899416395804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96da651e42635%3A0x5bd7a84c2784dcf!2sAmalgated%20Capital%2C%20Inc.!5e0!3m2!1sen!2sph!4v1775802797539!5m2!1sen!2sph"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Amalgated Capital location map"
                className="h-full min-h-[280px] w-full flex-1 grayscale contrast-125 dark:invert dark:filter"
              />
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-black/10 bg-white p-5 shadow-soft sm:p-8 dark:border-white/10 dark:bg-brand-navy/35 dark:shadow-none lg:col-start-2 lg:p-10 lg:row-start-2 lg:row-span-3 lg:h-full">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-text dark:text-white">Project inquiry</p>
              <p className="text-xs font-semibold text-brand-text/60 dark:text-white/55">Step {contactStep} of 3</p>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-background dark:bg-brand-night/40" aria-hidden>
              <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-gold" style={{ width: `${(contactStep / 3) * 100}%` }} />
            </div>

            {contactStep === 1 && (
              <div className="form-stack mt-8">
                <label className="form-label" htmlFor="inquiry-name">
                  Full name
                </label>
                <input
                  id="inquiry-name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="form-field"
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
                  className="form-field"
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
              <div className="form-stack mt-8">
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-company">
                  Company (optional)
                </label>
                <input
                  id="inquiry-company"
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.target.value)}
                  className="form-field"
                  autoComplete="organization"
                />
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-phone">
                  Phone (optional)
                </label>
                <input
                  id="inquiry-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="form-field"
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
                  <option value="custom-dev">Custom software development</option>
                  <option value="enterprise">Enterprise systems</option>
                  <option value="web-mobile">Web &amp; mobile applications</option>
                  <option value="cloud">Cloud infrastructure</option>
                  <option value="cyber">Cybersecurity</option>
                  <option value="hris">HRIS / SmartDTR</option>
                  <option value="automation">Business automation</option>
                  <option value="demo">Book a demo</option>
                  <option value="partnership">Corporate partnership</option>
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
              <div className="form-stack mt-8">
                <label className="block text-xs font-semibold text-brand-text/70 dark:text-white/60" htmlFor="inquiry-message">
                  Project details
                </label>
                <textarea
                  id="inquiry-message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={5}
                  className="form-field"
                  placeholder="Goals, timelines, integrations, compliance needs?"
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
                    {contactLoading ? 'Sending?' : 'Submit inquiry'}
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
            <p className="mt-1 text-sm text-brand-text/60 dark:text-white/55">{portfolioModal.subtitle}</p>
            <p className="mt-3 text-sm text-brand-text/75 dark:text-white/70">{portfolioModal.outcome}</p>
            {portfolioModal.tech && (
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolioModal.tech.map((t) => (
                  <span key={t} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-text/80 dark:text-white/80">
                    {t}
                  </span>
                ))}
              </div>
            )}

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
