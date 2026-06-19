import { PARTNER_LABELS } from '../../data/marketingContent.js'
import { useReveal } from '../../hooks/useReveal.js'

export default function TrustedBySection() {
  const [ref, visible] = useReveal({ threshold: 0.15 })

  return (
    <section
      id="trusted-by"
      className="page-section-tight border-b border-black/5 bg-brand-background dark:border-white/10 dark:bg-brand-night"
      aria-labelledby="trusted-by-heading"
    >
      <div className="app-container">
        <div
          ref={ref}
          className={['reveal-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', visible ? 'is-visible' : ''].join(' ')}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Trusted by clients</p>
            <h2 id="trusted-by-heading" className="mt-2 text-xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-2xl">
              Built for regulated, high-stakes environments
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-brand-text/70 dark:text-white/65">
            Representative sectors we design for — from compliance-heavy workflows to customer-facing digital products.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/5 bg-white/70 py-4 shadow-soft dark:border-white/10 dark:bg-white/5">
          <div className="flex w-max gap-10 px-6 motion-safe:animate-marquee">
            {[...PARTNER_LABELS, ...PARTNER_LABELS].map((label, idx) => (
              <div
                key={`${label}-${idx}`}
                className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold text-brand-text/70 dark:text-white/70"
              >
                <span className="h-2 w-2 rounded-full bg-brand-primary" aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
