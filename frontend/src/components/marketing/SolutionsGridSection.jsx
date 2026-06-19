import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal.js'
import { SOLUTIONS_CATALOG } from '../../data/siteContent.js'
import ServiceIcon from './ServiceIcon.jsx'
import { SectionFooterLink } from './PageHero.jsx'

function SolutionCard({ item, index, detailPathPrefix }) {
  const [ref, visible] = useReveal({ threshold: 0.1 })
  const delay = index * 70
  const detailTo = detailPathPrefix ? `${detailPathPrefix}/${item.id}` : '/contact'

  return (
    <article
      ref={ref}
      className={[
        'theme-card theme-card-interactive group reveal-up flex h-full flex-col rounded-2xl p-6 sm:rounded-3xl',
        visible ? 'is-visible' : '',
      ].join(' ')}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/20 transition group-hover:bg-brand-primary group-hover:text-white">
        <ServiceIcon name={item.icon} className="h-6 w-6" />
      </div>
      <h3 className="theme-heading mt-5 text-lg font-semibold">{item.title}</h3>
      <p className="theme-text mt-2 flex-1 text-sm leading-relaxed">{item.summary}</p>
      <ul className="mt-4 space-y-1.5">
        {item.highlights.slice(0, 3).map((h) => (
          <li key={h} className="theme-muted flex gap-2 text-xs">
            <span className="text-brand-primary">→</span>
            {h}
          </li>
        ))}
      </ul>
      <Link to={detailTo} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:gap-3">
        Learn more
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </article>
  )
}

export default function SolutionsGridSection({ limit, ids, viewAllHref, detailPathPrefix = '/solutions', showHeader = true }) {
  const [headerRef, headerVisible] = useReveal({ threshold: 0.2 })

  const items = SOLUTIONS_CATALOG.filter((s) => (ids ? ids.includes(s.id) : true)).slice(0, limit ?? SOLUTIONS_CATALOG.length)

  return (
    <section id="solutions" className="theme-section-alt theme-border-t page-section" aria-labelledby="solutions-heading">
      <div className="app-container">
        {showHeader && (
          <div ref={headerRef} className={['reveal-up mx-auto max-w-3xl text-center', headerVisible ? 'is-visible' : ''].join(' ')}>
            <p className="theme-eyebrow">Solutions</p>
            <h2 id="solutions-heading" className="theme-heading saas-headline mt-3 font-semibold tracking-tight">
              Enterprise services built for outcomes
            </h2>
            <p className="saas-subhead mx-auto">
              Software, cloud, infrastructure, security, and automation — designed to solve real business problems.
            </p>
          </div>
        )}

        <ul className="section-block grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <li key={item.id}>
              <SolutionCard item={item} index={idx} detailPathPrefix={detailPathPrefix} />
            </li>
          ))}
        </ul>

        {viewAllHref && <SectionFooterLink to={viewAllHref} label="View all solutions" />}
      </div>
    </section>
  )
}
