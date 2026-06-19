import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import LazyImage from '../LazyImage.jsx'
import { SectionFooterLink } from './PageHero.jsx'
import { COMPANY } from '../../data/marketingContent.js'
import { TEAM_SECTION } from '../../data/teamContent.js'
import { useReveal } from '../../hooks/useReveal.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const FILTER_ALL = 'all'

function LinkedInIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Social overlay — visible on card hover. */
function SocialOverlay({ member }) {
  if (!member.linkedin && !member.email) return null

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-brand-night/90 via-brand-night/70 to-transparent px-4 pb-4 pt-10 transition-transform duration-300 group-hover:translate-y-0"
      aria-hidden
    >
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:border-brand-gold/50 hover:bg-brand-primary hover:text-white"
          aria-label={`${member.name} on LinkedIn`}
          onClick={(e) => e.stopPropagation()}
        >
          <LinkedInIcon />
        </a>
      )}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          tabIndex={-1}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:border-brand-gold/50 hover:bg-brand-primary hover:text-white"
          aria-label={`Email ${member.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <EmailIcon />
        </a>
      )}
    </div>
  )
}

/** Optional social links on card footer (does not open profile modal). */
function CardSocialLinks({ member }) {
  if (!member.linkedin && !member.email) return null

  return (
    <div className="theme-divider flex gap-2 border-t px-5 py-3 sm:px-6">
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-brand-primary transition hover:border-brand-primary hover:bg-brand-primary/10"
          aria-label={`${member.name} on LinkedIn`}
        >
          <LinkedInIcon className="h-4 w-4" />
        </a>
      )}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-brand-primary transition hover:border-brand-primary hover:bg-brand-primary/10"
          aria-label={`Email ${member.name}`}
        >
          <EmailIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

/** Team member card with scroll reveal, lift hover, and image zoom. */
function TeamCard({ member, index, onSelect, reduced }) {
  const [ref, visible] = useReveal({ threshold: 0.12 })
  const delay = reduced ? 0 : index * 80

  return (
    <article
      ref={ref}
      className={[
        'team-card theme-card theme-card-interactive group reveal-up flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl',
        visible ? 'is-visible' : '',
      ].join(' ')}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
      itemScope
      itemType="https://schema.org/Person"
    >
      <button
        type="button"
        onClick={() => onSelect(member)}
        className="flex flex-1 flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        aria-label={`View full profile of ${member.name}, ${member.role}`}
      >
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[var(--bg-secondary)]">
          <LazyImage
            src={member.photo}
            alt={member.photoAlt ?? member.name}
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            itemProp="image"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-night/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <SocialOverlay member={member} />
        </div>

        <div className="flex min-h-[11.5rem] flex-1 flex-col p-5 sm:min-h-[12rem] sm:p-6">
          <h3 className="theme-heading text-lg font-semibold tracking-tight" itemProp="name">
            {member.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-brand-primary" itemProp="jobTitle">
            {member.role}
          </p>
          <p className="theme-text mt-3 line-clamp-4 flex-1 text-sm leading-relaxed" itemProp="description">
            {member.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View profile
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>
      <CardSocialLinks member={member} />
    </article>
  )
}

/** Full-profile modal with biography, skills, experience, and contact. */
function TeamMemberModal({ member, onClose }) {
  useEffect(() => {
    if (!member) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prev
    }
  }, [member, onClose])

  if (!member) return null

  const categoryLabel =
    TEAM_SECTION.categories.find((c) => c.id === member.category)?.label ?? member.category

  return (
    <div
      className="theme-modal-backdrop fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <article className="theme-modal max-h-[92vh] w-full max-w-2xl overflow-auto rounded-3xl shadow-2xl">
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--bg-secondary)] sm:aspect-[2/1]">
          <LazyImage
            src={member.photo}
            alt={member.photoAlt ?? member.name}
            className="h-full w-full object-cover object-top"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-night/60 via-transparent to-transparent" aria-hidden />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-brand-night/70 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-brand-night"
          >
            Close
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">{categoryLabel}</p>
          <h3 id="team-modal-title" className="theme-heading mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {member.name}
          </h3>
          <p className="theme-text mt-1 text-sm font-medium">{member.role}</p>

          <p className="theme-text mt-5 text-sm leading-relaxed">
            {member.fullBio ?? member.description}
          </p>

          {member.skills?.length > 0 && (
            <div className="mt-6">
              <h4 className="theme-muted text-xs font-semibold uppercase tracking-[0.18em]">
                Skills
              </h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <li key={skill} className="theme-chip text-xs font-medium">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {member.experience?.length > 0 && (
            <div className="mt-6">
              <h4 className="theme-muted text-xs font-semibold uppercase tracking-[0.18em]">
                Experience
              </h4>
              <ul className="mt-3 space-y-3">
                {member.experience.map((exp) => (
                  <li key={`${exp.role}-${exp.org}`} className="theme-card rounded-2xl px-4 py-3">
                    <p className="theme-heading text-sm font-semibold">{exp.role}</p>
                    <p className="theme-muted mt-0.5 text-xs">
                      {exp.org}
                      {exp.period ? ` · ${exp.period}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="theme-divider mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-btn-outline gap-2 rounded-full px-4 py-2.5 text-sm"
              >
                <LinkedInIcon className="h-4 w-4" />
                LinkedIn
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="theme-btn-outline gap-2 rounded-full px-4 py-2.5 text-sm"
              >
                <EmailIcon className="h-4 w-4" />
                {member.email}
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

export default function TeamSection({ preview = false, limit = 4, viewAllHref = '/team' }) {
  const reduced = usePrefersReducedMotion()
  const [activeFilter, setActiveFilter] = useState(preview ? 'technical' : FILTER_ALL)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [headerRef, headerVisible] = useReveal({ threshold: 0.2 })

  const filterOptions = useMemo(
    () => [
      { id: FILTER_ALL, label: 'All Teams' },
      ...TEAM_SECTION.categories.map((c) => ({ id: c.id, label: c.filterLabel })),
    ],
    []
  )

  const groupedMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = (m) =>
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.skills ?? []).some((s) => s.toLowerCase().includes(q))

    const pool =
      activeFilter === FILTER_ALL
        ? TEAM_SECTION.members
        : TEAM_SECTION.members.filter((m) => m.category === activeFilter)

    let filtered = pool.filter(matchesSearch)
    if (preview) filtered = filtered.slice(0, limit)

    if (activeFilter !== FILTER_ALL || preview) {
      const category = TEAM_SECTION.categories.find((c) => c.id === (preview ? 'technical' : activeFilter))
      return [{ category: category ?? TEAM_SECTION.categories[0], members: filtered }]
    }
    return TEAM_SECTION.categories.map((cat) => ({
      category: cat,
      members: filtered.filter((m) => m.category === cat.id),
    }))
  }, [activeFilter, searchQuery, preview, limit])

  const closeModal = useCallback(() => setSelectedMember(null), [])

  const teamSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: TEAM_SECTION.title,
      description: TEAM_SECTION.introduction,
      itemListElement: TEAM_SECTION.members.map((member, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Person',
          name: member.name,
          jobTitle: member.role,
          image: member.photo,
          description: member.description,
          ...(member.email ? { email: member.email } : {}),
          ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
          worksFor: { '@type': 'Organization', name: COMPANY.name },
        },
      })),
    }),
    []
  )

  return (
    <section
      id="team"
      className="theme-section theme-border-t page-section-surface scroll-mt-28"
      aria-labelledby="team-section-heading"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }} />

      <div className="app-container">
        {/* Header */}
        <div
          ref={headerRef}
          className={['reveal-up mx-auto max-w-3xl text-center', headerVisible ? 'is-visible' : ''].join(' ')}
        >
          <p className="theme-eyebrow">Our People</p>
          <h2
            id="team-section-heading"
            className="theme-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]"
          >
            {TEAM_SECTION.title}
          </h2>
          <p className="theme-text mt-5 text-base leading-relaxed">{TEAM_SECTION.introduction}</p>
        </div>

        {/* Search & department filter */}
        {!preview && (
        <div className="mt-12 space-y-4">
          <label className="sr-only" htmlFor="team-search">
            Search team members
          </label>
          <input
            id="team-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team members by name, role, or skill…"
            className="theme-search mx-auto block max-w-xl py-3"
          />
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Filter team members by department"
          >
          {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveFilter(opt.id)}
                aria-pressed={activeFilter === opt.id}
                className="theme-filter-btn min-h-10 px-5 py-2 text-sm"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Category grids */}
        <div className="mt-14 space-y-16">
          {groupedMembers.map(({ category, members }) => {
            if (!members.length) return null
            return (
              <div key={category.id}>
                <div className="mb-8 flex items-center gap-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary sm:text-sm">
                    {category.label}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-brand-primary/30 to-transparent" aria-hidden />
                </div>
                <ul
                  className="grid list-none items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  aria-label={`${category.label} members`}
                >
                  {members.map((member, idx) => (
                    <li key={member.id} className="h-full">
                      <TeamCard member={member} index={idx} onSelect={setSelectedMember} reduced={reduced} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {preview && viewAllHref && <SectionFooterLink to={viewAllHref} label="View our team" />}

        {/* Careers CTA */}
        {!preview && (
        <div
          id="careers"
          className="scroll-mt-28 relative mt-20 overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-brand-navy via-brand-secondary to-brand-night p-8 text-center shadow-soft sm:p-12 dark:border-white/10"
        >
          <p className="text-lg font-medium text-white/90 sm:text-xl">{TEAM_SECTION.careersCta.headline}</p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/65 sm:text-base">
            Join a team that values innovation, integrity, and measurable impact for enterprise clients.
          </p>
          <Link to="/contact" className="btn-primary mt-8 inline-flex min-h-11 items-center justify-center px-10">
            {TEAM_SECTION.careersCta.buttonLabel}
          </Link>
        </div>
        )}
      </div>

      <TeamMemberModal member={selectedMember} onClose={closeModal} />
    </section>
  )
}
