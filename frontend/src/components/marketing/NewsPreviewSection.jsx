import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { INSIGHTS_POSTS } from '../../data/marketingContent.js'
import { HOME_FEATURED } from '../../data/siteContent.js'
import { SectionFooterLink } from './PageHero.jsx'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function NewsPreviewSection({ announcements = [], loading = false }) {
  const posts = useMemo(() => {
    const apiPosts = announcements
      .filter((a) => (a.type ?? 'news') !== 'career')
      .map((a) => ({
        id: `ann-${a.id}`,
        title: a.title,
        excerpt: a.content,
        date: a.published_at?.slice?.(0, 10) ?? a.created_at?.slice?.(0, 10) ?? '',
        category: 'Company Update',
      }))
    const staticPosts = INSIGHTS_POSTS.map((p) => ({ ...p, date: p.date ?? '' }))
    return [...staticPosts, ...apiPosts].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, HOME_FEATURED.news)
  }, [announcements])

  return (
    <section className="page-section-surface border-t border-black/5 dark:border-white/10" aria-labelledby="news-preview-heading">
      <div className="app-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">News &amp; Insights</p>
          <h2 id="news-preview-heading" className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">
            Latest from AGC
          </h2>
        </div>

        {loading ? (
          <p className="section-block text-center text-sm text-brand-text/60 dark:text-white/55">Loading news…</p>
        ) : (
          <ul className="section-block grid list-none gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-brand-navy/40">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary">{post.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-brand-text dark:text-white">{post.title}</h3>
                  <p className="mt-2 flex-1 line-clamp-3 text-sm text-brand-text/75 dark:text-white/70">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-brand-text/55 dark:text-white/50">{formatDate(post.date)}</p>
                </article>
              </li>
            ))}
          </ul>
        )}

        <SectionFooterLink to="/news" label="View all news & insights" />
      </div>
    </section>
  )
}
