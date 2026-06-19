import { Link } from 'react-router-dom'

export default function PageHero({ eyebrow, title, description, children }) {
  return (
    <section className="theme-hero">
      <div className="app-container page-section-compact">
        {eyebrow && <p className="theme-eyebrow">{eyebrow}</p>}
        <h1 className="theme-heading mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {description && (
          <p className="theme-text mt-4 max-w-2xl text-base leading-relaxed">{description}</p>
        )}
        {children}
      </div>
    </section>
  )
}

export function SectionFooterLink({ to, label = 'View all' }) {
  return (
    <div className="mt-10 text-center">
      <Link to={to} className="theme-btn-outline gap-2">
        {label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )
}
