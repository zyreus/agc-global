export default function WaveDivider({ className }) {
  return (
    <div className={['relative -mt-px h-14 w-full overflow-hidden sm:h-16', className].filter(Boolean).join(' ')} aria-hidden>
      <svg className="h-full w-full text-brand-background dark:text-brand-night" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          fill="currentColor"
          d="M0 40 C 240 0, 480 80, 720 40 S 1200 0, 1440 40 L 1440 80 L 0 80 Z"
        />
      </svg>
    </div>
  )
}
