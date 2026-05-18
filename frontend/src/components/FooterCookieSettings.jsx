import { useCookieConsent } from '../contexts/CookieConsentContext.jsx'

export default function FooterCookieSettings() {
  const { openPreferences } = useCookieConsent()

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-xs text-white/55 underline decoration-white/25 underline-offset-4 transition hover:text-white"
    >
      Cookie settings
    </button>
  )
}
