const quickLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#industries', label: 'Industries' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#why', label: 'Why AGC' },
  { href: '#updates', label: 'Updates' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-night text-white">
      <div className="app-container py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src="/AGC.png" alt="" className="h-11 w-11 object-cover object-[0%_50%]" aria-hidden />
              <div>
                <p className="text-sm font-semibold tracking-wide">Amalgated Global Computek</p>
                <p className="text-sm text-white/70">Technologies &amp; Business Solutions</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Enterprise-grade delivery across software, integrations, security, and operations — with clear communication and measurable outcomes.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">Quality-first delivery</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">Security-aware builds</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">Scalable foundations</span>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Quick services</p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>Custom systems &amp; portals</li>
                <li>API integrations &amp; automation</li>
                <li>CRM &amp; operational dashboards</li>
                <li>Security, backups &amp; maintenance</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Business hours</p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>Mon–Fri: 9:00 AM – 6:00 PM (PH)</li>
                <li>Support windows available by agreement</li>
                <li className="pt-2">
                  <span className="font-semibold text-white">Email:</span>{' '}
                  <a className="underline decoration-white/30 underline-offset-4 hover:text-white" href="mailto:agc.billing2026@gmail.com">
                    agc.billing2026@gmail.com
                  </a>
                </li>
                <li>
                  <span className="font-semibold text-white">Phone:</span>{' '}
                  <a className="underline decoration-white/30 underline-offset-4 hover:text-white" href="tel:+639190675099">
                    +63 9190675099
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Stay connected</p>
            <p className="mt-3 text-sm text-white/70">Subscribe on the Updates section for announcements and opportunities.</p>
            <a
              href="#updates"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover sm:w-auto"
            >
              Newsletter signup
            </a>
            <div className="mt-6 space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Social</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-white/75">
                <a className="hover:text-white" href="https://www.amalgatedcomputek.com" target="_blank" rel="noreferrer">
                  Website
                </a>
                <a className="hover:text-white" href="https://wa.me/639190675099" target="_blank" rel="noreferrer">
                  WhatsApp
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
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/55">
            <a href="#contact" className="hover:text-white">
              Privacy &amp; data handling: contact us
            </a>
            <span aria-hidden>•</span>
            <span>Certifications vary by engagement scope</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/70">“Your Goals. Our Solutions.”</p>
          <p className="mt-2 text-xs text-white/50">© {new Date().getFullYear()} Amalgated Global Computek. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
