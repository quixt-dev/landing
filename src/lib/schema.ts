import { site } from '../data/site';

/**
 * JSON-LD builders. Every node gets a stable @id so search engines and AI answer
 * engines can connect Organization ⇄ WebSite ⇄ WebPage ⇄ Service entities.
 */
const abs = (path: string) => new URL(path, site.url).toString();
export const ids = {
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  logo: `${site.url}/#logo`,
};

export const organization = () => ({
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ids.org,
  name: site.name,
  alternateName: [...site.alternateNames],
  legalName: site.legalName,
  url: site.url + '/',
  description: site.description,
  slogan: site.tagline,
  email: site.email,
  telephone: site.phoneHref,
  logo: { '@type': 'ImageObject', '@id': ids.logo, url: abs('/icon-512.png'), width: 512, height: 512, caption: site.name },
  image: { '@id': ids.logo },
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude },
  areaServed: site.areaServed,
  knowsAbout: site.knowsAbout,
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: site.hours.days, opens: site.hours.opens, closes: site.hours.closes }],
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'sales', email: site.email, telephone: site.phoneHref, availableLanguage: ['English', 'Hindi'], areaServed: site.areaServed },
  ],
  sameAs: site.socials.map((s) => s.href),
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': ids.website,
  url: site.url + '/',
  // Google picks the search-result site name from this node on the home page: name first, then alternateName.
  name: site.name,
  alternateName: [...site.alternateNames],
  description: site.shortDescription,
  inLanguage: site.language,
  publisher: { '@id': ids.org },
});

export const webPage = (o: { path: string; title: string; description: string; type?: string; image?: string; breadcrumbs?: boolean; dateModified?: string }) => ({
  '@type': o.type ?? 'WebPage',
  '@id': `${abs(o.path)}#webpage`,
  url: abs(o.path),
  name: o.title,
  description: o.description,
  inLanguage: site.language,
  isPartOf: { '@id': ids.website },
  about: { '@id': ids.org },
  ...(o.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: abs(o.image) } } : {}),
  ...(o.breadcrumbs ? { breadcrumb: { '@id': `${abs(o.path)}#breadcrumb` } } : {}),
  ...(o.dateModified ? { dateModified: o.dateModified } : {}),
});

export const breadcrumbs = (path: string, items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  '@id': `${abs(path)}#breadcrumb`,
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});

export const faqPage = (path: string, faqs: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  '@id': `${abs(path)}#faq`,
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceCatalog = (services: { title: string; slug: string; description: string }[], plans: { name: string; price: number; currency: string; bestFor: string; features: string[] }[]) => ({
  '@type': 'OfferCatalog',
  '@id': `${site.url}/#services`,
  name: `${site.name} Services`,
  itemListElement: [
    ...services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', '@id': `${site.url}/#service-${s.slug}`, name: s.title, description: s.description, provider: { '@id': ids.org }, areaServed: site.areaServed },
    })),
    ...plans.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      description: `Best for ${p.bestFor}: ${p.features.join(', ')}.`,
      price: p.price,
      priceCurrency: p.currency,
      priceSpecification: { '@type': 'PriceSpecification', price: p.price, priceCurrency: p.currency, valueAddedTaxIncluded: false, description: 'Starting price' },
      seller: { '@id': ids.org },
    })),
  ],
});

export const definedTermSet = (path: string, terms: { term: string; aka: string; definition: string }[]) => ({
  '@type': 'DefinedTermSet',
  '@id': `${abs(path)}#glossary`,
  name: 'Tech Words, In Plain English',
  hasDefinedTerm: terms.map((t) => ({ '@type': 'DefinedTerm', name: t.term, alternateName: t.aka, description: t.definition, inDefinedTermSet: `${abs(path)}#glossary` })),
});

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
export { abs };
