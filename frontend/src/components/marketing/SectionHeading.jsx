export default function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  const alignClass =
    align === 'center' ? 'text-center mx-auto' : align === 'right' ? 'text-right ml-auto' : 'text-left'

  return (
    <div className={['max-w-3xl', alignClass, className].filter(Boolean).join(' ')}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">{eyebrow}</p>
      )}
      {title && (
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-text dark:text-white sm:text-4xl">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-4 text-base leading-relaxed text-brand-text/75 dark:text-white/70">{description}</p>
      )}
    </div>
  )
}
