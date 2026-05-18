import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { useReveal } from '../../hooks/useReveal.js'

export default function KpiCounter({ label, value, suffix, ariaLabel }) {
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
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:border-brand-primary/30 hover:bg-white/8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl" aria-label={ariaLabel}>
        {display}
        {suffix}
      </p>
    </div>
  )
}
