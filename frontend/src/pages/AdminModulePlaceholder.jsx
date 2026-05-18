import { Link, useParams } from 'react-router-dom'

const MODULES = {
  cms: {
    title: 'Website CMS',
    eyebrow: 'Marketing & content',
    description:
      'Homepage editor, services, portfolio, blog, testimonials, SEO, media library, and landing builder — unified with the public site brand.',
    bullets: ['Block-based pages', 'SEO & OG metadata', 'Media library', 'CTA & form routing to CRM'],
  },
  hris: {
    title: 'HRIS',
    eyebrow: 'People operations',
    description:
      'Employee records, SmartDTR sync, attendance, leave, payroll hooks, performance, and recruitment in one workspace.',
    bullets: ['Employee directory', 'Attendance & leave', 'SmartDTR integration', 'Employee self-service portal'],
  },
  projects: {
    title: 'Project management',
    eyebrow: 'Delivery',
    description:
      'Timelines, Kanban, milestones, client deliverables, resource allocation, billing linkage, and QA workflows.',
    bullets: ['Kanban & milestones', 'Team assignments', 'Client deliverables', 'Billing integration'],
  },
  chatbot: {
    title: 'AI & chatbot',
    eyebrow: 'Intelligence',
    description:
      'Train on AGC services, FAQ governance, knowledge uploads, escalation rules, and performance analytics tied to live chat.',
    bullets: ['FAQ & knowledge base', 'Intent & escalation', 'Website widget config', 'Conversation analytics'],
  },
  analytics: {
    title: 'Analytics & reporting',
    eyebrow: 'Insights',
    description:
      'Revenue, traffic, conversion, retention, service profitability, and operational KPIs in executive-ready views.',
    bullets: ['Executive dashboards', 'Lead & funnel metrics', 'Retention & LTV views', 'Export & schedules'],
  },
  security: {
    title: 'Security & infrastructure',
    eyebrow: 'Governance',
    description:
      'Roles and permissions, API keys, audit trails, backup posture, and deployment health for investor-grade operations.',
    bullets: ['RBAC & audit logs', 'API key vault', 'Backup & DR status', 'Cloud deployment monitoring'],
  },
}

export default function AdminModulePlaceholder() {
  const { slug } = useParams()
  const mod = MODULES[slug] ?? {
    title: 'Workspace',
    eyebrow: 'AGC command center',
    description: 'This area is on the product roadmap.',
    bullets: [],
  }

  return (
    <section>
      <nav className="text-xs font-medium text-brand-text/50 dark:text-white/45">
        <Link to="/admin/dashboard" className="transition hover:text-brand-primary">
          Command center
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-text dark:text-white/80">{mod.title}</span>
      </nav>

      <div className="mt-6 rounded-3xl border border-black/10 bg-gradient-to-br from-white via-white to-brand-background/80 p-8 shadow-soft dark:border-white/10 dark:from-brand-navy/50 dark:via-brand-night/60 dark:to-brand-night sm:p-10">
        <p className="section-eyebrow">{mod.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text dark:text-white">{mod.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-text/70 dark:text-white/65">{mod.description}</p>

        {mod.bullets.length > 0 && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {mod.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-2xl border border-black/8 bg-white/70 px-4 py-3 text-sm text-brand-text/85 dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-brand-primary transition hover:bg-brand-primary-hover"
          >
            Back to dashboard
          </Link>
          <Link
            to="/admin/crm"
            className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-6 py-2.5 text-sm font-semibold text-brand-text transition hover:border-brand-primary/40 hover:bg-brand-background dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Open Chat & CRM
          </Link>
        </div>

        <p className="mt-8 text-xs text-brand-text/45 dark:text-white/40">
          Module scaffolding aligns with the enterprise roadmap — APIs and Filament resources wire in per phase.
        </p>
      </div>
    </section>
  )
}
