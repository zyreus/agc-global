import { Link, Navigate, useParams } from 'react-router-dom'
import PageHero from '../../components/marketing/PageHero.jsx'
import SolutionsGridSection from '../../components/marketing/SolutionsGridSection.jsx'
import ServiceIcon from '../../components/marketing/ServiceIcon.jsx'
import { usePageMeta } from '../../hooks/usePageMeta.js'
import { getSolutionById, PAGE_META, PRIMARY_SOLUTION_IDS } from '../../data/siteContent.js'

export function SolutionsPage() {
  usePageMeta(PAGE_META.solutions)

  return (
    <main id="main-content" className="flex-1">
      <PageHero
        eyebrow="Solutions"
        title="Technology services for enterprise outcomes"
        description="Software development, network infrastructure, cloud, cybersecurity, automation, and IT consulting — focused delivery without duplicate company narrative."
      />
      <SolutionsGridSection ids={PRIMARY_SOLUTION_IDS} showHeader={false} detailPathPrefix="/solutions" />
    </main>
  )
}

export function SolutionDetailPage() {
  const { slug } = useParams()
  const solution = getSolutionById(slug)

  usePageMeta(
    solution
      ? { title: `${solution.title} | AGC Global`, description: solution.summary }
      : PAGE_META.solutions
  )

  if (!solution) return <Navigate to="/solutions" replace />

  return (
    <main id="main-content" className="flex-1">
      <PageHero eyebrow="Solution" title={solution.title} description={solution.summary} />
      <section className="page-section-compact">
        <div className="app-container grid gap-10 lg:grid-cols-[auto_1fr]">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/15">
            <ServiceIcon name={solution.icon} className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-brand-text dark:text-white">What we deliver</h2>
            <ul className="mt-4 space-y-2">
              {solution.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-brand-text/80 dark:text-white/75">
                  <span className="text-brand-primary">✓</span> {h}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary mt-8 inline-flex">Discuss this solution</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
