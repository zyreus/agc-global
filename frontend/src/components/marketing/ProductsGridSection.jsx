import { Link } from 'react-router-dom'
import LazyImage from '../LazyImage.jsx'
import { useReveal } from '../../hooks/useReveal.js'
import { PRODUCTS_CATALOG } from '../../data/siteContent.js'
import { SectionFooterLink } from './PageHero.jsx'

function ProductCard({ product, index, compact = false }) {
  const [ref, visible] = useReveal({ threshold: 0.1 })
  const delay = index * 80

  return (
    <article
      ref={ref}
      className={[
        'group reveal-up overflow-hidden rounded-2xl border border-black/8 bg-white shadow-soft transition-all duration-300 sm:rounded-3xl',
        'hover:-translate-y-1.5 hover:border-brand-primary/30 hover:shadow-[0_24px_60px_rgba(10,15,31,0.1)]',
        'dark:border-white/10 dark:bg-brand-navy/40',
        visible ? 'is-visible' : '',
      ].join(' ')}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${product.gradient}`}>
          {product.image ? (
            <>
              <LazyImage src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-night/80 via-brand-night/20 to-transparent" aria-hidden />
            </>
          ) : null}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">{product.tagline}</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{product.name}</h3>
          </div>
        </div>
      </Link>
      <div className="p-6">
        <p className="text-sm leading-relaxed text-brand-text/75 dark:text-white/70">{product.description}</p>
        {!compact && (
          <ul className="mt-4 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-brand-text/80 dark:text-white/75">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">✓</span>
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/contact" className="btn-primary text-sm">Request Demo</Link>
          <Link to={`/products/${product.id}`} className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-brand-text transition hover:border-brand-primary/35 dark:border-white/10 dark:text-white">
            View details
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function ProductsGridSection({ limit, viewAllHref, showHeader = true }) {
  const [headerRef, headerVisible] = useReveal({ threshold: 0.2 })
  const items = PRODUCTS_CATALOG.slice(0, limit ?? PRODUCTS_CATALOG.length)
  const compact = Boolean(limit)

  return (
    <section id="products" className="saas-section bg-brand-background dark:bg-brand-night" aria-labelledby="products-heading">
      <div className="app-container">
        {showHeader && (
          <div ref={headerRef} className={['reveal-up mx-auto max-w-3xl text-center', headerVisible ? 'is-visible' : ''].join(' ')}>
            <p className="section-eyebrow">Products</p>
            <h2 id="products-heading" className="saas-headline text-brand-text dark:text-white">AGC-developed software platforms</h2>
            <p className="saas-subhead mx-auto">Production-ready products built by our team — HRIS, lending, CRM, and enterprise solutions.</p>
          </div>
        )}
        <ul className="section-block grid list-none gap-6 lg:grid-cols-2">
          {items.map((product, idx) => (
            <li key={product.id}><ProductCard product={product} index={idx} compact={compact} /></li>
          ))}
        </ul>
        {viewAllHref && <SectionFooterLink to={viewAllHref} label="View all products" />}
      </div>
    </section>
  )
}
