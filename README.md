<a href="https://quixt.dev">
  <img src=".github/assets/banner.webp" alt="Quixt — We build digital products that power growth." width="100%">
</a>

<p align="center">
  <a href="https://quixt.dev"><b>Live site</b></a> ·
  <a href="https://quixt.dev/projects/">Case studies</a> ·
  <a href="https://quixt.dev/contact/">Start a project</a> ·
  <a href="#getting-started">Run locally</a>
</p>

<p align="center">
  <img alt="Astro 7" src="https://img.shields.io/badge/Astro-7.3-AB4200?style=flat-square&logo=astro&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6.0-AB4200?style=flat-square&logo=typescript&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3.15-AB4200?style=flat-square&logo=greensock&logoColor=white">
  <img alt="Lenis" src="https://img.shields.io/badge/Lenis-1.3-AB4200?style=flat-square">
  <img alt="Zero client framework" src="https://img.shields.io/badge/client_framework-none-1E0D04?style=flat-square">
  <img alt="Lighthouse" src="https://img.shields.io/badge/Lighthouse-97%E2%80%93100-1E0D04?style=flat-square&logo=lighthouse&logoColor=white">
  <a href="LICENSE"><img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-1E0D04?style=flat-square"></a>
</p>

<br>

<img src=".github/assets/showcase.webp" alt="The Quixt homepage on desktop and mobile" width="100%">

<br>

