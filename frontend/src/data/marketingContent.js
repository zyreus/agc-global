export const PARTNER_LABELS = [
  'Public Sector',
  'Financial Services',
  'Legal & Compliance',
  'Healthcare Ops',
  'Education',
  'Retail & Logistics',
]

export const INDUSTRY_SOLUTIONS = [
  {
    id: 'gov',
    title: 'Government Systems',
    blurb: 'Secure workflows, citizen-facing portals, and auditable records built for compliance-first delivery.',
    tags: ['RBAC', 'Audit trails', 'Uptime'],
  },
  {
    id: 'lending',
    title: 'Lending Systems',
    blurb: 'Origination, underwriting support, and servicing dashboards with clear operational visibility.',
    tags: ['KYC-ready', 'Reporting', 'Integrations'],
  },
  {
    id: 'crm',
    title: 'CRM Platforms',
    blurb: 'Pipeline management, automation, and integrations that keep revenue teams aligned and measurable.',
    tags: ['Sales ops', 'Automations', 'APIs'],
  },
  {
    id: 'ai',
    title: 'AI Chatbots',
    blurb: 'Guided support experiences with human handoff, knowledge grounding, and measurable resolution paths.',
    tags: ['Support', 'Lead capture', 'Analytics'],
  },
  {
    id: 'security',
    title: 'Security Infrastructure',
    blurb: 'Hardening, monitoring posture, and maintenance programs that reduce operational risk over time.',
    tags: ['Hardening', 'Backups', 'Monitoring'],
  },
]

export const SERVICE_CATEGORIES = [
  {
    id: 'it',
    title: 'IT Solutions & Systems',
    icon: 'layers',
    summary: 'End-to-end delivery from discovery to production support.',
    bullets: ['Custom web applications', 'Business management systems', 'API development & integration', 'Cloud-ready architectures'],
    deliverables: ['Architecture notes', 'Release plan', 'Runbooks'],
    timeline: '2–10+ weeks (phase 1)',
    support: 'SLA-backed maintenance options',
  },
  {
    id: 'dev',
    title: 'Software Development',
    icon: 'code',
    summary: 'Modern stacks with maintainability and performance in mind.',
    bullets: ['Laravel & PHP', 'React frontends', 'Mobile-friendly UX', 'Performance tuning'],
    deliverables: ['Repo + CI guidance', 'QA checklist', 'Handover docs'],
    timeline: 'Sprint-based delivery',
    support: 'Hotfix windows available',
  },
  {
    id: 'biz',
    title: 'Business Solutions',
    icon: 'chart',
    summary: 'Automation and visibility where operations meet technology.',
    bullets: ['Process automation', 'Data management', 'Reporting & analytics', 'Digital transformation consulting'],
    deliverables: ['Workflow maps', 'KPI definitions', 'Training'],
    timeline: 'Workshop → pilot → rollout',
    support: 'Advisory retainers',
  },
  {
    id: 'sec',
    title: 'Security & Maintenance',
    icon: 'shield',
    summary: 'Protect systems, recover confidently, and keep releases safe.',
    bullets: ['Security implementation', 'Maintenance programs', 'Backup & recovery'],
    deliverables: ['Risk review', 'Patch cadence', 'Backup tests'],
    timeline: 'Ongoing partnership',
    support: '24/7 options by scope',
  },
]

export const PORTFOLIO_ITEMS = [
  {
    id: 'crm-dash',
    category: 'crm',
    title: 'CRM Operations Dashboard',
    outcome: 'Unified pipeline reporting for leadership reviews.',
    tags: ['CRM', 'Dashboards', 'KPIs'],
    before: 'Spreadsheet-heavy tracking and inconsistent stage definitions.',
    after: 'Single source of truth with role-based views and exportable reports.',
  },
  {
    id: 'lending',
    category: 'lending',
    title: 'Lending Workflow Console',
    outcome: 'Faster case handling with clearer audit trails.',
    tags: ['Lending', 'Compliance', 'Workflow'],
    before: 'Manual handoffs between teams slowed decisions.',
    after: 'Structured queues, notes, and approvals with traceability.',
  },
  {
    id: 'chatbot',
    category: 'ai',
    title: 'AI Support + Lead Capture',
    outcome: 'Higher qualified inquiries with fewer repetitive tickets.',
    tags: ['AI', 'Support', 'Automation'],
    before: 'Peak-hour backlog reduced response quality.',
    after: 'Guided triage, FAQs, and seamless human escalation.',
  },
  {
    id: 'legal',
    category: 'legal',
    title: 'Legal Case Intake Portal',
    outcome: 'Cleaner intake data and fewer missing documents.',
    tags: ['Legal', 'Forms', 'Portal'],
    before: 'Email-only intake caused rework and delays.',
    after: 'Structured submissions with validation and status tracking.',
  },
  {
    id: 'gov',
    category: 'government',
    title: 'Government Records Module',
    outcome: 'Improved reliability for high-compliance workloads.',
    tags: ['Government', 'Security', 'Records'],
    before: 'Fragmented access controls across modules.',
    after: 'Centralized permissions model and operational monitoring.',
  },
  {
    id: 'integration',
    category: 'integration',
    title: 'Enterprise Integration Layer',
    outcome: 'Stable sync between core systems and third-party tools.',
    tags: ['APIs', 'Integrations', 'ETL'],
    before: 'Brittle point-to-point scripts.',
    after: 'Documented endpoints, retries, and observability hooks.',
  },
]

export const TESTIMONIALS = [
  {
    id: 't1',
    quote: 'AGC helped us move from ad-hoc tools to a system we can actually scale. Communication was clear and delivery was disciplined.',
    name: 'Operations Director',
    org: 'Services company',
  },
  {
    id: 't2',
    quote: 'We needed a partner who could translate business requirements into working software without endless rework. AGC delivered.',
    name: 'IT Manager',
    org: 'Regional enterprise',
  },
  {
    id: 't3',
    quote: 'The team was thoughtful about security and maintainability — not just shipping features. That mattered for our compliance stakeholders.',
    name: 'Program Lead',
    org: 'Public sector initiative',
  },
]

export const PROCESS_STEPS = [
  { title: 'Discover', detail: 'Goals, constraints, stakeholders, success metrics.' },
  { title: 'Design', detail: 'UX flows, architecture, and delivery milestones.' },
  { title: 'Build', detail: 'Iterative releases with QA and visibility.' },
  { title: 'Launch', detail: 'Hardening, training, cutover, and monitoring.' },
  { title: 'Scale', detail: 'Optimization, support, and continuous improvement.' },
]
