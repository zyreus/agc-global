/**
 * Vite plugin: multi-page enterprise IA — routes, marketing header/footer,
 * slim homepage, hero CTA route links. Products merged into Portfolio.
 */
const MARKER = '/* @agc-site-restructure */'

const MARKETING_IMPORTS = `
import MarketingHomePage from './pages/MarketingHomePage.jsx'
import { SolutionsPage, SolutionDetailPage } from './pages/marketing/SolutionsPages.jsx'
import { PortfolioPage, PortfolioCaseStudyPage, ProductsRedirectPage } from './pages/marketing/PortfolioPages.jsx'
import {
  IndustriesPage,
  IndustryDetailPage,
  AboutPage,
  TeamPage,
  NewsPage,
  ContactPage,
} from './pages/marketing/MarketingPages.jsx'
`

const MARKETING_ROUTE_BLOCK = `<Route path="/" element={<MarketingHomePage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/solutions/:slug" element={<SolutionDetailPage />} />
          <Route path="/products" element={<ProductsRedirectPage />} />
          <Route path="/products/:slug" element={<ProductsRedirectPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<PortfolioCaseStudyPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/industries/:slug" element={<IndustryDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />`

const FOUC_SCRIPT = `<script>
      (function () {
        try {
          var t = localStorage.getItem('agc-theme');
          if (t === 'dark') {
            document.documentElement.classList.add('dark');
            var m = document.querySelector('meta[name="theme-color"]');
            if (m) m.setAttribute('content', '#020617');
          }
        } catch (e) {}
      })();
    </script>`

function applyProtectedThemePatches(code, id) {
  let next = code
  let changed = false

  if (id.endsWith('ChatWidget.jsx') && code.includes('#3A3F45')) {
    next = next
      .replace(
        'rounded-2xl border border-brand-primary/30 bg-white shadow-2xl sm:bottom-24',
        'theme-chat-panel rounded-2xl shadow-2xl sm:bottom-24',
      )
      .replace('text-base font-semibold text-[#3A3F45]', 'theme-heading text-base font-semibold')
      .replace('mt-1 text-sm text-[#3A3F45]/80', 'theme-text mt-1 text-sm')
      .replace(
        'rounded-xl border border-[#C9CED4]/40 bg-[#F4F6F8]/60 px-4 py-3 text-left text-sm font-medium text-[#3A3F45]',
        'theme-btn-outline flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium',
      )
      .replace(
        "? 'rounded-br-md bg-brand-primary text-white'\n                          : 'rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] text-[#3A3F45]'",
        "? 'theme-chat-bubble-user rounded-br-md'\n                          : 'theme-chat-bubble-bot rounded-bl-md'",
      )
      .replace("text-[#3A3F45]/40", 'theme-muted')
      .replace(
        'w-full rounded-xl border border-[#C9CED4]/40 bg-[#F4F6F8]/60 px-4 py-2.5 text-left text-sm text-[#3A3F45]',
        'theme-btn-outline w-full rounded-xl px-4 py-2.5 text-left text-sm',
      )
      .replace(
        'rounded-2xl rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] px-4 py-2.5 text-sm text-[#3A3F45]',
        'theme-chat-bubble-bot rounded-2xl rounded-bl-md px-4 py-2.5 text-sm',
      )
      .replace(
        'rounded-xl border border-[#C9CED4]/50 px-4 py-2 text-sm font-medium text-[#3A3F45] transition hover:bg-[#F4F6F8]',
        'theme-btn-outline rounded-xl px-4 py-2 text-sm font-medium',
      )
      .replace(
        'w-full max-w-full space-y-2.5 rounded-2xl rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] p-4 sm:max-w-[90%]',
        'theme-chat-bubble-bot w-full max-w-full space-y-2.5 rounded-2xl rounded-bl-md p-4 sm:max-w-[90%]',
      )
      .replace(
        'w-full rounded-lg border border-[#C9CED4]/50 bg-white px-3 py-2 text-sm text-[#3A3F45] outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20',
        'form-field',
      )
      .replace(
        'w-full resize-none rounded-lg border border-[#C9CED4]/50 bg-white px-3 py-2 text-sm text-[#3A3F45] outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20',
        'form-field resize-none',
      )
      .replace(
        'w-full max-w-full space-y-3 rounded-2xl rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] p-4 sm:max-w-[90%]',
        'theme-chat-bubble-bot w-full max-w-full space-y-3 rounded-2xl rounded-bl-md p-4 sm:max-w-[90%]',
      )
      .replace('mb-2 text-xs font-semibold text-[#3A3F45]/70', 'theme-label mb-2 text-xs font-semibold')
      .replace(
        'flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] px-4 py-3',
        'theme-chat-bubble-bot flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3',
      )
      .replace('border-t border-[#C9CED4]/30 bg-white px-3 py-3', 'theme-chat-input-bar px-3 py-3')
      .replace(
        'flex-1 rounded-xl border border-[#C9CED4]/50 bg-[#F4F6F8]/60 px-4 py-2.5 text-sm text-[#3A3F45] outline-none transition placeholder:text-[#3A3F45]/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
        'theme-input flex-1 rounded-xl py-2.5',
      )
    changed = next !== code
  }

  if (id.endsWith('CareersNewsSection.jsx') && code.includes('dark:bg-brand-navy/40')) {
    next = next
      .replace(
        "'group relative overflow-hidden rounded-2xl border bg-white transition duration-300 dark:bg-brand-navy/40'",
        "'theme-card group relative overflow-hidden rounded-2xl transition duration-300'",
      )
      .replace(
        ": 'border-black/8 shadow-soft hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-[0_20px_50px_rgba(255,140,26,0.08)] dark:border-white/10'",
        ": 'theme-card-interactive hover:border-brand-primary/30'",
      )
      .replace(
        'bg-white/90 text-brand-primary shadow-soft ring-1 ring-black/5 dark:bg-brand-night/80 dark:ring-white/10',
        'bg-[var(--card-bg)] text-brand-primary shadow-soft ring-1 ring-[var(--border-color)]',
      )
      .replace('text-brand-text/55 dark:text-white/50', 'theme-muted')
      .replace('text-brand-text/35 dark:text-white/30', 'theme-muted')
      .replace(
        'font-semibold tracking-tight text-brand-text dark:text-white',
        'theme-heading font-semibold tracking-tight',
      )
      .replace('leading-relaxed text-brand-text/75 dark:text-white/70', 'theme-text leading-relaxed')
      .replace(
        'page-section relative scroll-mt-28 border-t border-black/5 bg-gradient-to-b from-slate-50 via-brand-background-alt to-white pb-8 sm:pb-10 dark:border-white/10 dark:from-brand-night dark:via-brand-night dark:to-brand-navy/30',
        'theme-section theme-border-t page-section relative scroll-mt-28 pb-8 sm:pb-10',
      )
      .replace(
        'type-h1 mt-3 font-semibold tracking-tight text-brand-text dark:text-white',
        'theme-heading type-h1 mt-3 font-semibold tracking-tight',
      )
      .replace(
        'mt-3 text-base leading-relaxed text-brand-text/75 dark:text-white/70 sm:mt-4',
        'theme-text mt-3 text-base leading-relaxed sm:mt-4',
      )
      .replace(
        'mt-2 text-xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-2xl',
        'theme-heading mt-2 text-xl font-semibold tracking-tight sm:text-2xl',
      )
      .replace('mt-3 text-sm text-brand-text/60 dark:text-white/55', 'theme-muted mt-3 text-sm')
      .replace(
        'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text/40',
        'theme-muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
      )
      .replace(
        'w-full min-w-0 rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-3 text-sm outline-none ring-brand-primary transition focus:ring-2 dark:border-white/10 dark:bg-brand-navy/50 dark:text-white',
        'theme-search w-full min-w-0 py-2.5 pl-10 pr-3',
      )
      .replace(
        'w-full shrink-0 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-navy/50 dark:text-white sm:w-auto sm:min-w-[8.5rem]',
        'theme-input w-full shrink-0 sm:w-auto sm:min-w-[8.5rem]',
      )
    changed = changed || next !== code
  }

  if (changed) return `${MARKER}\n${next}`
  return null
}

