import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_TOKEN_STORAGE, API_BASE_URL } from '../lib/config.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const storedToken = useMemo(() => window.localStorage.getItem(ADMIN_TOKEN_STORAGE) ?? '', [])

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (storedToken) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate, storedToken])

  const onSubmit = async (event) => {
    event.preventDefault()
    const id = identifier.trim()
    if (!id || !password) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id, password }),
      })

      const raw = await response.text()
      let data = {}
      if (raw) {
        try {
          data = JSON.parse(raw)
        } catch {
          data = {}
        }
      }

      if (!response.ok) {
        if ([502, 503, 504].includes(response.status)) {
          throw new Error(
            'Cannot reach the API. From the repo root run npm run dev (starts Vite and Laravel), or run npm run dev:api in another terminal, then try again.',
          )
        }
        throw new Error(data?.message || `Login failed (${response.status}).`)
      }

      if (!data?.token) throw new Error(data?.message || 'Login failed.')
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE, data.token)
      navigate('/admin/dashboard', { replace: true })
    } catch (e) {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE)
      const raw = e?.message || 'Login failed.'
      setError(
        raw === 'Failed to fetch'
          ? 'Cannot reach the API. Start the Laravel server (e.g. from the repo root run npm run dev:api, or npm run dev:full), then try again.'
          : raw,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 bg-brand-background-alt">
      <section className="app-container flex min-h-[calc(100vh-80px)] items-center justify-center py-10 sm:py-14">
        <div className="w-full max-w-xl rounded-2xl border border-black/5 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:p-10">
          <p className="text-[11px] font-bold tracking-[0.45em] text-brand-primary">ADMIN PORTAL</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text">Admin Sign In</h1>
          <p className="mt-2 text-sm text-brand-text/65">Use your administrator credentials.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or email"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 pr-12 text-sm text-brand-text outline-none transition focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-brand-text/50 transition hover:bg-black/5 hover:text-brand-text/70"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 10.5a3 3 0 004.24 4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88a3 3 0 014.24 4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.04 12.32a9 9 0 0114.12-5.12M21.96 11.68a9 9 0 01-4.29 5.77" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.04 12.32a9 9 0 0119.92 0 9 9 0 01-19.92 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setIdentifier('')
                  setPassword('')
                }}
                className="text-sm font-semibold text-brand-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/', { replace: true })}
              className="inline-flex w-full items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-brand-text transition hover:bg-black/5"
            >
              Back to website
            </button>

            <p className="pt-2 text-xs text-brand-text/50">
              Admin access only.
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

