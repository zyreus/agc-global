import { useState } from 'react'
import { PRODUCT_PILLARS } from '../../data/marketingContent.js'

export default function ProductShowcase() {
  const [activeId, setActiveId] = useState(PRODUCT_PILLARS[0]?.id ?? '')
  const active = PRODUCT_PILLARS.find((p) => p.id === activeId) ?? PRODUCT_PILLARS[0]

  return (
    <section id="products" className="saas-section bg-brand-background dark:bg-brand-night">
      <div className="app-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Platform capabilities</p>
          <h2 className="saas-headline text-brand-text dark:text-white">Technology that powers smarter operations</h2>
          <p className="saas-subhead mx-auto">
            Explore the core pillars behind every AGC engagement — from unified dashboards to AI automation and secure integrations.
          </p>
        </div>

        <div className="section-content-gap flex flex-wrap justify-center gap-2">
          {PRODUCT_PILLARS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              className={[activeId === p.id ? 'feature-tab feature-tab-active' : 'feature-tab feature-tab-inactive'].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>

        {active && (
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-3xl">{active.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-brand-text/75 dark:text-white/70">{active.description}</p>
              <ul className="mt-6 space-y-3">
                {active.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-sm text-brand-text/80 dark:text-white/75">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="btn-primary mt-8">
                Get a Demo
              </a>
            </div>

            <div className="dashboard-frame rounded-2xl bg-brand-dark p-6 lg:p-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-[10px] text-white/40">{active.label} preview</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-widest text-brand-gold">{active.label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{active.title}</p>
                  <div className="mt-4 space-y-2">
                    {active.highlights.map((h) => (
                      <div key={h} className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-xs text-white/70">
                        <span>{h}</span>
                        <span className="text-emerald-400">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