function agcSiteRestructurePlugin() {
  return {
    name: 'agc-site-restructure',
    enforce: 'pre',

    transformIndexHtml(html) {
      if (html.includes('agc-theme')) return html
      let next = html.replace('content="#050816"', 'content="#FFFFFF"')
      next = next.replace('</head>', `${FOUC_SCRIPT}\n  </head>`)
      return next
    },

    transform(code, id) {
      if (!id.includes('/src/') && !id.includes('\\src\\')) return null
      if (code.includes(MARKER)) return null

      if (id.endsWith('main.jsx') && !code.includes('theme-surfaces.css')) {
        const next = code.replace("import './index.css'", "import './index.css'\nimport './theme-surfaces.css'")
        if (next !== code) return { code: `${MARKER}\n${next}`, map: null }
      }

      if (id.endsWith('App.jsx')) {
        let next = code
        next = next.replace("import Header from './components/Header.jsx'", "import Header from './components/MarketingHeader.jsx'")
        next = next.replace("import Footer from './components/Footer.jsx'", "import Footer from './components/MarketingFooter.jsx'")
        next = next.replace("import Home from './pages/Home.jsx'\n", MARKETING_IMPORTS)

        if (!next.includes('MarketingHomePage')) return null

        next = next.replace('<Route path="/" element={<Home />} />', MARKETING_ROUTE_BLOCK)

        next = next.replace(
          'className="min-h-screen bg-brand-background-alt text-brand-text transition-colors duration-300 dark:bg-brand-night dark:text-white/90"',
          'className="theme-page min-h-screen transition-colors duration-200"',
        )

        if (next === code) return null
        return { code: `${MARKER}\n${next}`, map: null }
      }

      if (id.endsWith('Home.jsx')) {
        return {
          code: `${MARKER}
import MarketingHomePage from './MarketingHomePage.jsx'
export default MarketingHomePage
`,
          map: null,
        }
      }

      if (id.endsWith('HeroSection.jsx') && code.includes('href="#contact"')) {
        let next = code
        next = next.replace(
          "import { useEffect, useState } from 'react'",
          "import { useEffect, useState } from 'react'\nimport { Link } from 'react-router-dom'",
        )
        next = next.replace(
          `<a href="#contact" className="btn-cta-dark rounded-full px-8">
              {HERO.ctaPrimary}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>`,
          `<Link to="/contact" className="btn-cta-dark rounded-full px-8">
              {HERO.ctaPrimary}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>`,
        )
        next = next.replace(
          `<a href="#solutions" className="btn-secondary rounded-full px-8">
              {HERO.ctaSecondary}
            </a>`,
          `<Link to="/portfolio" className="btn-secondary rounded-full px-8">
              {HERO.ctaSecondary}
            </Link>`,
        )
        if (next === code) return null
        return { code: `${MARKER}\n${next}`, map: null }
      }

      const themed = applyProtectedThemePatches(code, id)
      if (themed) return { code: themed, map: null }

      return null
    },
  }
}

module.exports = { agcSiteRestructurePlugin, injectTeamSectionPlugin: agcSiteRestructurePlugin }
