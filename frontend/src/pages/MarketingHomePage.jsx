import ChatWidget from '../components/ChatWidget.jsx'
import MarketingHomeLayout from '../components/marketing/MarketingHomeLayout.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { PAGE_META } from '../data/siteContent.js'

export default function MarketingHomePage() {
  usePageMeta(PAGE_META.home)

  return (
    <main id="main-content" className="flex-1">
      <MarketingHomeLayout />
      <ChatWidget />
    </main>
  )
}
