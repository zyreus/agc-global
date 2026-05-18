export default function CtaBanner({ headline, subline, primaryHref = '#contact', primaryLabel, secondaryHref, secondaryLabel, variant = 'dark' }) {
  const isDark = variant === 'dark'

  return (
    <section className={isDark ? 'cta-section-dark relative overflow-hidden' : 'page-section-compact'}>
      {isDark && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,140,26,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        </div>
      )}
      <div className="app-container relative text-center">
        <h2 className="type-h1 font-semibold tracking-tight">{headline}</h2>
        {subline && <p className="prose-width mx-auto mt-4 text-base text-white/80">{subline}</p>}
        <div className="btn-group mt-6 justify-center sm:mt-8">
          <a
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-3.5 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover hover:shadow-[0_4px_20px_rgba(255,140,26,0.4)]"
          >
            {primaryLabel}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          {secondaryLabel && secondaryHref && (
            <a
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-brand-gold/40 hover:bg-white/10"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
