import { CASE_STUDY_METRICS } from '../../data/marketingContent.js'

export default function CaseStudyMetrics() {
  return (
    <section className="section-band-y border-y border-black/5 bg-brand-dark text-white dark:border-white/10">
      <div className="app-container">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">Customer outcomes</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CASE_STUDY_METRICS.map((c) => (
            <div key={c.product} className="text-center">
              <p className="text-3xl font-semibold text-brand-primary sm:text-4xl">{c.metric}</p>
              <p className="mt-1 text-sm text-white/70">{c.label}</p>
              <p className="mt-2 text-xs font-medium text-white/50">{c.product}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
