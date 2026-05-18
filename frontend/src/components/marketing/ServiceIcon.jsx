export default function ServiceIcon({ name, className }) {
  const cn = className ?? 'h-5 w-5'
  const icons = {
    layers: (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M3 13 12 18l9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M3 17 12 22l9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    code: (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    chart: (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 19V5M8 17V9M12 17v-4M16 17V7M20 17v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    mobile: (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    api: (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    network: (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    cloud: (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M7 18h10a4 4 0 0 0 0-8 5 5 0 0 0-9.8-1.2A3.5 3.5 0 0 0 7 18Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    users: (
      <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  }
  const shield = (
    <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
  return icons[name] ?? shield
}
