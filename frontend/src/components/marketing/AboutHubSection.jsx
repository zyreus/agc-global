import { EXPERTISE_AREAS, MISSION_VISION, WHY_CHOOSE } from '../../data/marketingContent.js'
import { useReveal } from '../../hooks/useReveal.js'

export default function AboutHubSection() {
  const [ref, visible] = useReveal({ threshold: 0.15 })

  return (
    <section id="about" className="theme-section theme-border-t page-section-surface">
      <div className="app-container space-y-16">
        <div ref={ref} className={['reveal-up space-y-16', visible ? 'is-visible' : ''].join(' ')}>
          <div id="mission">
            <p className="theme-eyebrow">Mission &amp; Vision</p>
            <div className="section-block card-grid lg:grid-cols-2">
              <article className="theme-card p-8">
                <p className="theme-eyebrow text-[0.65rem]">{MISSION_VISION.mission.title}</p>
                <p className="theme-text mt-4 text-base leading-relaxed">{MISSION_VISION.mission.body}</p>
              </article>
              <article className="theme-card p-8">
                <p className="theme-eyebrow text-[0.65rem]">{MISSION_VISION.vision.title}</p>
                <p className="theme-text mt-4 text-base leading-relaxed">{MISSION_VISION.vision.body}</p>
              </article>
            </div>
          </div>

          <div>
            <p className="theme-eyebrow">Core values</p>
            <h2 className="theme-heading mt-3 text-2xl font-semibold sm:text-3xl">What guides our work</h2>
            <ul className="section-block grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MISSION_VISION.values.map((v) => (
                <li key={v.title} className="theme-card p-5">
                  <p className="theme-heading text-sm font-semibold">{v.title}</p>
                  <p className="theme-text mt-2 text-sm">{v.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="theme-eyebrow">Expertise</p>
            <h2 className="theme-heading mt-3 text-2xl font-semibold sm:text-3xl">Technology domains we excel in</h2>
            <ul className="section-block grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EXPERTISE_AREAS.map((area) => (
                <li key={area.title} className="theme-card p-5">
                  <p className="theme-heading text-sm font-semibold">{area.title}</p>
                  <p className="theme-text mt-2 text-sm leading-relaxed">{area.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {area.tags.map((tag) => (
                      <span key={tag} className="theme-chip text-[10px] font-semibold">{tag}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="theme-eyebrow">Why AGC</p>
            <h2 className="theme-heading mt-3 text-2xl font-semibold sm:text-3xl">Why organizations choose us</h2>
            <ul className="section-block grid list-none gap-4 sm:grid-cols-2">
              {WHY_CHOOSE.map((item) => (
                <li key={item.title} className="theme-card p-5">
                  <p className="theme-heading text-sm font-semibold">{item.title}</p>
                  <p className="theme-text mt-2 text-sm leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
