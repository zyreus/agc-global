import { useEffect } from 'react'
import { useCookieConsent } from '../../contexts/CookieConsentContext.jsx'

export default function CookiePreferencesModal() {
  const {
    prefsOpen,
    setPrefsOpen,
    config,
    draft,
    setDraft,
    savePreferences,
    acceptAll,
    rejectNonEssential,
  } = useCookieConsent()

  useEffect(() => {
    if (!prefsOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setPrefsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [prefsOpen, setPrefsOpen])

  if (!prefsOpen) return null

  const categories = config?.categories ?? {}
  const keys = Object.keys(categories)

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close preferences"
        onClick={() => setPrefsOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-prefs-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-brand-night"
        style={{ animation: 'agc-slide-up 0.35s ease-out' }}
      >
        <div className="border-b border-black/5 px-6 py-5 dark:border-white/10">
          <h2 id="cookie-prefs-title" className="text-xl font-semibold text-brand-text dark:text-white">
            Cookie preferences
          </h2>
          <p className="mt-1 text-sm text-brand-text/65 dark:text-white/60">
            Choose which categories we may use. Essential cookies are always active.
          </p>
        </div>
        <div className="max-h-[min(60vh,28rem)] space-y-3 overflow-y-auto px-6 py-4">
          {keys.map((key) => {
            const meta = categories[key]
            const required = key === 'essential' || meta?.required
            const checked = required || Boolean(draft[key])
            return (
              <label
                key={key}
                className={`flex gap-4 rounded-xl border p-4 transition ${
                  required
                    ? 'border-brand-primary/20 bg-brand-primary/5 dark:bg-brand-primary/10'
                    : 'border-black/8 hover:border-brand-primary/25 dark:border-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-black/20 text-brand-primary focus:ring-brand-primary"
                  checked={checked}
                  disabled={required}
                  onChange={(e) => {
                    if (required) return
                    setDraft((prev) => ({ ...prev, [key]: e.target.checked }))
                  }}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-brand-text dark:text-white">{meta?.label ?? key}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-brand-text/65 dark:text-white/55">
                    {meta?.description}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
        <div className="flex flex-col gap-2 border-t border-black/5 bg-brand-background-alt/80 px-6 py-4 dark:border-white/10 dark:bg-black/20 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={rejectNonEssential}
            className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold text-brand-text transition hover:bg-black/[0.03] dark:border-white/15 dark:text-white dark:hover:bg-white/5"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={savePreferences}
            className="rounded-xl bg-brand-text px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-brand-night"
          >
            Save preferences
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-primary/20 transition hover:brightness-110"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
