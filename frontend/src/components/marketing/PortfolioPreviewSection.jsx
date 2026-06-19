import { Link } from 'react-router-dom'
import LazyImage from '../LazyImage.jsx'
import { getHomepagePortfolio } from '../../data/portfolioContent.js'
import { useReveal } from '../../hooks/useReveal.js'
import { SectionFooterLink } from './PageHero.jsx'

function PreviewCard({ project, index }) {
  const [ref, visible] = useReveal({ threshold: 0.1 })

  return (
    <li>
      <article
        ref={ref}
        className={[
          'theme-card theme-card-interactive reveal-up flex h-full flex-col overflow-hidden rounded-2xl',
          visible ? 'is-visible' : '',
        ].join(' ')}
        style={{ transitionDelay: visible ? `${index * 80}ms` : undefined }}
      >
        <Link to={`/portfolio/${project.id}`} className="block">
          <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${project.gradient}`}>
            <LazyImage src={project.image} alt={project.imageAlt ?? project.name} className="absolute inset-0 h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-night/85 via-brand-night/20 to-transparent" aria-hidden />
          </div>
        </Link>
        <div className="flex flex-1 flex-col p-6">
          <p className="theme-eyebrow text-[0.65rem]">{project.client}</p>
          <h3 className="theme-heading mt-1 text-lg font-semibold">
            <Link to={`/portfolio/${project.id}`} className="hover:text-brand-primary">{project.name}</Link>
          </h3>
          <p className="theme-text mt-2 flex-1 text-sm leading-relaxed">{project.shortDescription}</p>
          <Link to={`/portfolio/${project.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
            View case study
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </article>
    </li>
  )
}

export default function PortfolioPreviewSection() {
  const [headerRef, visible] = useReveal({ threshold: 0.15 })
  const projects = getHomepagePortfolio()

  return (
    <section id="portfolio" className="theme-section-alt theme-border-t page-section-alt" aria-labelledby="portfolio-preview-heading">
      <div className="app-container">
        <div ref={headerRef} className={['reveal-up mx-auto max-w-3xl text-center', visible ? 'is-visible' : ''].join(' ')}>
          <p className="theme-eyebrow">Portfolio</p>
          <h2 id="portfolio-preview-heading" className="theme-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Real solutions, measurable impact
          </h2>
          <p className="theme-text mt-4 text-base leading-relaxed">
            Selected implementations across lending, HRIS, enterprise systems, and digital platforms.
          </p>
        </div>

        <ul className="section-block grid list-none gap-6 md:grid-cols-3">
          {projects.map((project, idx) => (
            <PreviewCard key={project.id} project={project} index={idx} />
          ))}
        </ul>

        <SectionFooterLink to="/portfolio" label="View portfolio" />
      </div>
    </section>
  )
}
