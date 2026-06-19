import { Link, Navigate, useParams } from 'react-router-dom'
import { ABOUT_CONTENT } from '../../data/marketingContent.js'
import PageHero from '../../components/marketing/PageHero.jsx'
import { IndustriesGrid } from '../../components/marketing/IndustriesHubSection.jsx'
import AboutHubSection from '../../components/marketing/AboutHubSection.jsx'
import TeamSection from '../../components/marketing/TeamSection.jsx'
import CareersNewsSection from '../../components/marketing/CareersNewsSection.jsx'
import ContactSection from '../../components/marketing/ContactSection.jsx'
import ChatWidget from '../../components/ChatWidget.jsx'
import { useAnnouncements } from '../../hooks/useAnnouncements.js'
import { usePageMeta } from '../../hooks/usePageMeta.js'
import { getIndustryById, PAGE_META } from '../../data/siteContent.js'

export function IndustriesPage() {
  usePageMeta(PAGE_META.industries)
  return (
    <main id="main-content" className="flex-1">
      <PageHero
        eyebrow="Industries"
        title="Industries we serve"
        description="Focused expertise for finance, real estate, retail, logistics, and corporate enterprises — without repeating portfolio case studies."
      />
      <section className="page-section-compact">
        <div className="app-container"><IndustriesGrid /></div>
      </section>
    </main>
  )
}

export function IndustryDetailPage() {
  const { slug } = useParams()
  const industry = getIndustryById(slug)
  usePageMeta(industry ? { title: `${industry.title} | AGC Global`, description: industry.overview } : PAGE_META.industries)
  if (!industry) return <Navigate to="/industries" replace />

  return (
    <main id="main-content" className="flex-1">
      <PageHero eyebrow="Industry" title={industry.title} description={industry.overview} />
      <section className="theme-section page-section-compact">
        <div className="app-container max-w-3xl">
          <h2 className="theme-heading text-lg font-semibold">How we help</h2>
          <ul className="mt-4 space-y-2">
            {industry.focus.map((item) => (
              <li key={item} className="theme-text flex gap-2 text-sm">
                <span className="text-brand-primary">✓</span> {item}
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn-primary mt-8 inline-flex">Discuss {industry.title} solutions</Link>
        </div>
      </section>
    </main>
  )
}

export function AboutPage() {
  usePageMeta(PAGE_META.about)
  return (
    <main id="main-content" className="flex-1">
      <PageHero
        eyebrow="About AGC"
        title={ABOUT_CONTENT.headline}
        description={[ABOUT_CONTENT.paragraphs[0], ABOUT_CONTENT.paragraphs[1]].filter(Boolean).join(' ')}
      />
      <AboutHubSection />
    </main>
  )
}

export function TeamPage() {
  usePageMeta(PAGE_META.team)
  return (
    <main id="main-content" className="flex-1">
      <TeamSection />
    </main>
  )
}

export function NewsPage() {
  usePageMeta(PAGE_META.news)
  const { announcements, loading, error } = useAnnouncements()
  return (
    <main id="main-content" className="flex-1">
      <PageHero eyebrow="News & Insights" title="Stay ahead of what matters" description="Product updates, platform notes, and perspectives from the AGC team." />
      <CareersNewsSection announcements={announcements} loading={loading} error={error} />
    </main>
  )
}

export function ContactPage() {
  usePageMeta(PAGE_META.contact)
  return (
    <main id="main-content" className="flex-1">
      <ContactSection showHero />
      <ChatWidget />
    </main>
  )
}
