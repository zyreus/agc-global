import { useCookieConsent } from '../../contexts/CookieConsentContext.jsx'

export default function CookieBanner() {
  const { ready, config, bannerVisible, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent()

  if (!ready || !bannerVisible || config?.banner?.enabled === false) return null

  const banner = config.banner ?? {}

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[70] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
      style={{ animation: 'agc-slide-up 0.45s ease-out' }}
    >
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-brand-night/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/20 ring-1 ring-brand-primary/30">
            <svg className="h-6 w-6 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.5 2-7 5.5-7 9a7 7 0 0 0 14 0c0-3.5-2.5-7-7-9Z" />
              <circle cx="9" cy="11" r="1" fill="currentColor" />
              <circle cx="14" cy="9" r="1" fill="currentColor" />
              <circle cx="15" cy="14" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="cookie-banner-title" className="text-lg font-semibold text-white">
              {banner.title}
            </h2>
            <p id="cookie-banner-desc" className="mt-2 text-sm leading-relaxed text-white/70">
              {banner.description}{' '}
              <a href={banner.privacy_policy_url || '#contact'} className="font-medium text-brand-primary underline-offset-2 hover:underline">
                Privacy policy
              </a>
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button type="button" onClick={openPreferences} className="order-3 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/5 sm:order-1">
            {banner.customize_label || 'Customize'}
          </button>
          <button type="button" onClick={rejectNonEssential} className="order-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/5">
            {banner.reject_label || 'Reject non-essential'}
          </button>
          <button type="button" onClick={acceptAll} className="order-1 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 transition hover:brightness-110 sm:order-3">
            {banner.accept_label || 'Accept all'}
          </button>
        </div>
      </div>
    </div>
  )
}
