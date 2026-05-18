import { useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { API_BASE_URL } from '../../lib/config.js'
import { CAREERS_NEWS, COMPANY, INSIGHTS_POSTS } from '../../data/marketingContent.js'

const INITIAL_NEWS_COUNT = 3
const LOAD_MORE_STEP = 3

function NewsIcon({ name, className = 'h-5 w-5' }) {
  if (name === 'chart') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 19V5M8 17V9M12 17v-4M16 17V7M20 17v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'users') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 2a3 3 0 1 0 0-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (name === 'megaphone') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="m3 11 18-5v12L3 13v-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M11 13v8a2 2 0 0 0 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 13 12 18l9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function formatNewsDate(iso) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function mapAnnouncement(item) {
  const date = item.published_at?.slice?.(0, 10) ?? item.created_at?.slice?.(0, 10) ?? ''
  return {
    id: `ann-${item.id}`,
    category: 'Company Update',
    title: item.title,
    excerpt: item.content,
    date,
    readTime: '2 min',
    featured: false,
    icon: 'megaphone',
    gradient: 'from-slate-200 via-orange-50 to-white dark:from-brand-navy/60 dark:via-brand-navy/40 dark:to-brand-night/80',
    source: 'api',
  }
}

function NewsCard({ post, variant = 'list', onRead }) {
  const isFeatured = variant === 'featured'

  return (
    <article
      className={[
        'group relative overflow-hidden rounded-2xl border bg-white transition duration-300 dark:bg-brand-navy/40',
        isFeatured
          ? 'border-brand-primary/25 shadow-[0_24px_60px_rgba(255,140,26,0.12)] hover:border-brand-primary/40 lg:rounded-3xl'
          : 'border-black/8 shadow-soft hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-[0_20px_50px_rgba(255,140,26,0.08)] dark:border-white/10',
      ].join(' ')}
    >
      <div
        className={isFeatured ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]' : 'flex flex-col sm:flex-row'}
      >
        <div
          className={[
            'relative flex items-center justify-center bg-gradient-to-br',
            post.gradient,
            isFeatured ? 'min-h-[200px] p-8 lg:min-h-full' : 'aspect-[16/9] sm:aspect-[2/1] sm:w-44 sm:shrink-0 lg:aspect-auto lg:min-h-[120px]',
          ].join(' ')}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,140,26,0.18),transparent_55%)]" aria-hidden />
          <div
            className={[
              'relative flex items-center justify-center rounded-2xl bg-white/90 text-brand-primary shadow-soft ring-1 ring-black/5 dark:bg-brand-night/80 dark:ring-white/10',
              isFeatured ? 'h-16 w-16' : 'h-12 w-12',
            ].join(' ')}
          >
            <NewsIcon name={post.icon} className={isFeatured ? 'h-8 w-8' : 'h-6 w-6'} />
          </div>
        </div>

        <div className={isFeatured ? 'flex flex-col justify-center p-6 sm:p-8 lg:p-10' : 'flex flex-1 flex-col p-5'}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                'rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                isFeatured
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/15',
              ].join(' ')}
            >
              {post.category}
            </span>
            {isFeatured && (
              <span className="rounded-full border border-brand-primary/30 bg-brand-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-brand-primary">
                Featured
              </span>
            )}
            <time className="text-xs font-medium text-brand-text/55 dark:text-white/50" dateTime={post.date}>
              {formatNewsDate(post.date)}
            </time>
            <span className="text-brand-text/35 dark:text-white/30" aria-hidden>
              ·
            </span>
            <span className="text-xs text-brand-text/55 dark:text-white/50">{post.readTime} read</span>
          </div>

          <h3
            className={[
              'font-semibold tracking-tight text-brand-text dark:text-white',
              isFeatured ? 'mt-4 text-2xl sm:text-3xl' : 'mt-3 text-base sm:text-lg',
            ].join(' ')}
          >
            {post.title}
          </h3>
          <p
            className={[
              'leading-relaxed text-brand-text/75 dark:text-white/70',
              isFeatured ? 'mt-3 text-base' : 'mt-2 line-clamp-2 text-sm',
            ].join(' ')}
          >
            {post.excerpt}
          </p>

          <button
            type="button"
            onClick={() => onRead?.(post)}
            className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-primary transition group-hover:gap-3"
          >
            Read more
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

