import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import LazyImage from '../LazyImage.jsx'
import { PORTFOLIO_ITEMS } from '../../data/marketingContent.js'
import { PORTFOLIO_CATEGORIES, PORTFOLIO_CATEGORY_MAP } from '../../data/siteContent.js'
import { useReveal } from '../../hooks/useReveal.js'
import { SectionFooterLink } from './PageHero.jsx'

export default function PortfolioShowcaseSection({ limit, viewAllHref, showHeader = true }) {
  const [filter, setFilter] = useState('all')
  const [modalId, setModalId] = useState(null)
  const [headerRef, headerVisible] = useReveal({ threshold: 0.15 })

  const enriched = useMemo(
    () =>
      PORTFOLIO_ITEMS.map((item) => ({
        ...item,
        showcaseCategory: PORTFOLIO_CATEGORY_MAP[item.id] ?? 'corporate',
        clientName: item.subtitle,
        industry: PORTFOLIO_CATEGORIES.find((c) => c.id === (PORTFOLIO_CATEGORY_MAP[item.id] ?? 'corporate'))?.label ?? 'Corporate',
      })),
    []
  )

  const filtered = useMemo(() => {
    let list = filter === 'all' ? enriched : enriched.filter((p) => p.showcaseCategory === filter)
    if (limit) list = list.slice(0, limit)
    return list
  }, [enriched, filter, limit])

  const modal = useMemo(() => enriched.find((p) => p.id === modalId) ?? null, [enriched, modalId])

  useEffect(() => {
    if (!modalId) return
    const onKey = (e) => {
      if (e.key === 'Escape') setModalId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalId])

  return (
    <section id="portfolio" className="page-section-alt border-t border-black/5 dark:border-white/10" aria-labelledby="portfolio-heading">
      <div className="app-container">
        <div ref={headerRef} className={['reveal-up', headerVisible ? 'is-visible' : ''].join(' ')}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {showHeader && (
                <>
                  <p className="section-eyebrow">Portfolio</p>
                  <h2 id="portfolio-heading" className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">
                    Project showcase
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-brand-text/75 dark:text-white/70">
                    Flagship solutions across lending, property, HRIS, enterprise operations, and AI-powered support.
                  </p>
                </>
              )}
            </div>
            {!limit && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter portfolio by industry">
                {PORTFOLIO_CATEGORIES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={filter === f.id}
                    className={[
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm',
                      filter === f.id
                        ? 'bg-brand-primary text-white'
                        : 'border border-black/10 bg-white text-brand-text/75 hover:border-brand-primary/35 dark:border-white/10 dark:bg-brand-navy/35 dark:text-white/70',
                    ].join(' ')}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <ul className="section-block grid list-none gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, idx) => (
            <li key={item.id}>
              <PortfolioCard item={item} index={idx} onOpen={() => setModalId(item.id)} />
            </li>
          ))}
        </ul>

        {viewAllHref && <SectionFooterLink to={viewAllHref} label="View full portfolio" />}
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalId(null)
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl border border-white/10 bg-white p-6 shadow-2xl dark:bg-brand-navy">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">{modal.industry}</p>
                <h3 id="portfolio-modal-title" className="mt-2 text-2xl font-semibold text-brand-text dark:text-white">
                  {modal.title}
                </h3>
                <p className="text-sm text-brand-text/60 dark:text-white/55">{modal.clientName}</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-semibold"
                onClick={() => setModalId(null)}
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-sm text-brand-text/75 dark:text-white/70">{modal.outcome}</p>
            {modal.tech && (
              <div className="mt-4 flex flex-wrap gap-2">
                {modal.tech.map((t) => (
                  <span key={t} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-brand-background p-4 dark:border-white/10 dark:bg-brand-night/40">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">Before</p>
                <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{modal.before}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-brand-background p-4 dark:border-white/10 dark:bg-brand-night/40">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">After</p>
                <p className="mt-2 text-sm text-brand-text/75 dark:text-white/70">{modal.after}</p>
              </div>
            </div>
            <Link to="/contact" className="btn-primary mt-6 w-full text-center" onClick={() => setModalId(null)}>
              Start a similar project
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

function PortfolioCard({ item, index, onOpen }) {
  const [ref, visible] = useReveal({ threshold: 0.1 })

  return (
    <article
      ref={ref}
      className={[
        'reveal-up glass-card overflow-hidden p-0 transition hover:-translate-y-1',
        visible ? 'is-visible' : '',
      ].join(' ')}
      style={{ transitionDelay: visible ? `${index * 60}ms` : undefined }}
    >
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className={`portfolio-mockup bg-gradient-to-br ${item.gradient}`}>
          {item.image ? (
            <>
              <LazyImage src={item.image} alt={item.imageAlt ?? item.title} className="absolute inset-0 h-full w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent" aria-hidden />
            </>
          ) : null}
          <div className="relative z-10 flex h-full items-end p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{item.clientName}</p>
              <p className="text-lg font-semibold text-white">{item.title}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-xs font-medium text-brand-primary">{item.industry}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(item.tech ?? item.tags).slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-brand-background px-2.5 py-0.5 text-[10px] font-semibold text-brand-text/70 dark:bg-brand-night/40 dark:text-white/70">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-brand-text/75 dark:text-white/70">{item.outcome}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brand-primary">
            View case study
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>
    </article>
  )
}
