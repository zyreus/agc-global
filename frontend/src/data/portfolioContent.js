/**
 * AGC Global portfolio — case studies, categories, and featured projects.
 * Source of truth for Portfolio page and homepage preview.
 */

export const PORTFOLIO_CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'web-applications', label: 'Web Applications' },
  { id: 'enterprise-systems', label: 'Enterprise Systems' },
  { id: 'hris', label: 'Human Resource Information Systems (HRIS)' },
  { id: 'lending-financial', label: 'Lending & Financial Systems' },
  { id: 'cloud-solutions', label: 'Cloud Solutions' },
  { id: 'network-infrastructure', label: 'Network Infrastructure' },
  { id: 'bpa', label: 'Business Process Automation' },
  { id: 'custom-software', label: 'Custom Software Development' },
]

/** Featured projects highlighted on the Portfolio landing page */
export const PORTFOLIO_FEATURED_IDS = [
  'hris-smartdtr',
  'ticketing-system',
  'amalgated-lending',
  'amalgated-world',
  'mconpinco',
  'amalgated-properties',
  'custom-enterprise-systems',
  'cloud-infrastructure',
]

/** Top 3 shown on homepage only */
export const PORTFOLIO_HOMEPAGE_IDS = ['amalgated-lending', 'hris-smartdtr', 'ticketing-system']

