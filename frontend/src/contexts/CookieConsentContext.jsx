import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { applyConsentScripts } from '../lib/consentScripts.js'
import {
  categoryAllows,
  defaultCategories,
  detectRegion,
  fetchCookieConfig,
  getVisitorId,
  readStoredConsent,
  requiresExplicitConsent,
  syncConsentToServer,
  writeStoredConsent,
} from '../lib/cookieConsent.js'

const CookieConsentContext = createContext(null)

const FALLBACK_CONFIG = {
  consent_version: '1.0',
  banner: {
    enabled: true,
    title: 'We value your privacy',
    description:
      'We use cookies to improve performance, analyze traffic, and personalize your experience. You control what we store.',
    privacy_policy_url: '#contact',
    accept_label: 'Accept all',
    reject_label: 'Reject non-essential',
    customize_label: 'Customize',
  },
  categories: {
    essential: {
      label: 'Essential',
      description: 'Required for security and core features.',
      required: true,
      default: true,
    },
    functional: {
      label: 'Functional',
      description: 'Remember preferences such as theme.',
      required: false,
      default: false,
    },
    analytics: {
      label: 'Analytics',
      description: 'Anonymous usage metrics to improve the site.',
      required: false,
      default: false,
    },
    marketing: {
      label: 'Marketing',
      description: 'Campaign measurement and relevant offers.',
      required: false,
      default: false,
    },
  },
  compliance: {
    gdpr_regions: ['EU', 'EEA', 'UK'],
    require_consent_before_tracking: true,
  },
}

function categoriesFromConfig(config) {
  const keys = Object.keys(config?.categories ?? FALLBACK_CONFIG.categories)
  const out = {}
  for (const key of keys) {
    const meta = config.categories[key]
    out[key] = key === 'essential' ? true : Boolean(meta?.default)
  }
  return out
}

export function CookieConsentProvider({ children }) {
  const [config, setConfig] = useState(FALLBACK_CONFIG)
  const [consent, setConsent] = useState(() => readStoredConsent())
  const [bannerVisible, setBannerVisible] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [draft, setDraft] = useState(() => defaultCategories())
  const [ready, setReady] = useState(false)
  const region = useMemo(() => consent?.region ?? detectRegion(), [consent?.region])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const remote = await fetchCookieConfig()
      if (cancelled) return
      if (remote) setConfig(remote)

      const stored = readStoredConsent()
      const version = remote?.consent_version ?? FALLBACK_CONFIG.consent_version
      const versionMismatch = stored && stored.consentVersion && stored.consentVersion !== version

      if (stored && !versionMismatch) {
        setConsent(stored)
        setDraft(stored.categories ?? defaultCategories())
        applyConsentScripts(stored)
        setBannerVisible(false)
      } else if (remote?.banner?.enabled === false) {
        setBannerVisible(false)
      } else {
        const explicit = requiresExplicitConsent(detectRegion(), remote?.compliance ?? FALLBACK_CONFIG.compliance)
        setBannerVisible(explicit || !stored)
        setDraft(categoriesFromConfig(remote ?? FALLBACK_CONFIG))
      }
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(
    async (action, categories) => {
      const payload = {
        action,
        categories: defaultCategories(categories),
        region,
        consentVersion: config.consent_version ?? '1.0',
        visitorId: getVisitorId(),
      }
      const record = writeStoredConsent(payload)
      setConsent(record)
      setDraft(record.categories)
      applyConsentScripts(record)
      setBannerVisible(false)
      setPrefsOpen(false)
      await syncConsentToServer({
        visitorId: payload.visitorId,
        action,
        categories: payload.categories,
        region: payload.region,
        consentVersion: payload.consentVersion,
      })
    },
    [config.consent_version, region],
  )

  const acceptAll = useCallback(() => {
    const all = categoriesFromConfig(config)
    Object.keys(all).forEach((k) => {
      all[k] = true
    })
    return persist('accept_all', all)
  }, [config, persist])

  const rejectNonEssential = useCallback(() => {
    return persist('reject_all', defaultCategories({ essential: true }))
  }, [persist])

  const savePreferences = useCallback(() => {
    return persist('save_preferences', draft)
  }, [draft, persist])

  const openPreferences = useCallback(() => {
    setDraft(consent?.categories ?? categoriesFromConfig(config))
    setPrefsOpen(true)
  }, [config, consent?.categories])

  const allows = useCallback((category) => categoryAllows(category, consent), [consent])

  const value = useMemo(
    () => ({
      ready,
      config,
      consent,
      region,
      bannerVisible,
      prefsOpen,
      draft,
      setDraft,
      setPrefsOpen,
      setBannerVisible,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences,
      allows,
    }),
    [
      ready,
      config,
      consent,
      region,
      bannerVisible,
      prefsOpen,
      draft,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences,
      allows,
    ],
  )

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider')
  return ctx
}
