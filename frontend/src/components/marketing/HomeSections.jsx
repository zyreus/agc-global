import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ABOUT_CONTENT, HERO_STATS, WHY_CHOOSE } from '../../data/marketingContent.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { useReveal } from '../../hooks/useReveal.js'

function StatCounter({ value, suffix, ariaLabel }) {
  const [ref, visible] = useReveal({ threshold: 0.35 })
  const reduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!visible) return
    if (reduced) {
      const id = requestAnimationFrame(() => setDisplay(value))
      return () => cancelAnimationFrame(id)
    }
    const start = performance.now()
    const duration = 1200
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [visible, reduced, value])

  return (
    <span ref={ref} className="theme-heading" aria-label={ariaLabel}>
      {display}
      {suffix}
    </span>
  )
}
export function HomeCompanyOverview() {
  const [ref, visible] = useReveal({ threshold: 0.15 })

  return (
    <section className="theme-section theme-border-t page-section-surface" aria-labelledby="overview-heading">
      <div className="app-container">
        <div ref={ref} className={['reveal-up mx-auto max-w-3xl text-center', visible ? 'is-visible' : ''].join(' ')}>
          <p className="theme-eyebrow">About AGC</p>
          <h2 id="overview-heading" className="theme-heading mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Engineering trust at enterprise scale
          </h2>
          <p className="theme-text mt-4 text-base leading-relaxed">{ABOUT_CONTENT.paragraphs[0]}</p>
          <Link to="/about" className="mt-6 inline-flex text-sm font-semibold text-brand-primary hover:underline">
            Learn more about us →
          </Link>
        </div>
        <ul className="section-block grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <li key={stat.label} className="theme-card p-5 text-center">
              <p className="text-2xl font-semibold">
                <StatCounter value={stat.value} suffix={stat.suffix} ariaLabel={stat.ariaLabel} />
              </p>
              <p className="theme-heading mt-1 text-xs font-medium">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function HomeWhyChoose() {
  const [ref, visible] = useReveal({ threshold: 0.15 })

  return (
    <section className="theme-section theme-border-t page-section" aria-labelledby="why-heading">
      <div className="app-container">
        <div ref={ref} className={['reveal-up mx-auto max-w-3xl text-center', visible ? 'is-visible' : ''].join(' ')}>
          <p className="theme-eyebrow">Why AGC</p>
          <h2 id="why-heading" className="theme-heading saas-headline font-semibold tracking-tight">
            Why organizations choose us
          </h2>
        </div>
        <ul className="section-block grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.slice(0, 3).map((item) => (
            <li key={item.title} className="theme-card p-5">
              <p className="theme-heading text-sm font-semibold">{item.title}</p>
              <p className="theme-text mt-2 text-sm leading-relaxed">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function HomeCtaSection() {
  return (
    <section className="cta-section-dark relative overflow-hidden theme-border-t border-white/10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.2),transparent_50%)]" />
      </div>
      <div className="app-container relative py-16 text-center sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ready to transform your operations?</h2>
        <p className="prose-width mx-auto mt-4 text-base text-white/80">
          Book a consultation with our product experts — we&apos;ll scope your goals and recommend the right solution path.
        </p>
        <div className="btn-group mt-8 justify-center">
          <Link to="/contact" className="theme-btn-primary px-8 py-3.5">
            Book a Consultation
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-brand-gold/40"
          >
            Explore Portfolio
          </Link>
        </div>
      </div>
    </section>
  )
}