export const PORTFOLIO_PROJECTS = [
  {
    id: 'amalgated-lending',
    name: 'Amalgated Lending System',
    shortDescription:
      'End-to-end lending platform with origination, underwriting workflows, collections, and compliance-ready audit trails.',
    categoryId: 'lending-financial',
    client: 'Amalgated Group',
    featured: true,
    image: './portfolio/amalgated-lending.png',
    imageAlt: 'Amalgated Lending System — loan management dashboard',
    gradient: 'from-emerald-800/70 via-teal-900/60 to-slate-900',
    challenge:
      'Loan operations relied on disconnected spreadsheets and manual tracking, slowing underwriting decisions and increasing compliance risk across branches.',
    solution:
      'AGC delivered a centralized lending management system with defined pipeline stages, document tracking, role-based approvals, and executive dashboards for portfolio visibility.',
    technologies: ['Laravel', 'React', 'MySQL', 'REST APIs', 'Reporting Engine'],
    keyFeatures: [
      'Loan origination & application intake',
      'Underwriting workflow & document management',
      'Collections dashboard & payment tracking',
      'Regulatory reporting & audit trails',
      'Multi-branch pipeline visibility',
    ],
    businessImpact: [
      'Faster loan processing with clearer stage ownership',
      'Reduced operational risk through auditable workflows',
      'Leadership visibility into pipeline and portfolio health',
      'Compliance-ready documentation for regulated lending',
    ],
    relatedIds: ['hris-smartdtr', 'ticketing-system'],
  },
  {
    id: 'hris-smartdtr',
    name: 'Human Resource Information System (HRIS)',
    shortDescription:
      'SmartDTR digital time & attendance with biometric integration, leave management, and payroll-ready exports.',
    categoryId: 'hris',
    client: 'Multi-site enterprise clients',
    featured: true,
    image: './portfolio/hris-smartdtr.png',
    imageAlt: 'HRIS SmartDTR — workforce timekeeping terminal and dashboard',
    gradient: 'from-violet-800/70 via-purple-900/50 to-slate-900',
    challenge:
      'Paper-based DTR and manual payroll reconciliation caused errors, compliance gaps, and limited visibility for HR across multiple locations.',
    solution:
      'AGC built SmartDTR — a workforce platform with digital timekeeping, biometric device integration, leave and overtime rules, and exportable payroll datasets.',
    technologies: ['Laravel', 'Device APIs', 'React', 'MySQL', 'Biometric Integration'],
    keyFeatures: [
      'Digital time & attendance (SmartDTR)',
      'Biometric and device integration',
      'Leave & overtime rule engine',
      'Employee self-service portal',
      'Payroll-ready export reports',
    ],
    businessImpact: [
      'Accurate workforce timekeeping at scale',
      'Reduced payroll errors and reconciliation time',
      'Real-time HR visibility across sites',
      'Improved labor compliance documentation',
    ],
    relatedIds: ['amalgated-lending', 'ticketing-system'],
  },
  {
    id: 'ticketing-system',
    name: 'Help Desk & Ticketing System',
    shortDescription:
      'AGC ServiceDesk — centralized support ticketing with SLA tracking, assignments, and CRM-linked conversations.',
    categoryId: 'enterprise-systems',
    client: 'Enterprise & telecom clients',
    featured: true,
    image: './portfolio/ticketing-system.svg',
    imageAlt: 'AGC ServiceDesk — help desk and ticketing dashboard',
    gradient: 'from-teal-800/70 via-cyan-900/50 to-slate-900',
    challenge:
      'Support requests were scattered across email, chat, and spreadsheets with no ownership, SLA visibility, or escalation discipline.',
    solution:
      'AGC implemented a service desk platform with ticket priorities, team assignments, SLA timers, notification workflows, and CRM integration for unified customer history.',
    technologies: ['Laravel', 'React', 'RBAC', 'WebSockets', 'CRM API Integration'],
    keyFeatures: [
      'Multi-channel ticket intake',
      'Priority, assignment & escalation rules',
      'SLA tracking & breach alerts',
      'Knowledge base & canned responses',
      'CRM-linked conversation history',
    ],
    businessImpact: [
      'Every support request owned and traceable',
      'Reduced SLA breaches through proactive alerts',
      'Higher first-contact resolution rates',
      'Unified view of customer support history',
    ],
    relatedIds: ['hris-smartdtr', 'amalgated-lending'],
  },
  {
    id: 'amalgated-world',
    name: 'Amalgated World Website',
    shortDescription:
      'Corporate digital platform unifying brand presence, stakeholder engagement, and lead capture for the Amalgated group.',
    categoryId: 'web-applications',
    client: 'Amalgated Group',
    featured: true,
    image: './portfolio/amalgated-world.svg',
    imageAlt: 'Amalgated World — corporate web platform',
    gradient: 'from-orange-600/80 via-amber-500/60 to-slate-900',
    challenge:
      'Fragmented web presence across group entities created inconsistent branding and no central engagement funnel for stakeholders.',
    solution:
      'AGC designed and built a cohesive corporate web platform with structured content architecture, responsive UX, lead capture, and scalable CMS foundations.',
    technologies: ['React', 'Laravel', 'Tailwind CSS', 'Cloud Hosting', 'SEO'],
    keyFeatures: [
      'Unified corporate brand experience',
      'Responsive, accessibility-aware design',
      'Lead capture & inquiry routing',
      'Content management for group updates',
      'Performance-optimized page delivery',
    ],
    businessImpact: [
      'Single authoritative digital presence for the group',
      'Increased qualified inbound inquiries',
      'Faster content updates without developer dependency',
      'Improved stakeholder trust through professional UX',
    ],
    relatedIds: ['amalgated-properties', 'mconpinco'],
  },
  {
    id: 'mconpinco',
    name: 'MCONPINCO Home Improvement Website',
    shortDescription:
      'Customer-facing web platform for home improvement services with product catalog, inquiries, and brand storytelling.',
    categoryId: 'web-applications',
    client: 'MCONPINCO',
    featured: true,
    image: './portfolio/mconpinco.svg',
    imageAlt: 'MCONPINCO — home improvement corporate website',
    gradient: 'from-slate-700 via-slate-800 to-orange-900/70',
    challenge:
      'Limited digital presence restricted customer discovery, quote requests, and brand credibility in a competitive home improvement market.',
    solution:
      'AGC delivered a conversion-focused website with service showcases, inquiry forms, mobile-first layout, and admin tools for content updates.',
    technologies: ['Laravel', 'React', 'MySQL', 'Form Workflows', 'Analytics'],
    keyFeatures: [
      'Service & product showcase pages',
      'Quote and inquiry capture forms',
      'Mobile-first responsive design',
      'Admin content management',
      'SEO and performance foundations',
    ],
    businessImpact: [
      'Stronger brand credibility online',
      'More inbound quote requests',
      'Reduced reliance on phone-only sales',
      'Marketing team autonomy for content updates',
    ],
    relatedIds: ['amalgated-world', 'amalgated-properties'],
  },
  {
    id: 'amalgated-properties',
    name: 'Amalgated Properties Website',
    shortDescription:
      'Property management web suite with listings, tenant workflows, and billing integration for portfolio visibility.',
    categoryId: 'web-applications',
    client: 'Amalgated Properties',
    featured: true,
    image: './portfolio/amalgated-properties.svg',
    imageAlt: 'Amalgated Properties — property management platform',
    gradient: 'from-blue-900/70 via-indigo-900/50 to-slate-900',
    challenge:
      'Property data scattered across tools made billing reconciliation, occupancy tracking, and tenant communication error-prone.',
    solution:
      'AGC built a property management platform with listing modules, tenant portals, billing hooks, and executive dashboards for portfolio oversight.',
    technologies: ['Laravel', 'React', 'REST APIs', 'MySQL', 'Payment Integration'],
    keyFeatures: [
      'Property listing & portfolio dashboard',
      'Tenant portal & communication tools',
      'Billing integration & reconciliation',
      'Occupancy & lease tracking',
      'Document management for units',
    ],
    businessImpact: [
      'Unified property portfolio visibility',
      'Fewer billing reconciliation errors',
      'Improved tenant satisfaction through self-service',
      'Leadership KPIs for occupancy and revenue',
    ],
    relatedIds: ['amalgated-world', 'amalgated-lending'],
  },
  {
    id: 'custom-enterprise-systems',
    name: 'Custom Enterprise Systems',
    shortDescription:
      'Mission-critical operations platforms with RBAC, workflow engines, and executive dashboards for complex organizations.',
    categoryId: 'enterprise-systems',
    client: 'Corporate & group entities',
    featured: true,
    image: './portfolio/custom-enterprise.svg',
    imageAlt: 'Custom enterprise operations platform',
    gradient: 'from-slate-700 via-slate-800 to-orange-900/70',
    challenge:
      'Manual processes and spreadsheet-driven operations limited scalability, audit readiness, and cross-department visibility.',
    solution:
      'AGC engineered centralized enterprise systems with role-based workflows, approval chains, operational modules, and leadership reporting — tailored to how teams actually work.',
    technologies: ['Laravel', 'React', 'MySQL', 'RBAC', 'REST APIs'],
    keyFeatures: [
      'Role-based access control & audit trails',
      'Workflow & approval engines',
      'Executive dashboards & KPI reporting',
      'Multi-module operations console',
      'Document & records management',
    ],
    businessImpact: [
      'Centralized operations with traceable decision history',
      'Reduced manual handoffs between departments',
      'Audit-ready workflows for compliance stakeholders',
      'Executive visibility without chasing spreadsheets',
    ],
    relatedIds: ['mconpinco', 'ticketing-system'],
  },
  {
    id: 'cloud-infrastructure',
    name: 'Cloud & Infrastructure Projects',
    shortDescription:
      'Cloud migration, hybrid infrastructure, and network modernization with monitoring, DR planning, and cost optimization.',
    categoryId: 'cloud-solutions',
    client: 'Enterprise clients',
    featured: true,
    image: './portfolio/cloud-infrastructure.svg',
    imageAlt: 'Cloud and infrastructure deployment',
    gradient: 'from-sky-900/70 via-blue-900/50 to-slate-900',
    challenge:
      'On-premise infrastructure could not scale with business growth; downtime risk and rising operational costs threatened continuity.',
    solution:
      'AGC planned and executed cloud-ready infrastructure — migration paths, network segmentation, backup verification, CI/CD foundations, and observability for long-term operations.',
    technologies: ['AWS / Azure', 'Docker', 'CI/CD', 'VPN & Firewall', 'Monitoring'],
    keyFeatures: [
      'Cloud migration & hybrid architecture',
      'Network design & security segmentation',
      'Backup & disaster recovery planning',
      'Infrastructure monitoring & alerting',
      'Cost optimization reviews',
    ],
    businessImpact: [
      'Improved uptime and operational resilience',
      'Scalable capacity aligned to business demand',
      'Reduced unplanned downtime and recovery time',
      'Documented runbooks for IT continuity',
    ],
    relatedIds: ['custom-enterprise-systems', 'hris-smartdtr'],
  },
]

