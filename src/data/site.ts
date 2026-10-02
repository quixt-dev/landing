/**
 * Single source of truth for brand facts.
 * Used by the UI, JSON-LD structured data, llms.txt and robots.txt so every
 * surface (search engines, AI assistants, humans) sees the same entity facts.
 */
export const site = {
  name: 'Quixt',
  /** Fallback site names for Google, in order of preference. Never the bare domain: we want "Quixt" shown. */
  alternateNames: ['Quixt Studio'],
  legalName: 'Quixt Studio',
  url: 'https://quixt.dev',
  locale: 'en_IN',
  language: 'en',
  tagline: 'We Build Digital Products That Power Growth',
  description:
    'Quixt is a design and software development agency in Guwahati, Assam, India that designs and builds high-performance websites, mobile apps, SaaS products and custom software for startups and growing businesses worldwide.',
  shortDescription: 'Development agency crafting websites, apps and software for startups and growing businesses.',
  email: 'build@quixt.dev',
  phone: '+91 94227 99861',
  phoneHref: '+919422799861',
  whatsapp: 'https://wa.me/919422799861',
  bookingUrl: 'https://cal.com/quixt/discovery',
  /** Replace with your form endpoint (Formspree, Basin, Netlify Forms, your API…). */
  formAction: 'https://formspree.io/f/your-form-id',
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
    'UI/UX design', 'Figma', 'Web development', 'Mobile app development', 'SaaS product development', 'Custom software development',
    'Backend and API development', 'Next.js', 'React', 'React Native', 'Flutter', 'Node.js', 'UI/UX design', 'MVP development',
  ],
  ogImage: '/og/default.png',
} as const;

export type NavItem = { label: string; href: string };

export const nav: { left: NavItem[]; right: NavItem[] } = {
  left: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Service', href: '/#services' },
  ],
  right: [
    { label: 'Project', href: '/projects/' },
    { label: 'Get In Touch', href: '/contact/' },
  ],
};

export const footerNav = {
  menu: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/#about' },
    { label: 'Case Studies', href: '/projects/' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Contact Us', href: '/contact/' },
  ],
  services: [
    { label: 'UI/UX Design', href: '/#services' },
    { label: 'Web Development', href: '/#services' },
    { label: 'Mobile App Development', href: '/#services' },
    { label: 'SaaS Solutions', href: '/#services' },
    { label: 'Custom Software', href: '/#services' },
    { label: 'API Development', href: '/#services' },
  ],
  contact: [
    { label: 'Email Us', href: `mailto:${site.email}` },
    { label: 'Call Us', href: `tel:${site.phoneHref}` },
    { label: 'Book A Call', href: site.bookingUrl },
  ],
};
