import { METRICS_STRIP } from '../../data/marketingContent.js'

export default function MetricsStrip() {
  return (
    <section className="border-b border-black/5 bg-white py-12 dark:border-white/10 dark:bg-brand-night/50">
      <div className="app-container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {METRICS_STRIP.map((m) => (
            <div key={m.label} className="metric-card lg:border-l lg:border-brand-primary/30 lg:pl-6">
              <p className="metric-value text-brand-primary">{m.value}</p>
              <p className="metric-label">{m.label}</p>
              <p className="mt-2 hidden text-xs text-brand-text/55 dark:text-white/50 lg:block">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
