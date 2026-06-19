import { Link } from 'react-router-dom'
import LazyImage from '../LazyImage.jsx'
import { getCategoryLabel, getRelatedProjects } from '../../data/portfolioContent.js'

export default function PortfolioCaseStudyLayout({ project }) {
  const category = getCategoryLabel(project.categoryId)
  const related = getRelatedProjects(project.id)

  return (
    <>
      <section className="theme-hero">
        <div className="app-container page-section-compact">
          <p className="theme-eyebrow">{category}</p>
          <h1 className="theme-heading mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
          {project.client && <p className="theme-text mt-2 text-sm font-medium">Client: {project.client}</p>}
          <p className="theme-text mt-4 max-w-2xl text-base leading-relaxed">{project.shortDescription}</p>
        </div>
      </section>

      <section className="theme-section page-section-compact">
        <div className="app-container">
          <div className={`theme-card overflow-hidden rounded-3xl bg-gradient-to-br ${project.gradient}`}>
            <LazyImage src={project.image} alt={project.imageAlt ?? project.name} className="w-full object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="theme-section theme-border-t page-section-compact">
        <div className="app-container grid gap-8 lg:grid-cols-2">
          <article className="theme-card p-6 sm:p-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 dark:text-red-400">Business challenge</h2>
            <p className="theme-text mt-4 text-base leading-relaxed">{project.challenge}</p>
          </article>
          <article className="theme-card p-6 sm:p-8">
            <h2 className="theme-eyebrow text-[0.65rem]">Solution delivered</h2>
            <p className="theme-text mt-4 text-base leading-relaxed">{project.solution}</p>
          </article>
        </div>
      </section>

      <section className="theme-section page-section-compact">
        <div className="app-container grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="theme-heading text-xl font-semibold">Technologies used</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <li key={t} className="theme-chip text-sm font-semibold">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="theme-heading text-xl font-semibold">Key features</h2>
            <ul className="mt-4 space-y-2">
              {project.keyFeatures.map((f) => (
                <li key={f} className="theme-text flex gap-2 text-sm">
                  <span className="text-brand-primary">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="theme-section theme-border-t page-section-compact">
        <div className="app-container">
          <h2 className="theme-heading text-xl font-semibold">Results &amp; impact</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {project.businessImpact.map((impact) => (
              <li key={impact} className="theme-card theme-text p-5 text-sm leading-relaxed">{impact}</li>
            ))}
          </ul>
          <Link to="/contact" className="btn-primary mt-10 inline-flex">Discuss a similar project</Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="theme-section-alt theme-border-t page-section-compact">
          <div className="app-container">
            <h2 className="theme-heading text-xl font-semibold">Related case studies</h2>
            <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Link to={`/portfolio/${item.id}`} className="theme-card theme-card-interactive block overflow-hidden rounded-2xl">
                    <div className={`relative aspect-[16/10] bg-gradient-to-br ${item.gradient}`}>
                      <LazyImage src={item.image} alt={item.imageAlt ?? item.name} className="absolute inset-0 h-full w-full object-cover object-top" />
                    </div>
                    <div className="p-5">
                      <p className="theme-heading text-sm font-semibold">{item.name}</p>
                      <p className="theme-text mt-1 line-clamp-2 text-xs">{item.shortDescription}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/portfolio" className="theme-btn-outline mt-8 inline-flex">View all projects</Link>
          </div>
        </section>
      )}
    </>
  )
}
