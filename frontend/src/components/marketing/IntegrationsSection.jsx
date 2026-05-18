import { INTEGRATIONS } from '../../data/marketingContent.js'

export default function IntegrationsSection() {
  return (
    <section id="integrations" className="saas-section-alt">
      <div className="app-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="section-eyebrow">Integrations</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">
              {INTEGRATIONS.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-text/75 dark:text-white/70">{INTEGRATIONS.description}</p>
            <a href="#contact" className="btn-cta-outline mt-8 dark:btn-secondary inline-flex rounded-lg">
              Learn about integrations
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTEGRATIONS.platforms.map((platform) => (
              <span key={platform} className="integration-pill">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
