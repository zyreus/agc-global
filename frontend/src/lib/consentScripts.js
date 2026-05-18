import { categoryAllows, readStoredConsent } from './cookieConsent.js'

export function applyConsentScripts(consent = readStoredConsent()) {
  if (typeof document === 'undefined') return

  if (categoryAllows('analytics', consent)) {
    document.documentElement.dataset.agcAnalytics = '1'
  } else {
    delete document.documentElement.dataset.agcAnalytics
  }

  if (categoryAllows('marketing', consent)) {
    document.documentElement.dataset.agcMarketing = '1'
  } else {
    delete document.documentElement.dataset.agcMarketing
  }

  if (categoryAllows('functional', consent)) {
    document.documentElement.dataset.agcFunctional = '1'
  } else {
    delete document.documentElement.dataset.agcFunctional
  }
}
