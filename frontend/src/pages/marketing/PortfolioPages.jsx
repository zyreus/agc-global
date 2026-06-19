import { Navigate, useParams } from 'react-router-dom'
import PageHero from '../../components/marketing/PageHero.jsx'
import PortfolioHubSection from '../../components/marketing/PortfolioHubSection.jsx'
import PortfolioCaseStudyLayout from '../../components/marketing/PortfolioCaseStudyLayout.jsx'
import { usePageMeta } from '../../hooks/usePageMeta.js'
import { PAGE_META } from '../../data/siteContent.js'
import { getPortfolioProject } from '../../data/portfolioContent.js'

export function PortfolioPage() {
  usePageMeta(PAGE_META.portfolio)
  return (
    <main id="main-content" className="flex-1">
      <PageHero
        eyebrow="Portfolio"
        title="Solutions delivered at scale"
        description="AGC implementations — HRIS, lending, help desk, enterprise systems, web platforms, cloud, and infrastructure projects."
      />
      <PortfolioHubSection />
    </main>
  )
}

export function PortfolioCaseStudyPage() {
  const { slug } = useParams()
  const project = getPortfolioProject(slug)

  usePageMeta(
    project
      ? { title: `${project.name} | AGC Global Portfolio`, description: project.shortDescription }
      : PAGE_META.portfolio
  )

  if (!project) return <Navigate to="/portfolio" replace />

  return (
    <main id="main-content" className="flex-1">
      <PortfolioCaseStudyLayout project={project} />
    </main>
  )
}

const PRODUCT_SLUG_MAP = {
  hris: 'hris-smartdtr',
  lending: 'amalgated-lending',
  enterprise: 'custom-enterprise-systems',
  crm: 'custom-enterprise-systems',
}

export function ProductsRedirectPage() {
  const { slug } = useParams()
  if (!slug) return <Navigate to="/portfolio" replace />
  const target = PRODUCT_SLUG_MAP[slug] ?? slug
  const project = getPortfolioProject(target)
  return <Navigate to={project ? `/portfolio/${target}` : '/portfolio'} replace />
}
