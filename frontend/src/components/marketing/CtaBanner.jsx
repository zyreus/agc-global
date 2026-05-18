export default function CtaBanner({ headline, subline, primaryHref = '#contact', primaryLabel, secondaryHref, secondaryLabel, variant = 'dark' }) {
  const isDark = variant === 'dark'

  return (
    <section className={isDark ? 'relative overflow-hidden bg-brand-dark py-20 text-white sm:py-24' : 'py-16'}>
      {isDark && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,140,26,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        </div>
      )}
      <div className="app-container relative text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">{headline}</h2>
        {subline && <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">{subline}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