export default function CareersNewsSection({ announcements = [], loading = false, error = false }) {
  const [newsSearch, setNewsSearch] = useState('')
  const [newsCategory, setNewsCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(INITIAL_NEWS_COUNT)
  const [activeArticle, setActiveArticle] = useState(null)

  const [newsletterName, setNewsletterName] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)

  const allNews = useMemo(() => {
    const staticPosts = INSIGHTS_POSTS.map((p) => ({
      ...p,
      icon: p.icon ?? 'layers',
      gradient: p.gradient ?? 'from-slate-100 via-orange-50/40 to-white',
      source: 'static',
    }))
    const apiPosts = announcements.map(mapAnnouncement)
    return [...staticPosts, ...apiPosts].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  }, [announcements])

  const categories = useMemo(() => {
    const set = new Set(allNews.map((p) => p.category))
    return ['All', ...Array.from(set).sort()]
  }, [allNews])

  const featuredPost = useMemo(() => allNews.find((p) => p.featured) ?? allNews[0] ?? null, [allNews])

  const filteredNews = useMemo(() => {
    const q = newsSearch.trim().toLowerCase()
    return allNews.filter((post) => {
      if (featuredPost && post.id === featuredPost.id) return false
      if (newsCategory !== 'All' && post.category !== newsCategory) return false
      if (!q) return true
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      )
    })
  }, [allNews, featuredPost, newsCategory, newsSearch])

  const visibleNews = filteredNews.slice(0, visibleCount)
  const hasMore = visibleCount < filteredNews.length

  const subscribeNewsletter = async (event) => {
    event.preventDefault()
    if (!newsletterEmail.trim()) return

    setNewsletterLoading(true)
    setNewsletterMessage('')
    setNewsletterSuccess(false)
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newsletterName.trim() || undefined,
          email: newsletterEmail.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Could not subscribe right now.')
      setNewsletterMessage(data?.message || 'You are subscribed. Welcome aboard.')
      setNewsletterSuccess(true)
      setNewsletterName('')
      setNewsletterEmail('')
    } catch (error) {
      setNewsletterMessage(error.message)
    } finally {
      setNewsletterLoading(false)
    }
  }

  return (
    <section
      id="careers-news"
      aria-labelledby="careers-news-heading"
      className="relative overflow-hidden border-t border-black/5 bg-gradient-to-b from-slate-50 via-brand-background-alt to-white pb-24 pt-20 dark:border-white/10 dark:from-brand-night dark:via-brand-night dark:to-brand-navy/30 sm:pb-28 sm:pt-24 lg:pb-28 lg:pt-28"
    >
      <div id="insights" className="absolute -top-24 scroll-mt-28" aria-hidden />

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-brand-primary/8 blur-3xl motion-safe:animate-blob" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-orange-300/10 blur-3xl motion-safe:animate-blob" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,140,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,26,0.04) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="app-container relative">
        <div className="max-w-3xl">
          <p className="section-eyebrow">{CAREERS_NEWS.eyebrow}</p>
          <h2 id="careers-news-heading" className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {CAREERS_NEWS.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-text/75 dark:text-white/70">{CAREERS_NEWS.subline}</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
          <div className="space-y-12">
            <div id="careers" className="scroll-mt-28">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Careers</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-brand-text dark:text-white">Join the Amalgated team</h3>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-brand-navy/50 dark:shadow-none">
                <div className="relative border-b border-black/5 bg-gradient-to-br from-brand-primary/10 via-orange-50/50 to-white p-6 sm:p-8 dark:border-white/10 dark:from-brand-primary/15 dark:via-brand-navy/60 dark:to-brand-navy/40">
                  <div className="absolute right-6 top-6 hidden h-20 w-20 rounded-full border border-brand-primary/20 bg-brand-primary/5 sm:block" aria-hidden />
                  <div className="relative max-w-xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/25 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-primary backdrop-blur dark:bg-brand-night/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary motion-safe:animate-pulse" aria-hidden />
                      No openings currently
                    </span>
                    <p className="mt-4 text-lg font-semibold text-brand-text dark:text-white">We are growing — and we want to hear from you</p>
                    <p className="mt-2 text-sm leading-relaxed text-brand-text/75 dark:text-white/70">{CAREERS_NEWS.growthMessage}</p>
                    <a href="#contact" className="btn-primary mt-6">
                      {CAREERS_NEWS.resumeCta}
                    </a>
                  </div>
                </div>

                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text/50 dark:text-white/45">Departments we hire for</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {CAREERS_NEWS.departments.map((dept) => (
                        <span
                          key={dept}
                          className="rounded-full border border-black/8 bg-brand-background px-3 py-1.5 text-xs font-semibold text-brand-text/80 dark:border-white/10 dark:bg-brand-night/50 dark:text-white/75"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-brand-text/75 dark:text-white/70">
                      <span className="font-semibold text-brand-text dark:text-white">Culture:</span> {CAREERS_NEWS.cultureSnippet}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text/50 dark:text-white/45">Hiring process</p>
                    <ol className="mt-3 space-y-3">
                      {CAREERS_NEWS.hiringProcess.map((step) => (
                        <li key={step.step} className="flex gap-3 rounded-2xl border border-black/5 bg-brand-background/80 p-3 dark:border-white/10 dark:bg-brand-night/40">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-xs font-bold text-brand-primary">
                            {step.step}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-brand-text dark:text-white">{step.title}</p>
                            <p className="mt-0.5 text-xs text-brand-text/65 dark:text-white/60">{step.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div id="news" className="scroll-mt-28">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">News & updates</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-brand-text dark:text-white">Latest from Amalgated</h3>
                  {loading && (
                    <p className="mt-3 text-sm text-brand-text/60 dark:text-white/55">Loading careers and news…</p>
                  )}
                  {error && !loading && (
                    <p className="mt-3 text-sm text-amber-700 dark:text-amber-200">
                      Could not load updates. Ensure the API is running, then refresh this page.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="sr-only" htmlFor="news-search">
                    Search news
                  </label>
                  <div className="relative">
                    <svg
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text/40"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      id="news-search"
                      type="search"
                      value={newsSearch}
                      onChange={(e) => {
                        setNewsSearch(e.target.value)
                        setVisibleCount(INITIAL_NEWS_COUNT)
                      }}
                      placeholder="Search updates…"
                      className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-3 text-sm outline-none ring-brand-primary transition focus:ring-2 sm:w-56 dark:border-white/10 dark:bg-brand-navy/50 dark:text-white"
                    />
                  </div>
                  <label className="sr-only" htmlFor="news-category">
                    Filter by category
                  </label>
                  <select
                    id="news-category"
                    value={newsCategory}
                    onChange={(e) => {
                      setNewsCategory(e.target.value)
                      setVisibleCount(INITIAL_NEWS_COUNT)
                    }}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none ring-brand-primary focus:ring-2 dark:border-white/10 dark:bg-brand-navy/50 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {featuredPost && (
                <div className="mt-8 hidden lg:block">
                  <NewsCard post={featuredPost} variant="featured" onRead={setActiveArticle} />
                </div>
              )}

              {featuredPost && (
                <div className="mt-8 lg:hidden">
                  <Swiper modules={[Pagination]} spaceBetween={16} slidesPerView={1.05} pagination={{ clickable: true }}>
                    <SwiperSlide>
                      <NewsCard post={featuredPost} variant="featured" onRead={setActiveArticle} />
                    </SwiperSlide>
                  </Swiper>
                </div>
              )}

              <div className="mt-8 space-y-4">
                <div className="hidden lg:block">
                  {visibleNews.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-black/15 p-6 text-sm text-brand-text/65 dark:border-white/15 dark:text-white/60">
                      No updates match your search. Try another keyword or category.
                    </p>
                  )}
                  {visibleNews.map((post) => (
                    <NewsCard key={post.id} post={post} onRead={setActiveArticle} />
                  ))}
                </div>

                <div className="lg:hidden">
                  {visibleNews.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-black/15 p-6 text-sm text-brand-text/65 dark:border-white/15 dark:text-white/60">
                      No updates match your search.
                    </p>
                  ) : (
                    <Swiper modules={[Pagination]} spaceBetween={14} slidesPerView={1.08} pagination={{ clickable: true }}>
                      {visibleNews.map((post) => (
                        <SwiperSlide key={post.id}>
                          <NewsCard post={post} onRead={setActiveArticle} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              </div>

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + LOAD_MORE_STEP)}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-brand-text shadow-soft transition hover:border-brand-primary/35 hover:text-brand-primary dark:border-white/10 dark:bg-brand-navy/40 dark:text-white dark:hover:text-brand-gold"
                  >
                    Load more news
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-brand-primary/20 bg-white shadow-[0_24px_70px_rgba(255,140,26,0.14)] dark:border-brand-primary/25 dark:bg-brand-navy/50">
              <div className="border-b border-brand-primary/15 bg-gradient-to-br from-brand-primary via-orange-500 to-amber-500 px-6 py-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">Newsletter</p>
                <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight">{CAREERS_NEWS.newsletter.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-brand-text/75 dark:text-white/70">{CAREERS_NEWS.newsletter.subline}</p>
                <ul className="mt-4 space-y-2">
                  {CAREERS_NEWS.newsletter.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2.5 text-sm text-brand-text/80 dark:text-white/75">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex items-center gap-2 text-xs font-medium text-brand-text/60 dark:text-white/55">
                  <svg className="h-4 w-4 text-brand-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {CAREERS_NEWS.newsletter.socialProof}
                </p>

                <form className="mt-5 space-y-3" onSubmit={subscribeNewsletter}>
                  <input
                    type="text"
                    value={newsletterName}
                    onChange={(e) => setNewsletterName(e.target.value)}
                    placeholder="Your name (optional)"
                    autoComplete="name"
                    className="w-full rounded-xl border border-black/12 bg-brand-background/80 px-3.5 py-3 text-sm outline-none transition focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/25 dark:border-white/10 dark:bg-brand-night/50 dark:text-white"
                  />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Work email"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-black/12 bg-brand-background/80 px-3.5 py-3 text-sm outline-none transition focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/25 dark:border-white/10 dark:bg-brand-night/50 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="group relative w-full overflow-hidden rounded-xl bg-brand-primary px-5 py-3.5 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover disabled:opacity-60"
                  >
                    <span className="relative z-10">{newsletterLoading ? 'Subscribing…' : 'Subscribe now'}</span>
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:group-hover:animate-shimmer"
                      aria-hidden
                    />
                  </button>
                </form>

                {newsletterMessage && (
                  <p
                    className={[
                      'mt-3 flex items-start gap-2 text-sm',
                      newsletterSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-brand-text/80 dark:text-white/70',
                    ].join(' ')}
                    role="status"
                  >
                    {newsletterSuccess && (
                      <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {newsletterMessage}
                  </p>
                )}
                <p className="mt-3 text-[11px] leading-relaxed text-brand-text/55 dark:text-white/50">{CAREERS_NEWS.newsletter.privacy}</p>

                <a
                  href={CAREERS_NEWS.newsletter.resourceHref}
                  className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-brand-primary/30 bg-brand-primary/5 p-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-primary shadow-soft dark:bg-brand-night/80">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 3v12M8 11l4 4 4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {CAREERS_NEWS.newsletter.resourceLabel}
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-brand-navy/40">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">Company at a glance</p>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                {CAREERS_NEWS.companyStats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-2xl font-semibold tracking-tight text-brand-text dark:text-white">{stat.value}</dt>
                    <dd className="mt-0.5 text-xs font-medium text-brand-text/60 dark:text-white/55">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-brand-navy/40">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">Recent achievements</p>
              <ul className="mt-4 space-y-3">
                {CAREERS_NEWS.achievements.map((item) => (
                  <li key={item.title} className="border-l-2 border-brand-primary/40 pl-3">
                    <p className="text-sm font-semibold text-brand-text dark:text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs text-brand-text/65 dark:text-white/60">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-brand-navy/40">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">Upcoming events</p>
              <ul className="mt-4 space-y-3">
                {CAREERS_NEWS.upcomingEvents.map((event) => (
                  <li key={event.title} className="flex gap-3 rounded-2xl bg-brand-background/90 p-3 dark:bg-brand-night/40">
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-primary/10 text-center text-brand-primary">
                      <span className="text-[10px] font-bold uppercase leading-none">{event.date.split(' ')[0]}</span>
                      <span className="text-xs font-semibold leading-tight">{event.date.split(' ')[1]?.replace(',', '')}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-text dark:text-white">{event.title}</p>
                      <p className="text-xs text-brand-text/60 dark:text-white/55">{event.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-black/8 bg-gradient-to-br from-brand-secondary to-brand-navy p-5 text-white shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Featured services</p>
              <ul className="mt-4 space-y-2">
                {CAREERS_NEWS.featuredServices.map((svc) => (
                  <li key={svc.title}>
                    <a href={svc.href} className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition hover:border-brand-primary/40 hover:bg-white/10">
                      <span>
                        <span className="block text-sm font-semibold">{svc.title}</span>
                        <span className="text-xs text-white/60">{svc.desc}</span>
                      </span>
                      <svg className="h-4 w-4 text-brand-gold transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                {CAREERS_NEWS.socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-white/75 underline-offset-2 hover:text-brand-gold hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <a href="#contact" className="btn-primary mt-5 w-full">
                Contact support
              </a>
              <p className="mt-3 text-center text-xs text-white/55">
                <a href={`mailto:${COMPANY.email}`} className="hover:text-brand-gold">
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </div>

      {activeArticle && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-modal-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveArticle(null)
          }}
        >
          <article className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-3xl border border-white/10 bg-white p-6 shadow-2xl dark:bg-brand-navy sm:max-w-xl">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-primary">{activeArticle.category}</span>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-semibold text-brand-text/70 hover:border-brand-primary/35 dark:border-white/10 dark:text-white/70"
              >
                Close
              </button>
            </div>
            <h3 id="article-modal-title" className="mt-4 text-2xl font-semibold text-brand-text dark:text-white">
              {activeArticle.title}
            </h3>
            <p className="mt-2 text-xs text-brand-text/55 dark:text-white/50">
              {formatNewsDate(activeArticle.date)} · {activeArticle.readTime} read
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-text/80 dark:text-white/75">{activeArticle.excerpt}</p>
            <a href="#contact" className="btn-primary mt-6 w-full" onClick={() => setActiveArticle(null)}>
              Discuss with our team
            </a>
          </article>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white/95 p-3 backdrop-blur-md dark:border-white/10 dark:bg-brand-night/95 lg:hidden">
        <a href="#careers-news" className="btn-primary w-full text-center">
          Subscribe for updates
        </a>
      </div>
    </section>
  )
}
