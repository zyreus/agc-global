import { COMPANY } from '../data/marketingContent.js'

const quickLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#products', label: 'Products' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#industries', label: 'Industries' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
  { href: '#careers-news', label: 'Careers & News' },
  { href: '#contact', label: 'Contact' },
]

const services = [
  'Custom Software Development',
  'Enterprise Systems',
  'Web & Mobile Applications',
  'API Integrations',
  'Network & Cybersecurity',
  'Cloud Infrastructure',
  'HRIS SmartDTR',
  'Business Automation',
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-night text-white">
      <div className="app-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img
                src="/AGC.png"
                alt={COMPANY.name}
                className="h-11 w-11 object-cover object-[0%_50%] sm:h-12 sm:w-12"
              />
              <div>
                <p className="text-sm font-semibold tracking-wide">{COMPANY.name}</p>
                <p className="text-sm text-white/70">{COMPANY.tagline}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Philippines-based technology solutions partner delivering enterprise software, cloud infrastructure,
              cybersecurity, and business automation for organizations that demand measurable outcomes.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Enterprise-grade', 'Security-first', 'CRM-ready', 'AI-enabled'].map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Core services</p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Contact</p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>{COMPANY.hours}</li>
                <li>Support windows available by agreement</li>
                <li>
                  <span className="font-semibold text-white">Email:</span>{' '}
                  <a className="underline decoration-white/30 underline-offset-4 hover:text-white" href={`mailto:${COMPANY.email}`}>
                    {COMPANY.email}
                  </a>
                </li>
                <li>
                  <span className="font-semibold text-white">Phone:</span>{' '}
                  <a className="underline decoration-white/30 underline-offset-4 hover:text-white" href={COMPANY.phoneHref}>
                    {COMPANY.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Get started</p>
            <p className="mt-3 text-sm text-white/70">
              Request a consultation, view careers &amp; news, or book a demo of our enterprise platforms.
            </p>
            <a
              href="#contact"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover sm:w-auto"
            >
              Request consultation
            </a>
            <div className="mt-6 space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Connect</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-white/75">
                <a className="hover:text-white" href={COMPANY.website} target="_blank" rel="noreferrer">
                  Website
                </a>
                <a className="hover:text-white" href={COMPANY.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
                <a className="hover:text-white" href="#careers-news">
                  Careers &amp; News
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70">
            {quickLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-white">
                {l.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-white/55">Privacy &amp; data handling: contact us for details</p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/70">&ldquo;{COMPANY.slogan}&rdquo;</p>
          <p className="mt-2 text-xs text-white/50">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
