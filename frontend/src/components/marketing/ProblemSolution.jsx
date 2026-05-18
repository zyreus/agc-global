import { PROBLEM_SECTION } from '../../data/marketingContent.js'

export default function ProblemSolution() {
  return (
    <section id="challenge" className="saas-section-alt">
      <div className="app-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="saas-headline text-brand-text dark:text-white">{PROBLEM_SECTION.headline}</h2>
          <p className="saas-subhead mx-auto">{PROBLEM_SECTION.subline}</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEM_SECTION.pains.map((pain) => (
            <article key={pain.title} className="pain-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 dark:bg-red-400/10 dark:text-red-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-brand-text dark:text-white">{pain.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-text/70 dark:text-white/65">{pain.detail}</p>
            </article>
          ))}
        </div>

        <div className="solution-panel mx-auto mt-16 max-w-4xl text-center">
          <h3 className="text-2xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-3xl">
            {PROBLEM_SECTION.solutionHeadline}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-brand-text/75 dark:text-white/70">{PROBLEM_SECTION.solutionSubline}</p>
          <a href="#products" className="btn-primary mt-8">
            See how AGC delivers
          </a>
        </div>
      </div>
    </section>
  )
}
