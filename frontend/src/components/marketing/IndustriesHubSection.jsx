import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal.js'
import { FEATURED_INDUSTRY_IDS, INDUSTRIES } from '../../data/siteContent.js'
import { SectionFooterLink } from './PageHero.jsx'

function IndustryCard({ industry, index }) {
  const [ref, visible] = useReveal({ threshold: 0.1 })

  return (
    <li>
      <Link
        ref={ref}
        to={`/industries/${industry.id}`}
        className={[
          'theme-card theme-card-interactive reveal-up block h-full p-6',
          visible ? 'is-visible' : '',
        ].join(' ')}
        style={{ transitionDelay: visible ? `${index * 60}ms` : undefined }}
      >
        <h3 className="theme-heading text-lg font-semibold">{industry.title}</h3>
        <p className="theme-text mt-2 line-clamp-3 text-sm leading-relaxed">{industry.overview}</p>
        <span className="mt-4 inline-flex text-sm font-semibold text-brand-primary">Learn more →</span>
      </Link>
    </li>
  )
}

export function IndustryHighlightsPreview({ viewAllHref = '/industries' }) {
  const [headerRef, visible] = useReveal({ threshold: 0.15 })
  const industries = INDUSTRIES.filter((i) => FEATURED_INDUSTRY_IDS.includes(i.id))

  return (
    <section className="theme-section-alt theme-border-t page-section-alt" aria-labelledby="industries-preview-heading">
      <div className="app-container">
        <div ref={headerRef} className={['reveal-up mx-auto max-w-3xl text-center', visible ? 'is-visible' : ''].join(' ')}>
          <p className="theme-eyebrow">Industries</p>
          <h2 id="industries-preview-heading" className="theme-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Industries we serve
          </h2>
        </div>
        <ul className="section-block grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, idx) => (
            <IndustryCard key={ind.id} industry={ind} index={idx} />
          ))}
        </ul>
        {viewAllHref && <SectionFooterLink to={viewAllHref} label="View all industries" />}
      </div>
    </section>
  )
}

export function IndustriesGrid() {
  return (
    <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {INDUSTRIES.map((ind, idx) => (
        <IndustryCard key={ind.id} industry={ind} index={idx} />
      ))}
    </ul>
  )
}

export default IndustryHighlightsPreview
