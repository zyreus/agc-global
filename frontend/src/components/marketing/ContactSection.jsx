import { useCallback, useState } from 'react'
import { API_BASE_URL } from '../../lib/config.js'
import { COMPANY } from '../../data/marketingContent.js'
import { CONTACT_MAP_EMBED } from '../../data/siteContent.js'

const LEAD_SESSION_KEY = 'agc_web_inquiry_session'

function getLeadSessionId() {
  let id = sessionStorage.getItem(LEAD_SESSION_KEY)
  if (!id) {
    id = `web-${crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
    sessionStorage.setItem(LEAD_SESSION_KEY, id)
  }
  return id
}

export default function ContactSection({ showHero = false }) {
  const [contactStep, setContactStep] = useState(1)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactCompany, setContactCompany] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactInterest, setContactInterest] = useState('custom-dev')
  const [contactMessage, setContactMessage] = useState('')
  const [contactLoading, setContactLoading] = useState(false)
  const [contactMessageText, setContactMessageText] = useState('')

  const submitInquiry = useCallback(async () => {
    setContactLoading(true)
    setContactMessageText('')
    try {
      const concern = [`Interest: ${contactInterest}`, contactMessage.trim() ? `Details: ${contactMessage.trim()}` : '']
        .filter(Boolean)
        .join('\n')

      const response = await fetch(`${API_BASE_URL}/chat/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getLeadSessionId(),
          name: contactName.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim() || undefined,
          company: contactCompany.trim() || undefined,
          concern,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Could not send your inquiry right now.')
      setContactMessageText('Thanks — your inquiry was received. Our team will follow up shortly.')
      setContactStep(1)
      setContactName('')
      setContactEmail('')
      setContactCompany('')
      setContactPhone('')
      setContactInterest('custom-dev')
      setContactMessage('')
    } catch (error) {
      setContactMessageText(error.message)
    } finally {
      setContactLoading(false)
    }
  }, [contactCompany, contactEmail, contactInterest, contactMessage, contactName, contactPhone])

  return (
    <section id="contact" className="theme-section theme-border-t page-section-surface">
      <div className="app-container card-grid gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-x-12 lg:grid-rows-[auto_auto_auto_minmax(280px,1fr)] lg:items-stretch">
        {showHero && (
          <>
            <p className="theme-eyebrow lg:col-start-1 lg:row-start-1">Contact</p>
            <div className="lg:col-start-1 lg:row-start-2">
              <h2 className="theme-heading text-3xl font-semibold tracking-tight sm:text-4xl">Talk to a product expert</h2>
              <p className="theme-text mt-3 max-w-2xl text-base leading-relaxed">
                Use the guided inquiry form, connect instantly, or open the on-site AI assistant for quick triage.
              </p>
            </div>
          </>
        )}

        <div className={`grid gap-4 sm:grid-cols-2 ${showHero ? 'lg:col-start-1 lg:row-start-3' : ''}`}>
          <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="theme-card theme-card-interactive rounded-3xl p-5 text-sm font-semibold">
            WhatsApp quick connect
            <span className="theme-muted mt-2 block text-xs font-medium">Fast questions and scheduling.</span>
          </a>
          <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('agc:open-chat'))} className="theme-card theme-card-interactive rounded-3xl p-5 text-left text-sm font-semibold">
            Live support (AI + team)
            <span className="theme-muted mt-2 block text-xs font-medium">Opens the chat widget when available.</span>
          </button>
        </div>

        <div className={`flex min-h-[280px] flex-col ${showHero ? 'lg:col-start-1 lg:row-start-4' : ''}`}>
          <div className="theme-card flex flex-1 flex-col overflow-hidden rounded-3xl">
            <iframe src={CONTACT_MAP_EMBED} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Amalgated Capital location map" className="h-full min-h-[280px] w-full flex-1 grayscale contrast-125 dark:invert dark:contrast-100" />
          </div>
          <div className="theme-text mt-4 space-y-1 text-sm">
            <p><span className="theme-heading font-semibold">Email:</span> <a className="underline hover:text-brand-primary" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
            <p><span className="theme-heading font-semibold">Phone:</span> <a className="underline hover:text-brand-primary" href={COMPANY.phoneHref}>{COMPANY.phone}</a></p>
            <p>{COMPANY.hours}</p>
          </div>
        </div>

        <div className={`theme-card flex flex-col rounded-3xl p-5 sm:p-8 lg:p-10 ${showHero ? 'lg:col-start-2 lg:row-start-2 lg:row-span-3 lg:h-full' : 'lg:col-start-2'}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="theme-heading text-sm font-semibold">Project inquiry</p>
            <p className="theme-muted text-xs font-semibold">Step {contactStep} of 3</p>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]" aria-hidden>
            <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-gold" style={{ width: `${(contactStep / 3) * 100}%` }} />
          </div>

          {contactStep === 1 && (
            <div className="form-stack mt-8">
              <label className="form-label" htmlFor="inquiry-name">Full name</label>
              <input id="inquiry-name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="form-field" autoComplete="name" />
              <label className="form-label" htmlFor="inquiry-email">Work email</label>
              <input id="inquiry-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="form-field" autoComplete="email" />
              <button type="button" className="theme-btn-primary mt-2 w-full rounded-xl" onClick={() => { if (!contactName.trim() || !contactEmail.trim()) { setContactMessageText('Please add your name and email to continue.'); return }; setContactMessageText(''); setContactStep(2) }}>Continue</button>
            </div>
          )}

          {contactStep === 2 && (
            <div className="form-stack mt-8">
              <label className="form-label" htmlFor="inquiry-company">Company (optional)</label>
              <input id="inquiry-company" value={contactCompany} onChange={(e) => setContactCompany(e.target.value)} className="form-field" autoComplete="organization" />
              <label className="form-label" htmlFor="inquiry-phone">Phone (optional)</label>
              <input id="inquiry-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="form-field" autoComplete="tel" />
              <label className="form-label" htmlFor="inquiry-interest">Primary interest</label>
              <select id="inquiry-interest" value={contactInterest} onChange={(e) => setContactInterest(e.target.value)} className="form-field">
                <option value="custom-dev">Custom software development</option>
                <option value="enterprise">Enterprise systems</option>
                <option value="cloud">Cloud infrastructure</option>
                <option value="cyber">Cybersecurity</option>
                <option value="hris">HRIS / SmartDTR</option>
                <option value="demo">Book a demo</option>
              </select>
              <div className="flex gap-3">
                <button type="button" className="theme-btn-outline w-full rounded-xl" onClick={() => setContactStep(1)}>Back</button>
                <button type="button" className="theme-btn-primary w-full rounded-xl" onClick={() => setContactStep(3)}>Continue</button>
              </div>
            </div>
          )}

          {contactStep === 3 && (
            <div className="form-stack mt-8">
              <label className="form-label" htmlFor="inquiry-message">Project details</label>
              <textarea id="inquiry-message" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={5} className="form-field" placeholder="Goals, timelines, integrations, compliance needs?" />
              <div className="flex gap-3">
                <button type="button" className="theme-btn-outline w-full rounded-xl" onClick={() => setContactStep(2)}>Back</button>
                <button type="button" disabled={contactLoading} className="theme-btn-primary w-full rounded-xl disabled:opacity-60" onClick={submitInquiry}>{contactLoading ? 'Sending…' : 'Submit inquiry'}</button>
              </div>
            </div>
          )}

          {contactMessageText && <p className="theme-text mt-4 text-sm">{contactMessageText}</p>}
        </div>
      </div>
    </section>
  )
}