This is the source for **[quixt.dev](https://quixt.dev)**, the website of Quixt, a design and engineering studio in Guwahati, India. Quixt builds websites, mobile apps and SaaS products for startups and growing businesses.

The site is an **Astro 7 static build with no client-side framework**. Every page is shipped as plain HTML and CSS. One deferred GSAP module adds the motion on top, so the content is fully readable before any script runs. The artwork is generated in code at build time: the dot-matrix globes, architecture diagrams, dashboards, waveforms and module illustrations.

<br>

## Contents

- [Highlights](#highlights)
- [Preview](#preview)
- [Tour](#tour) · [Home](#home) · [Case studies](#case-studies) · [Contact](#contact) · [Mobile](#mobile)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Editing content](#editing-content)
- [Motion system](#motion-system)
- [SEO & GEO](#seo--geo)
- [Deployment](#deployment)
- [License](#license)

<br>

## Highlights

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>Static first</h3>
      Every route is pre-rendered HTML. Nothing important depends on JavaScript. Without JS the content stays visible, and a 2.5&nbsp;s safety fallback reveals it if a script fails.
    </td>
    <td width="33%" valign="top">
      <h3>Motion as a layer</h3>
      GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText, DrawSVG) and Lenis smooth scroll. Components opt in through <code>data-*</code> attributes, so no component has its own animation code.
    </td>
    <td width="33%" valign="top">
      <h3>Art from code</h3>
      Globes, helices, dials, dashboards and architecture diagrams are rendered to cacheable SVG at build time. The globes use real Natural Earth land masks.
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h3>One source of truth</h3>
      All copy, prices and facts live in <code>src/data/</code>. The UI, JSON-LD, sitemap and <code>llms.txt</code> are generated from that same data, so they never disagree.
    </td>
    <td valign="top">
      <h3>Search &amp; AI ready</h3>
      Per-page JSON-LD graphs, Open Graph images, an XML sitemap, <code>llms.txt</code> and <code>llms-full.txt</code>, and a <code>robots.txt</code> that welcomes AI answer engines.
    </td>
    <td valign="top">
      <h3>Accessible by default</h3>
      Semantic landmarks, one <code>&lt;h1&gt;</code> per page, real tables, definition lists and <code>&lt;details&gt;</code>. Colour contrast is tuned against WCAG, and <code>prefers-reduced-motion</code> is fully respected.
    </td>
  </tr>
</table>

<br>

## Preview

<p align="center">
  <img src=".github/assets/preview.webp" alt="Scrolling through the Quixt homepage: preloader, hero, services, process, work, pricing and footer" width="100%">
</p>
<p align="center"><sub>Preloader → hero → services → process → work → pricing → FAQ → footer wordmark, recorded at 1440 × 900.</sub></p>

<br>

## Tour

### Home

<table>
  <tr>
    <td width="50%"><img src=".github/assets/screens/home-services.webp" alt="Services grid"><br><sub><b>Services</b>: six disciplines, each with a build-time icon and a tag list.</sub></td>
    <td width="50%"><img src=".github/assets/screens/home-process.webp" alt="Process timeline"><br><sub><b>Process</b>: a four-step timeline that fills as you scroll.</sub></td>
  </tr>
  <tr>
    <td><img src=".github/assets/screens/home-work.webp" alt="Selected work carousel"><br><sub><b>Work</b>: a project carousel with a generated blueprint for each product.</sub></td>
    <td><img src=".github/assets/screens/home-pricing.webp" alt="Pricing plans"><br><sub><b>Pricing</b>: transparent plans, with prices that count up into view.</sub></td>
  </tr>
  <tr>
    <td><img src=".github/assets/screens/home-testimonials.webp" alt="Testimonials"><br><sub><b>Testimonials</b>: staggered client quotes.</sub></td>
    <td><img src=".github/assets/screens/home-faq.webp" alt="FAQ accordion"><br><sub><b>FAQ</b>: smooth native <code>&lt;details&gt;</code> accordions, marked up as <code>FAQPage</code>.</sub></td>
  </tr>
</table>

<img src=".github/assets/screens/footer.webp" alt="Footer with the rising Quixt wordmark" width="100%">
<p align="center"><sub><b>Footer</b>: the oversized wordmark rises one character at a time.</sub></p>

### Case studies

Each case study page is generated from a single `caseStudy` object. The page includes a spec sheet, impact metrics, product modules, a wired architecture diagram, the tech stack with a typed code window, PageSpeed gauges and a delivery Gantt chart.

<table>
  <tr>
    <td width="50%"><img src=".github/assets/screens/tessa-hero.webp" alt="Tessa case study hero"><br><sub><b>Hero &amp; spec sheet</b>: product, category, timeline, scope and platforms.</sub></td>
    <td width="50%"><img src=".github/assets/screens/cs-impact.webp" alt="Impact metrics"><br><sub><b>By the numbers</b>: metrics counted from the codebase and its git history.</sub></td>
  </tr>
  <tr>
    <td><img src=".github/assets/screens/cs-modules.webp" alt="Product modules"><br><sub><b>Modules</b>: generated illustrations for each engine in the product.</sub></td>
    <td><img src=".github/assets/screens/cs-architecture.webp" alt="Architecture diagram"><br><sub><b>Architecture</b>: an SVG system map. Packets travel along the wires.</sub></td>
  </tr>
  <tr>
    <td><img src=".github/assets/screens/cs-stack.webp" alt="Tech stack and code window"><br><sub><b>Stack &amp; code</b>: highlighted at build time, then typed in line by line.</sub></td>
    <td><img src=".github/assets/screens/cs-speed.webp" alt="PageSpeed gauges"><br><sub><b>PageSpeed</b>: ring gauges fill to the measured Lighthouse scores.</sub></td>
  </tr>
</table>

<img src=".github/assets/pages.webp" alt="Projects index, Tessa, NandyAI and Contact pages" width="100%">

### Contact

<table>
  <tr>
    <td width="50%"><img src=".github/assets/screens/contact-hero.webp" alt="Contact hero with globe"><br><sub><b>Hero</b>: a drag-to-spin globe with flight trails out of the Guwahati HQ.</sub></td>
    <td width="50%"><img src=".github/assets/screens/contact-brief.webp" alt="Project brief form"><br><sub><b>Project brief</b>: a four-step form next to inline call booking.</sub></td>
  </tr>
  <tr>
    <td><img src=".github/assets/screens/contact-translator.webp" alt="You say / we build"><br><sub><b>You say, we build</b>: everyday requests mapped to scope, time and price.</sub></td>
    <td><img src=".github/assets/screens/contact-glossary.webp" alt="Glossary"><br><sub><b>Glossary</b>: technical terms in plain English, marked up as <code>DefinedTermSet</code>.</sub></td>
  </tr>
</table>

<img src=".github/assets/screens/contact-kit.webp" alt="Free starter kit" width="100%">
<p align="center"><sub><b>Starter kit</b>: a downloadable one-page product brief (PDF), generated by <code>npm run assets</code>.</sub></p>

### Mobile

<img src=".github/assets/mobile.webp" alt="Home, projects, Tessa, NandyAI and contact pages on mobile" width="100%">

<br>

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | [Astro 7](https://astro.build) | Static output with zero JavaScript by default |
| Language | TypeScript 6 | Typed data layer and graphics generators |
| Motion | [GSAP 3.15](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) | ScrollTrigger, SplitText, ScrambleText and DrawSVG, with smooth scroll |
| Graphics | Hand-written SVG generators, `d3-geo`, `topojson-client`, `world-atlas` | Build-time artwork with no runtime cost |
| Images | `astro:assets` | Responsive AVIF/WebP with explicit dimensions (CLS 0) |
| Type | IBM Plex Mono, Roboto Mono (self-hosted via Fontsource) | Preloaded, no third-party font requests |
| SEO | `@astrojs/sitemap`, custom JSON-LD builders | Structured data generated from the same data as the UI |
| Assets | `pdf-lib` + headless rendering | OG images, icons, favicon and starter-kit PDFs |

<br>

## Getting started

**Requirements:** Node.js **22.12+** and npm 9.6+.

```bash
git clone https://github.com/quixt-dev/landing.git
cd landing
npm install
npm run dev          # → http://localhost:4321
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server with HMR |
| `npm run build` | Builds the static site into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run check` | Type-checks `.astro` and `.ts` files |
| `npm run assets` | *(after a build)* Regenerates OG images, icons, favicon and the starter-kit PDFs |
| `npm run dev:worker` | Builds, then runs the site and the form Worker locally with `wrangler dev` (emails are simulated) |
| `npm run deploy` | Builds and deploys to Cloudflare Workers (`quixt.dev`, `www.quixt.dev`) |

Regenerate the globe land mask with `node scripts/generate-landmask.mjs`. Rebuild the wordmark with `node scripts/brand/build-logo.mjs`.

<br>

## Project structure

```text
src/
├─ data/            All copy and facts: site.ts, home.ts, projects.ts, contact.ts
├─ components/
│  ├─ layout/       Header, Footer, Logo
│  ├─ ui/           Button, Tag, SectionHeader, Accordion, Breadcrumbs, CornerBrackets, CtaBand…
│  ├─ home/         Hero, About, Services, Process, Products, Pricing, Testimonials, FAQ
│  ├─ project/      ProjectHero, SpecSheet, Metrics, Modules, Architecture, TechStack, CodeWindow, Performance, Gantt…
│  ├─ contact/      ContactHero, ProjectBriefForm, BookCall, NextSteps, Translator, Glossary, StarterKit
│  └─ seo/          <head> tags
├─ lib/
│  ├─ graphics/     Build-time SVG generators (globes, helix, dial, dashboards, architecture, module art)
│  ├─ schema.ts     JSON-LD builders (Organization, WebSite, WebPage, FAQPage, OfferCatalog, Article, HowTo…)
│  ├─ llms.ts       llms.txt / llms-full.txt generators
│  └─ highlight.ts  Build-time syntax highlighter for the code window
├─ pages/
│  ├─ index.astro · contact.astro · 404.astro
│  ├─ projects/     index.astro, [slug].astro
│  ├─ graphics/     [name].svg.ts: generative artwork served as static SVG
│  └─ robots.txt.ts · llms.txt.ts · llms-full.txt.ts
├─ scripts/         motion.ts, globes.ts, artMotion.ts
├─ layouts/         BaseLayout.astro
└─ styles/          global.css: design tokens, type scale, spacing, reset
public/             Favicons, manifest, OG images, downloads, _headers
scripts/            Asset, land-mask and logo build scripts
```

### Routes

| Route | Source | Notes |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Hero, about, services, process, work, pricing, testimonials, FAQ |
| `/projects/` | `src/pages/projects/index.astro` | Every project, linking to a case study where one exists |
| `/projects/[slug]/` | `src/pages/projects/[slug].astro` | Tessa, NandyAI, Flowgentic, Infinify |
| `/contact/` | `src/pages/contact.astro` | Brief form, call booking, next steps, translator, glossary, starter kit, FAQ |
| `/graphics/*.svg` | `src/pages/graphics/[name].svg.ts` | Generative artwork rendered at build time |
| `/robots.txt`, `/llms.txt`, `/llms-full.txt` | `src/pages/*.ts` | Generated from the data layer |
| `/404` | `src/pages/404.astro` | `noindex` |

<br>

## Editing content

All copy is stored in **`src/data/`**. You don't need to touch any components to change it.

- **Brand facts** (name, description, contact details, address, socials) are in `src/data/site.ts`. They feed the UI, JSON-LD, `llms.txt` and `robots.txt`.
- **To add a case study,** add a `caseStudy` object to a project in `src/data/projects.ts`. The page, sitemap entry, structured data and the `llms-full.txt` section are all generated automatically.

> [!IMPORTANT]
> **Still to review:**
> - `src/data/site.ts`: the phone number, address and social URLs.
> - Figures, client names, testimonials and prices in `src/data/*`. Some of these are still sample content from the design.

<br>

## Motion system

All motion lives in [`src/scripts/motion.ts`](src/scripts/motion.ts). Components opt in through data attributes:

| Attribute | Effect |
| --- | --- |
| `data-split` · `data-scramble` | Masked line/character title reveals · monospace scramble-in for eyebrows |
| `data-reveal` · `data-stagger` | Fade-and-rise entrances · staggered children |
| `data-count` · `data-gauge` | Count-up numbers · ring gauge fills |
| `data-clip` · `data-parallax` | Clip-path photo reveal with inner parallax · scroll parallax |
| `data-draw` · `data-timeline` | SVG stroke drawing · scrubbed progress timelines |
| `data-tilt-in` · `data-tilt` | 3D "lay-flat" dashboard entrance · pointer-driven tilt |
| `data-code` · `data-bars` · `data-pop` | Typed code lines · Gantt bars grow · SVG cells pop in |
| `data-words` · `data-wordmark` | Quote words fill on scroll · footer wordmark rises |
| `data-cursor="Label"` | Custom cursor with a contextual label |

The canvas globes in `src/scripts/globes.ts` revolve with Natural Earth land dots. On the contact page the globe adds flight trails, a pulsing HQ marker and drag-to-spin with momentum. Page changes use native cross-document View Transitions.

**Studio film.** The hero photo opens a custom theatre player ([`VideoTheatre.astro`](src/components/ui/VideoTheatre.astro) and [`videoTheatre.ts`](src/scripts/videoTheatre.ts)) for a Mux public playback ID, which is set in `film` in `src/data/home.ts`.
- The photo morphs into the stage when the player opens.
- The player has adaptive HLS, a scrub bar with storyboard previews, and speed and quality menus. It also supports captions when the asset has them, picture-in-picture, fullscreen, keyboard shortcuts and double-tap seeking on touch screens.
- hls.js loads only when a visitor shows intent to play. Without JavaScript, the link opens Mux's hosted player.

> [!NOTE]
> If `prefers-reduced-motion` is set, all motion is skipped. Animations also pause while off-screen.

<br>

## SEO & GEO

<table>
  <tr>
    <td width="50%" valign="top">
      <h4>Search engines</h4>
      <ul>
        <li>A unique title (≤ 60 chars) and description (≤ 155 chars) on every page, canonical URLs and <code>trailingSlash: 'always'</code></li>
        <li>Open Graph and Twitter cards with 1200 × 630 images, plus <code>article:*</code> times on case studies</li>
        <li>A JSON-LD <code>@graph</code> per page, with stable <code>@id</code>s linking Organization ⇄ WebSite ⇄ WebPage ⇄ Services</li>
        <li>An XML sitemap with <code>lastmod</code>, a web manifest and a complete favicon set</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h4>Generative engines</h4>
      <ul>
        <li><code>llms.txt</code> and <code>llms-full.txt</code> (llmstxt.org format), built from the same data as the UI</li>
        <li>A <code>robots.txt</code> that explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others</li>
        <li>Answer-first content: a question-style FAQ, a plain-English glossary and a "what happens next" <code>HowTo</code></li>
        <li>Concrete prices, timelines and metrics, with visible publish and update dates</li>
      </ul>
    </td>
  </tr>
</table>

**Lighthouse** (mobile, local run, all animations on): **Performance 97–99 · Accessibility 100 · Best Practices 100 · SEO 100** on every page, with CLS 0.

<br>

## Deployment

The site runs on **Cloudflare Workers**. The static build in `dist/` is served by [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/). A small Worker in [`worker/index.ts`](worker/index.ts) handles the forms. Everything is configured in [`wrangler.jsonc`](wrangler.jsonc).

```bash
npx wrangler login   # once
npm run deploy       # astro build && wrangler deploy
```

| Endpoint | Used by | What happens |
| --- | --- | --- |
| `POST /api/brief` | The 4-step project brief on `/contact/` | Emails the brief, with attachments up to 3.5 MB, to the team inbox. Reply-To is set to the client. |
| `POST /api/book` | The "Book a free 30-min call" card | Emails the requested date and time (IST), plus the visitor's timezone |

Both forms work without JavaScript: they post natively and land on `/contact/thanks/`. With JavaScript they submit in place and show a confirmation. Spam protection uses a honeypot field, a minimum fill time and a rate limit of 5 requests per minute per IP.

**Email** uses the Worker's `send_email` binding through Cloudflare Email Routing. Emails come from `website@quixt.dev` and go to the inbox set in `INBOX` (`wrangler.jsonc`). That address must be a verified destination under *Email → Email Routing → Destination addresses*. Mail sent to `build@quixt.dev` (and any other `@quixt.dev` address) is forwarded to the same inbox.

`public/_headers` sets the security headers (HSTS, `nosniff`, frame options, permissions policy) and long-lived caching for `/_astro/*` and `/graphics/*`. `www.quixt.dev` 301-redirects to `quixt.dev` through a zone redirect rule.

<br>

## Credits

Photography is from [Unsplash](https://unsplash.com), used under the Unsplash License. All other graphics are generated in code.

## License

The source code is released under the [Apache License 2.0](LICENSE). The Quixt name, logo and case-study content are not covered by this license and remain the property of Quixt Studio.

<br>

<p align="center">
  <a href="https://quixt.dev"><img src="public/logo-brand.svg" alt="Quixt" height="36"></a>
</p>
<p align="center">
  <sub>Designed and built in Guwahati, India · <a href="mailto:build@quixt.dev">build@quixt.dev</a></sub>
</p>
