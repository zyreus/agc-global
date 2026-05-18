import { useState } from 'react'
import { SERVICE_SOLUTIONS } from '../../data/marketingContent.js'

export default function SolutionsSection() {
  const [activeId, setActiveId] = useState(SERVICE_SOLUTIONS[0]?.id ?? '')
  const active = SERVICE_SOLUTIONS.find((s) => s.id === activeId) ?? SERVICE_SOLUTIONS[0]

  return (
    <section id="solutions" className="saas-section border-t border-black/5 dark:border-white/10">
      <div className="app-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Solutions</p>
          <h2 className="saas-headline text-brand-text dark:text-white">Enterprise services built for outcomes</h2>
          <p className="saas-subhead mx-auto">
            Seven solution tracks — each designed around the problems you face, the features you need, and the industries you serve.
          </p>
        </div>

        <div className="section-content-gap flex flex-wrap justify-center gap-2">
          {SERVICE_SOLUTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={[activeId === s.id ? 'feature-tab feature-tab-active' : 'feature-tab feature-tab-inactive'].join(' ')}
            >
              {s.title}
            </button>
          ))}
        </div>

        {active && (
          <div className="solution-panel mt-8 sm:mt-10">
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">Problem</p>
                <p className="mt-3 text-sm leading-relaxed text-brand-text/80 dark:text-white/75">{active.problem}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary">Key features</p>
                <ul className="mt-3 space-y-2">
                  {active.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-brand-text/80 dark:text-white/75">
                      <span className="text-brand-primary">→</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Benefits</p>
                <ul className="mt-3 space-y-2">
                  {active.benefits.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-brand-text/80 dark:text-white/75">
                      <span className="text-emerald-500">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/8 pt-6 dark:border-white/10">
              <div className="flex flex-wrap gap-2">
                {active.industries.map((ind) => (
                  <span key={ind} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-text/80 dark:text-white/80">
                    {ind}
                  </span>
                ))}
              </div>
              <a href="#contact" className="btn-primary shrink-0">
                Discuss {active.title}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
