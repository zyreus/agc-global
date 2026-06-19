import { Link } from 'react-router-dom'
import LazyImage from '../LazyImage.jsx'
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  filterPortfolioByCategory,
  getCategoryLabel,
  searchPortfolio,
} from '../../data/portfolioContent.js'
import { useMemo, useState } from 'react'
import { useReveal } from '../../hooks/useReveal.js'

function ProjectThumbnail({ project, className = '' }) {
  return (
    <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${project.gradient} ${className}`}>
      <LazyImage src={project.image} alt={project.imageAlt ?? project.name} className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-night/90 via-brand-night/30 to-transparent" aria-hidden />
    </div>
  )
}

function GridCard({ project, index }) {
  const [ref, visible] = useReveal({ threshold: 0.08 })
  const category = getCategoryLabel(project.categoryId)

  return (
    <li>
      <article
        ref={ref}
        className={['theme-card theme-card-interactive reveal-up flex h-full flex-col overflow-hidden rounded-2xl', visible ? 'is-visible' : ''].join(' ')}
        style={{ transitionDelay: visible ? `${index * 50}ms` : undefined }}
      >
        <Link to={`/portfolio/${project.id}`}>
          <ProjectThumbnail project={project} />
        </Link>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="theme-eyebrow text-[0.65rem]">{category}</p>
          <h3 className="theme-heading mt-1 text-lg font-semibold">
            <Link to={`/portfolio/${project.id}`} className="hover:text-brand-primary">{project.name}</Link>
          </h3>
          {project.client && <p className="theme-muted mt-1 text-xs">{project.client}</p>}
          <p className="theme-text mt-3 line-clamp-2 flex-1 text-sm">{project.shortDescription}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((t) => (
              <span key={t} className="theme-tag">{t}</span>
            ))}
          </div>
          <Link to={`/portfolio/${project.id}`} className="btn-primary mt-5 w-full text-center text-sm">View case study</Link>
        </div>
      </article>
    </li>
  )
}

function ListRow({ project }) {
  const category = getCategoryLabel(project.categoryId)
  return (
    <li>
      <article className="theme-card theme-card-interactive flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
        <Link to={`/portfolio/${project.id}`} className="block w-full shrink-0 sm:w-48">
          <ProjectThumbnail project={project} className="rounded-xl" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="theme-eyebrow text-[0.65rem]">{category}</p>
          <h3 className="theme-heading mt-1 text-lg font-semibold">{project.name}</h3>
          <p className="theme-text mt-2 text-sm">{project.shortDescription}</p>
        </div>
        <Link to={`/portfolio/${project.id}`} className="btn-primary shrink-0 text-sm sm:px-6">View case study</Link>
      </article>
    </li>
  )
}

export default function PortfolioHubSection() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const filtered = useMemo(() => {
    let list = PORTFOLIO_PROJECTS
    list = filterPortfolioByCategory(list, category)
    list = searchPortfolio(list, search)
    return list
  }, [category, search])

  return (
    <div className="theme-section app-container space-y-8 pb-16">
      <section aria-label="Portfolio filters">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="sr-only" htmlFor="portfolio-search">Search portfolio</label>
          <input
            id="portfolio-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, technologies, clients…"
            className="theme-search max-w-md"
          />
          <div className="flex gap-2" role="group" aria-label="View mode">
            <button type="button" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} className="theme-toggle-btn">Grid</button>
            <button type="button" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} className="theme-toggle-btn">List</button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className="theme-filter-btn"
              aria-pressed={category === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-live="polite">
        <p className="theme-muted mb-4 text-sm">
          {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length === 0 ? (
          <p className="theme-empty-state rounded-2xl p-10 text-center text-sm">
            No projects match your search. Try another keyword or category.
          </p>
        ) : viewMode === 'grid' ? (
          <ul className="grid list-none gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project, idx) => (
              <GridCard key={project.id} project={project} index={idx} />
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {filtered.map((project) => (
              <ListRow key={project.id} project={project} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
