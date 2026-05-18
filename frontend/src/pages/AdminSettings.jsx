import { useState } from 'react'

const STORAGE_KEY = 'agc_admin_settings_v1'

const defaultSettings = {
  portalName: 'AGC Admin Portal',
  supportEmail: 'agc.billing2026@gmail.com',
  supportPhone: '+63 9190675099',
  notifyNewChat: true,
  notifyNewLead: true,
  autoArchiveClosed: false,
  aiAutoReply: true,
  businessHoursOnly: false,
}

function readStoredSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return { ...defaultSettings, ...parsed }
  } catch {
    /* ignore */
  }
  return defaultSettings
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(readStoredSettings)
  const [saved, setSaved] = useState(false)

  const onSave = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text">Settings</h1>
          <p className="mt-2 text-sm text-brand-text/70">Basic settings for your admin portal, chat, and notifications.</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
        >
          Save settings
        </button>
      </div>

      {saved && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">Settings saved.</div>}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h2 className="text-base font-semibold text-brand-text">Portal Information</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-brand-text/70">Portal name</span>
              <input
                type="text"
                value={settings.portalName}
                onChange={(e) => setSettings((s) => ({ ...s, portalName: e.target.value }))}
                className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none ring-brand-primary focus:ring-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-brand-text/70">Support email</span>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
                className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none ring-brand-primary focus:ring-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-brand-text/70">Support phone</span>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings((s) => ({ ...s, supportPhone: e.target.value }))}
                className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none ring-brand-primary focus:ring-2"
              />
            </label>
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h2 className="text-base font-semibold text-brand-text">Notifications</h2>
          <div className="mt-4 space-y-3 text-sm text-brand-text/85">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.notifyNewChat} onChange={(e) => setSettings((s) => ({ ...s, notifyNewChat: e.target.checked }))} />
              Notify on new chat message
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.notifyNewLead} onChange={(e) => setSettings((s) => ({ ...s, notifyNewLead: e.target.checked }))} />
              Notify on new lead
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.autoArchiveClosed} onChange={(e) => setSettings((s) => ({ ...s, autoArchiveClosed: e.target.checked }))} />
              Auto archive closed conversations
            </label>
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] lg:col-span-2">
          <h2 className="text-base font-semibold text-brand-text">Chat & CRM Preferences</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-brand-text/85">
            <label className="flex items-center gap-2 rounded-lg border border-black/10 bg-brand-background-alt p-3">
              <input type="checkbox" checked={settings.aiAutoReply} onChange={(e) => setSettings((s) => ({ ...s, aiAutoReply: e.target.checked }))} />
              Enable AI quick reply in CRM
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-black/10 bg-brand-background-alt p-3">
              <input type="checkbox" checked={settings.businessHoursOnly} onChange={(e) => setSettings((s) => ({ ...s, businessHoursOnly: e.target.checked }))} />
              Human reply only during business hours
            </label>
          </div>
        </article>
      </div>
    </section>
  )
}

