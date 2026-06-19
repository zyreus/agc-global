/**
 * Concise homepage — gateway only. No team, news, or products sections.
 */
import HeroSection from './HeroSection.jsx'
import { HomeCompanyOverview, HomeWhyChoose, HomeCtaSection } from './HomeSections.jsx'
import SolutionsGridSection from './SolutionsGridSection.jsx'
import { IndustryHighlightsPreview } from './IndustriesHubSection.jsx'
import PortfolioPreviewSection from './PortfolioPreviewSection.jsx'
import { HOME_FEATURED, PRIMARY_SOLUTION_IDS } from '../../data/siteContent.js'

export default function MarketingHomeLayout() {
  return (
    <>
      <HeroSection />
      <HomeCompanyOverview />
      <SolutionsGridSection
        ids={PRIMARY_SOLUTION_IDS}
        limit={HOME_FEATURED.solutions}
        viewAllHref="/solutions"
      />
      <PortfolioPreviewSection />
      <IndustryHighlightsPreview />
      <HomeWhyChoose />
      <HomeCtaSection />
    </>
  )
}
