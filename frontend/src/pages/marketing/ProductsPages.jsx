import { Link, Navigate, useParams } from 'react-router-dom'
import LazyImage from '../../components/LazyImage.jsx'
import PageHero from '../../components/marketing/PageHero.jsx'
import ProductsGridSection from '../../components/marketing/ProductsGridSection.jsx'
import { usePageMeta } from '../../hooks/usePageMeta.js'
import { getProductById, PAGE_META } from '../../data/siteContent.js'

export function ProductsPage() {
  usePageMeta(PAGE_META.products)
  return (
    <main id="main-content" className="flex-1">
      <PageHero eyebrow="Products" title="AGC-developed software platforms" description="Production-ready products — request a demo or tailored proposal for your organization." />
      <ProductsGridSection showHeader={false} />
    </main>
  )
}

export function ProductDetailPage() {
  const { slug } = useParams()
  const product = getProductById(slug)

  usePageMeta(product ? { title: `${product.name} | AGC Global`, description: product.description } : PAGE_META.products)

  if (!product) return <Navigate to="/products" replace />

  return (
    <main id="main-content" className="flex-1">
      <PageHero eyebrow="Product" title={product.name} description={product.tagline} />
      <section className="page-section-compact">
        <div className="app-container grid gap-10 lg:grid-cols-2">
          <div className={`relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br ${product.gradient}`}>
            {product.image && <LazyImage src={product.image} alt={product.name} className="h-full w-full object-cover" />}
          </div>
          <div>
            <p className="text-base leading-relaxed text-brand-text/80 dark:text-white/75">{product.description}</p>
            <h2 className="mt-8 text-lg font-semibold text-brand-text dark:text-white">Key features</h2>
            <ul className="mt-4 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-brand-text/80 dark:text-white/75"><span className="text-brand-primary">✓</span>{f}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">Request Demo</Link>
              <Link to="/contact" className="inline-flex items-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold dark:border-white/10">Request Proposal</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
