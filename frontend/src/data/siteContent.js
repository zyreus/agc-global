/**
 * AGC Global site content — solutions, industries, navigation, SEO.
 * Products are integrated into the Portfolio (see portfolioContent.js).
 */

export const SOLUTIONS_CATALOG = [
  {
    id: 'software-dev',
    title: 'Software Development',
    icon: 'code',
    summary: 'Custom web, mobile, and enterprise applications engineered for your workflows — from discovery through deployment.',
    highlights: ['Requirements & UX discovery', 'Full-stack engineering', 'Legacy modernization', 'QA & performance testing'],
  },
  {
    id: 'infrastructure',
    title: 'Network Infrastructure',
    icon: 'network',
    summary: 'Reliable LAN/WAN design, segmentation, firewall configuration, and monitoring built for uptime and audit readiness.',
    highlights: ['Network design & setup', 'Firewall & VLAN configuration', 'VPN & remote access', 'Documentation & handover'],
  },
  {
    id: 'cloud',
    title: 'Cloud Solutions',
    icon: 'cloud',
    summary: 'Scalable cloud deployments on AWS, Azure, and GCP with cost-aware operations, CI/CD, and disaster recovery.',
    highlights: ['Cloud migration & readiness', 'Infrastructure as code', 'CI/CD pipeline setup', 'Cost optimization'],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: 'shield',
    summary: 'Security assessments, hardening, RBAC, encryption, and incident readiness embedded from day one.',
    highlights: ['Risk assessments', 'Access control & encryption', 'Security hardening', 'Incident response planning'],
  },
  {
    id: 'automation',
    title: 'Business Process Automation',
    icon: 'api',
    summary: 'Workflow engines, approval chains, and operational dashboards that eliminate manual bottlenecks.',
    highlights: ['Workflow automation', 'CRM & ERP integration', 'Approval chains', 'KPI dashboards'],
  },
  {
    id: 'it-consulting',
    title: 'IT Consulting',
    icon: 'chart',
    summary: 'Technology roadmaps, architecture reviews, and strategic advisory aligned to measurable business outcomes.',
    highlights: ['IT strategy & roadmaps', 'Architecture assessments', 'Vendor evaluation', 'Digital transformation advisory'],
  },
]

/** Industries served — short, focused (no portfolio duplication) */
export const INDUSTRIES = [
  {
    id: 'finance-lending',
    title: 'Finance & Lending',
    overview: 'Regulated lending operations, credit workflows, and financial reporting platforms built for compliance and scale.',
    focus: ['Loan origination systems', 'Underwriting support', 'Collections & portfolio dashboards', 'Audit-ready reporting'],
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    overview: 'Property management, tenant portals, and billing integration for developers and asset managers.',
    focus: ['Property listing platforms', 'Tenant & lease management', 'Billing reconciliation', 'Portfolio visibility'],
  },
  {
    id: 'retail-ecommerce',
    title: 'Retail & E-Commerce',
    overview: 'Customer-facing storefronts, inventory visibility, and order management for retail and omnichannel brands.',
    focus: ['E-commerce platforms', 'Inventory integration', 'Order & checkout flows', 'Customer engagement portals'],
  },
  {
    id: 'logistics-transport',
    title: 'Logistics & Transportation',
    overview: 'Dispatch, fleet coordination, and operational dashboards for distribution and transport networks.',
    focus: ['Dispatch & tracking systems', 'Route optimization', 'Warehouse coordination', 'Real-time operational KPIs'],
  },
  {
    id: 'corporate-enterprise',
    title: 'Corporate Enterprises',
    overview: 'Mission-critical internal systems, HRIS, service desks, and executive dashboards for multi-department organizations.',
    focus: ['Enterprise operations platforms', 'HRIS & workforce systems', 'Service desk & ticketing', 'Executive reporting'],
  },
]

export function getIndustryById(id) {
  return INDUSTRIES.find((i) => i.id === id) ?? null
}

export const ABOUT_HUB = {
  milestones: [
    { year: '2012', title: 'Company Founded', detail: 'AGC established as a technology solutions provider in the Philippines.' },
    { year: '2016', title: 'Enterprise Expansion', detail: 'First large-scale enterprise and government platform deliveries.' },
    { year: '2019', title: 'HRIS SmartDTR Launch', detail: 'Proprietary workforce timekeeping platform deployed across multi-site clients.' },
    { year: '2022', title: 'Lending & Property Platforms', detail: 'Amalgated Lending and Properties suites reach production at scale.' },
    { year: '2024', title: 'AI & Automation', detail: 'AI-powered support, lead capture, and CRM integration across client platforms.' },
    { year: '2026', title: '210+ Projects Delivered', detail: 'Continued growth with 98% client satisfaction and 55+ systems under active support.' },
  ],
}

/** Primary navigation */
export const NAV_ROUTES = [
  { path: '/solutions', label: 'Solutions' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/industries', label: 'Industries' },
  { path: '/about', label: 'About' },
  { path: '/team', label: 'Our Team' },
  { path: '/news', label: 'News & Insights' },
]

export const FOOTER_ROUTES = [
  { path: '/', label: 'Home' },
  ...NAV_ROUTES,
  { path: '/contact', label: 'Contact' },
]

export const HOME_FEATURED = {
  solutions: 3,
  portfolio: 3,
  industries: 5,
}

export const PRIMARY_SOLUTION_IDS = SOLUTIONS_CATALOG.map((s) => s.id)

export const FEATURED_INDUSTRY_IDS = INDUSTRIES.map((i) => i.id)

export const PAGE_META = {
  home: {
    title: 'AGC | Enterprise Technology Solutions | Software, Cloud & Cybersecurity',
    description:
      'AGC Global delivers custom software, cloud infrastructure, cybersecurity, and digital transformation for enterprises across the Philippines and beyond.',
  },
  solutions: {
    title: 'Solutions | AGC Global',
    description: 'Software development, network infrastructure, cloud, cybersecurity, business process automation, and IT consulting.',
  },
  portfolio: {
    title: 'Portfolio | AGC Global',
    description:
      'AGC implementations and case studies — HRIS, lending, help desk, enterprise systems, cloud, and infrastructure projects.',
  },
  industries: {
    title: 'Industries | AGC Global',
    description: 'Technology solutions for finance, real estate, retail, logistics, and corporate enterprises.',
  },
  about: {
    title: 'About | AGC Global',
    description: 'Learn about AGC Global — mission, vision, values, expertise, and why organizations choose us.',
  },
  team: {
    title: 'Our Team | AGC Global',
    description: 'Meet the leadership, technical, and operations professionals behind AGC Global.',
  },
  news: {
    title: 'News & Insights | AGC Global',
    description: 'Product updates, technology insights, and company news from the AGC Global team.',
  },
  contact: {
    title: 'Contact | AGC Global',
    description: 'Talk to an AGC expert — request a consultation or project inquiry.',
  },
}

export const CONTACT_MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.362567785193!2d125.61011187581853!3d7.083899416395804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96da651e42635%3A0x5bd7a84c2784dcf!2sAmalgated%20Capital%2C%20Inc.!5e0!3m2!1sen!2sph!4v1775802797539!5m2!1sen!2sph'

export function getSolutionById(id) {
  return SOLUTIONS_CATALOG.find((s) => s.id === id) ?? null
}
