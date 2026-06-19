import { Link } from 'react-router-dom'
import { COMPANY } from '../data/marketingContent.js'
import { FOOTER_ROUTES } from '../data/siteContent.js'
import FooterCookieSettings from './FooterCookieSettings.jsx'

const services = [
  'Software Development',
  'Network Infrastructure',
  'Cloud Solutions',
  'Cybersecurity',
  'Business Process Automation',
  'IT Consulting',
]

export default function MarketingFooter() {
  return (
    <footer className="theme-footer mt-auto">
      <div className="app-container py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src="/AGC.png" alt={COMPANY.name} className="h-11 w-11 object-cover object-[0%_50%] sm:h-12 sm:w-12" />
              <div>
                <p className="theme-footer-heading text-sm font-semibold tracking-wide">{COMPANY.name}</p>
                <p className="text-sm">{COMPANY.tagline}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed">
              Philippines-based technology solutions partner delivering enterprise software, cloud infrastructure, cybersecurity, and business automation.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5">
            <div>
              <p className="theme-eyebrow">Core services</p>
              <ul className="mt-4 space-y-2 text-sm">
                {services.map((s) => (<li key={s}>{s}</li>))}
              </ul>
            </div>
            <div>
              <p className="theme-eyebrow">Contact</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>{COMPANY.hours}</li>
                <li><span className="theme-footer-heading font-semibold">Email:</span> <a className="underline hover:text-brand-primary" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
                <li><span className="theme-footer-heading font-semibold">Phone:</span> <a className="underline hover:text-brand-primary" href={COMPANY.phoneHref}>{COMPANY.phone}</a></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="theme-eyebrow">Get started</p>
            <p className="mt-3 text-sm">Request a consultation or explore our portfolio of delivered solutions.</p>
            <Link to="/contact" className="theme-btn-primary mt-4 w-full sm:w-auto">Request consultation</Link>
          </div>
        </div>

        <div className="theme-divider mt-10 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-h-32 flex-wrap gap-x-3 gap-y-2 overflow-y-auto text-sm sm:max-h-none md:gap-x-4">
            {FOOTER_ROUTES.map((l) => (
              <Link key={l.path} to={l.path} className="transition hover:text-brand-primary">{l.label}</Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs opacity-75">
            <span>Privacy &amp; data handling: contact us for details</span>
            <FooterCookieSettings />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm">&ldquo;{COMPANY.slogan}&rdquo;</p>
          <p className="theme-muted mt-2 text-xs">&copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
