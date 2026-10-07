/**
 * Single source of truth for brand facts.
 * Used by the UI, JSON-LD structured data, llms.txt and robots.txt so every
 * surface (search engines, AI assistants, humans) sees the same entity facts.
 */
export const site = {
  name: 'Quixt',
  /** Fallback site names for Google, in order of preference. Never the bare domain: we want "Quixt" shown. */
  alternateNames: ['Quixt Studio'],
  legalName: 'Lexifyr Technologies Pvt. Ltd.',
  url: 'https://quixt.dev',
  locale: 'en_IN',
  language: 'en',
  tagline: 'Landing Pages And MVPs For AI Startups',
  description:
    'Quixt is a one-person design and engineering studio run by Dhiraj Hazarika in Guwahati, Assam, India. It designs and builds landing pages (from $1,499) and MVPs (from $3,499) for AI and agent-infrastructure startups worldwide.',
  shortDescription: 'One-person studio building landing pages and MVPs for AI and agent-infra startups.',
  /** The one person behind the studio (facts from his LinkedIn profile). */
  founder: {
    name: 'Dhiraj Hazarika',
    jobTitle: 'Founder',
    url: 'https://www.linkedin.com/in/dhirajbuilds/',
    alumniOf: 'Thapar Institute of Engineering & Technology',
  },
  email: 'build@quixt.dev',
  phone: '+91 94227 99861',
  phoneHref: '+919422799861',
  whatsapp: 'https://wa.me/919422799861',
  /** The booking card on /contact/ books via /api/book (Cal.com + team email, see worker/index.ts). */
  bookingUrl: '/contact/#book-a-call',
  /** Cal.com discovery call: the booking card reads live slots from Cal.com's public API in the browser. */
  cal: { username: 'quixt', event: 'discovery' },
  /** Public Cal.com page for the same event — the no-JS / fallback route. */
  calLink: 'https://cal.com/quixt/discovery',
  /** Handled by the Cloudflare Worker in worker/index.ts, which emails each brief to the team inbox. */
  formAction: '/api/brief',
  bookAction: '/api/book',
  address: {
    street: 'Beltola',
    locality: 'Guwahati',
    region: 'Assam',
    postalCode: '781028',
    country: 'IN',
    countryName: 'India',
  },
  geo: { latitude: 26.1235, longitude: 91.7975 },
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '19:00', label: 'Mon–Fri, 10:00–19:00 IST' },
  responseTime: 'Within 24 hours',
  areaServed: 'Worldwide',
  stats: { foundersHelped: '120+', countries: 14 },
  socials: [
    { name: 'Behance', href: 'https://www.behance.net/quixt' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/quixt' },
    { name: 'Dribbble', href: 'https://dribbble.com/quixt' },
    { name: 'X', href: 'https://x.com/quixt' },
  ],
  knowsAbout: [
    'Landing page development', 'Framer', 'MVP development', 'AI product development', 'Large language models', 'Retrieval-augmented generation',
    'Vector search', 'AI agents', 'Multi-agent orchestration', 'LangGraph', 'Next.js', 'Astro', 'TypeScript', 'Python', 'PostgreSQL', 'UI/UX design',
  ],
  ogImage: '/og/default.png',
} as const;

export type NavItem = { label: string; href: string };

export const nav: { left: NavItem[]; right: NavItem[] } = {
  left: [
    { label: 'Services', href: '/#services' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'About', href: '/#founder' },
  ],
  right: [
    { label: 'Work', href: '/projects/' },
    { label: 'Get In Touch', href: '/contact/' },
  ],
};

export const footerNav = {
  menu: [
    { label: 'Home', href: '/' },
    { label: 'About Dhiraj', href: '/#founder' },
    { label: 'Case Studies', href: '/projects/' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Contact', href: '/contact/' },
  ],
  services: [
    { label: 'Landing Pages · From $1,499', href: '/#service-landing-page' },
    { label: 'MVPs · From $3,499', href: '/#service-mvp' },
    { label: 'Get A Fixed Quote', href: '/contact/' },
  ],
  contact: [
    { label: 'Email Us', href: `mailto:${site.email}` },
    { label: 'Call Us', href: `tel:${site.phoneHref}` },
    { label: 'Book A Call', href: site.bookingUrl },
  ],
};