export function getCategoryLabel(categoryId) {
  return PORTFOLIO_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId
}

export function getPortfolioProject(id) {
  return PORTFOLIO_PROJECTS.find((p) => p.id === id) ?? null
}

export function getHomepagePortfolio() {
  return PORTFOLIO_HOMEPAGE_IDS.map((id) => getPortfolioProject(id)).filter(Boolean)
}

export function getFeaturedPortfolio() {
  return PORTFOLIO_FEATURED_IDS.map((id) => getPortfolioProject(id)).filter(Boolean)
}

export function getRelatedProjects(id, limit = 3) {
  const project = getPortfolioProject(id)
  if (!project) return []
  const related = (project.relatedIds ?? [])
    .map(getPortfolioProject)
    .filter(Boolean)
    .slice(0, limit)
  if (related.length >= limit) return related
  const sameCategory = PORTFOLIO_PROJECTS.filter(
    (p) => p.id !== id && p.categoryId === project.categoryId && !related.find((r) => r.id === p.id)
  )
  return [...related, ...sameCategory].slice(0, limit)
}

export function searchPortfolio(projects, query) {
  const q = query.trim().toLowerCase()
  if (!q) return projects
  return projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      (p.client ?? '').toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q)) ||
      p.keyFeatures.some((f) => f.toLowerCase().includes(q))
  )
}

export function filterPortfolioByCategory(projects, categoryId) {
  if (!categoryId || categoryId === 'all') return projects
  return projects.filter((p) => p.categoryId === categoryId)
}
