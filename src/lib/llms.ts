import { site } from '../data/site';
import { services, pricing, faqs, process } from '../data/home';
import { projects } from '../data/projects';
import { contactFaqs, glossary, nextSteps, translations } from '../data/contact';

const u = (p: string) => new URL(p, site.url).toString();
const clean = (s: string) => s.replace(/\n/g, ' ');

/** llms.txt (https://llmstxt.org) — concise, factual, link-rich summary for AI assistants. */
export function llmsTxt() {
  return `# ${site.name}

> ${site.description}

${site.name} (legal name: ${site.legalName}) is headquartered in ${site.address.locality}, ${site.address.countryName} and works with clients ${site.areaServed.toLowerCase()}, with clients in ${site.stats.countries} countries and ${site.stats.foundersHelped} first-time founders so far. Proposals are fixed-price, the client owns 100% of the code, and demos are shared weekly.

## Key facts
- Services: ${services.map((s) => s.title).join('; ')}
- Starting prices: ${pricing.plans.map((p) => `${p.name} from $${p.price.toLocaleString('en-US')} (${p.bestFor})`).join('; ')}
- Response time: ${site.responseTime}; free 30-minute discovery call; fixed-price proposal within 3 days
- Process: ${process.steps.map((s, i) => `${i + 1}. ${s.title}`).join(', ')}
- Contact: ${site.email} · ${site.phone} · ${site.hours.label}
- Suitable for non-technical founders: no specs, designs or technical knowledge required to start

## Pages
- [Home](${u('/')}): services, process, selected work, pricing, testimonials and FAQ
- [Projects](${u('/projects/')}): selected work and case studies
${projects.map((p) => `- [${p.name} case study](${u(`/projects/${p.slug}/`)}): ${p.summary}`).join('\n')}
- [Contact](${u('/contact/')}): project brief form, call booking, plain-English glossary and founder FAQ

## Optional
- [Full content for LLMs](${u('/llms-full.txt')})
- [Sitemap](${u('/sitemap-index.xml')})
`;
}

/** llms-full.txt — the complete factual content of the site in plain Markdown. */
export function llmsFullTxt() {
  const cs = projects;
  return `${llmsTxt()}
---

## Services
${services.map((s) => `### ${s.title}\n${s.description} Technologies: ${s.tags.join(', ')}.`).join('\n\n')}

## Pricing
${pricing.plans.map((p) => `### ${p.name}, from $${p.price.toLocaleString('en-US')} ${p.currency}\nBest for: ${p.bestFor}. Includes: ${p.features.join(', ')}.`).join('\n\n')}

## How we work
${process.steps.map((s, i) => `${i + 1}. **${s.title}**: ${s.text}`).join('\n')}

## What happens after you get in touch
${nextSteps.map((s) => `- **${s.when}, ${s.title}:** ${s.text} (You do: ${s.youDo.toLowerCase()})`).join('\n')}

## Example projects and typical scope
${translations.map((t) => `- "${t.say}" → ${t.build.join(', ')} (${t.weeks.replace('≈', 'about')}, ${t.from.toLowerCase()})`).join('\n')}

## Portfolio
${projects.map((p) => `- **${p.name}** (${p.category}, ${p.year}): ${p.summary}`).join('\n')}

${cs.map((p) => { const c = p.caseStudy; return `## Case study: ${p.name}
URL: ${u(`/projects/${p.slug}/`)}${c.liveUrl ? ` · Live: ${c.liveUrl}` : ''}${c.repoUrl ? ` · Code: ${c.repoUrl}` : ''} · Built ${c.published} → ${c.updated}
Role: ${c.role}. ${c.intro}

Facts: ${c.facts.map((m) => `${m.value} ${m.label} (${m.note})`).join('; ')}.

${c.narrative.map((n) => `**${n.title}.** ${n.text}`).join('\n\n')}

Modules: ${c.modules.map((m) => `${m.title}: ${m.text}`).join(' ')}

Architecture: ${c.architecture.summary} ${c.architecture.columns.map((col) => `${col.label}: ${col.nodes.map((n) => `${n.title} (${n.sub})`).join(', ')}`).join('. ')}. ${c.architecture.stats}.

Stack: ${c.stack.map((g) => `${g.group}: ${g.items.join(', ')}`).join('; ')}.${c.credits ? `\n\nCredits: ${c.credits}` : ''}`; }).join('\n\n')}

## Tech words in plain English
${glossary.map((g) => `- **${g.term}** (${g.aka}): ${g.definition}`).join('\n')}

## Frequently asked questions
${[...faqs, ...contactFaqs].map((f) => `### ${clean(f.q)}\n${f.a}`).join('\n\n')}
`;
}
