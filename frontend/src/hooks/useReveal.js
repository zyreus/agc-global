import { useEffect, useRef, useState } from 'react'

/**
 * @param {{ once?: boolean; threshold?: number; rootMargin?: string }} [options]
 */
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisible(true)
        if (options.once !== false) obs.disconnect()
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -6% 0px',
      }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [options.once, options.threshold, options.rootMargin])

  return [ref, visible]
}
