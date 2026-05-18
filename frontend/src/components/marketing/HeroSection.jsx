import { useEffect, useState } from 'react'
import { COMPANY, HERO, PRODUCT_PILLARS } from '../../data/marketingContent.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

export default function HeroSection() {
  const reduced = usePrefersReducedMotion()
  const [wordIndex, setWordIndex] = useState(0)
  const words = HERO.rotatingWords

  useEffect(() => {
    if (reduced || words.length <= 1) return
    const id = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 3200)
    return () => clearInterval(id)
  }, [reduced, words.length])

  return (
    <section id="hero" className="relative overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute -left-20 top-0 h-[280px] w-[280px] rounded-full bg-brand-primary/20 blur-[80px] motion-safe:animate-blob sm:-left-32 sm:h-[400px] sm:w-[400px] sm:blur-[100px]" />
        <div className="absolute -right-16 top-16 h-[220px] w-[220px] rounded-full bg-brand-gold/10 blur-[60px] motion-safe:animate-blob motion-safe:[animation-delay:-4s] sm:-right-32 sm:top-20 sm:h-[400px] sm:w-[400px] sm:blur-[80px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/95 to-brand-night" />
      </div>

      <div className="app-container hero-inner relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="saas-headline text-white">
            {HERO.headline}
            <span className="mt-2 block text-brand-primary">{HERO.headlineAccent}</span>
          </h1>
          {!reduced && words.length > 0 && (
            <p className="mt-4 h-8 text-lg font-medium text-white/70 sm:text-xl" aria-live="polite">
              <span className="text-brand-gold">{words[wordIndex]}</span>
            </p>
          )}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{HERO.subline}</p>

          <div className="btn-group mt-8 justify-center sm:mt-10">
            <a href="#contact" className="btn-cta-dark rounded-full px-8">
              {HERO.ctaPrimary}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="#solutions" className="btn-secondary rounded-full px-8">
              {HERO.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl sm:mt-12 lg:mt-14">
          <div className="dashboard-frame p-1 sm:p-2">
            <div className="rounded-xl bg-brand-night/80 p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/50">AGC Command Center</p>
                  <p className="text-sm font-semibold text-white">Enterprise delivery overview</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                  All systems operational
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PRODUCT_PILLARS.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-primary/40 hover:bg-white/8"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold">{p.label}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{p.title}</p>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/60">{p.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-black/30 px-3 py-2 text-[11px] text-white/50">
                <span className="h-2 w-2 animate-pulse-glow rounded-full bg-brand-primary" />
                {COMPANY.shortName} · Laravel · React · Cloud-ready · CRM-integrated
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative -mt-px h-12 w-full overflow-hidden sm:h-14" aria-hidden>
        <svg className="h-full w-full text-brand-background dark:text-brand-night" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="currentColor" d="M0 40 C 360 80, 720 0, 1080 40 S 1440 80, 1440 40 L 1440 80 L 0 80 Z" />
        </svg>
      </div>
    </section>
  )
}
