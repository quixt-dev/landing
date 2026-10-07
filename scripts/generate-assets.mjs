/**
 * Regenerates binary brand assets into /public using headless Chrome:
 *   - Open Graph images (1200×630): /og/default.png, /og/contact.png, /og/{project}.png
 *   - Icons from the x mark (src/lib/brandMark.mjs): /favicon.svg, /favicon.ico (16/32/48), /favicon-96.png,
 *     /apple-touch-icon.png, /icon-192.png, /icon-512.png, /icon-maskable-512.png
 *   - Starter-kit PDFs (one A4 page each): /downloads/quixt-product-brief.pdf (fillable form) and -example.pdf
 *
 * Usage:  npm run build && npm run assets   (needs dist/graphics/*.svg)
 * Env:    CHROME_PATH=/path/to/chrome (defaults to macOS Google Chrome)
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { markSvg, MARK_ACCENT } from '../src/lib/brandMark.mjs';

const root = resolve(import.meta.dirname, '..');
const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = join(tmpdir(), 'quixt-assets'); mkdirSync(tmp, { recursive: true });
const font = (pkg, file) => pathToFileURL(join(root, 'node_modules/@fontsource', pkg, 'files', file)).href;
const graphic = (n) => { const p = join(root, 'dist/graphics', `${n}.svg`); if (!existsSync(p)) throw new Error(`Missing ${p}, run "npm run build" first.`); return pathToFileURL(p).href; };

const base = `
@font-face { font-family: 'Roboto Mono'; font-weight: 400; src: url(${font('roboto-mono', 'roboto-mono-latin-400-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'Roboto Mono'; font-weight: 500; src: url(${font('roboto-mono', 'roboto-mono-latin-500-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-weight: 400; src: url(${font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-weight: 500; src: url(${font('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2')}) format('woff2'); }
* { margin: 0; box-sizing: border-box; } body { font-family: 'IBM Plex Mono', monospace; color: #AB4200; -webkit-font-smoothing: antialiased; }
h1 { font-family: 'Roboto Mono', monospace; font-weight: 400; letter-spacing: -0.02em; }
.mark { display: inline-flex; align-items: center; gap: 12px; font-family: 'Roboto Mono'; font-size: 34px; }
`;
/** The real Quixt wordmark for OG cards: white on orange panels, brand orange on cream. */
const logo = (onCream = false) => `<img src="${pathToFileURL(join(root, onCream ? 'public/logo-brand.svg' : 'public/logo.svg')).href}" alt="Quixt" style="display:block;height:48px;width:auto">`;

function shot(name, html, w, h, out) {
  const file = join(tmp, `${name}.html`); writeFileSync(file, html);
  execFileSync(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', `--window-size=${w},${h}`, '--force-device-scale-factor=1', '--virtual-time-budget=3000', `--screenshot=${out}`, pathToFileURL(file).href], { stdio: 'ignore' });
  console.log('✓', out.replace(root, ''));
}
function pdf(name, html, out) {
  const file = join(tmp, `${name}.html`); writeFileSync(file, html);
  execFileSync(chrome, ['--headless', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=3000', `--print-to-pdf=${out}`, pathToFileURL(file).href], { stdio: 'ignore' });
  console.log('✓', out.replace(root, ''));
}

mkdirSync(join(root, 'public/og'), { recursive: true });
mkdirSync(join(root, 'public/downloads'), { recursive: true });

// ---------- OG images ----------
const og = (body, bg = '#AB4200') => `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body { width: 1200px; height: 630px; background: ${bg}; padding: 28px; overflow: hidden; }
.frame { position: relative; width: 100%; height: 100%; background: #fff; overflow: hidden; }
.panel { position: absolute; inset: 18px; background: #AB4200; color: #fff; overflow: hidden; }
.copy { position: absolute; left: 52px; top: 48px; bottom: 48px; width: 640px; display: flex; flex-direction: column; justify-content: space-between; }
.eyebrow { font-size: 20px; opacity: .9; font-weight: 500; }
h1 { font-size: 60px; line-height: 1.18; }
.foot { display: flex; gap: 28px; font-size: 20px; font-weight: 500; }
.chip { padding: 8px 14px; border: 1.5px solid rgba(255,255,255,.5); background: inherit; position: relative; }
</style></head><body><div class="frame">${body}</div></body></html>`;

shot('og-default', og(`<div class="panel"><img src="${graphic('dot-globe')}" style="position:absolute;right:40px;top:50%;transform:translateY(-50%);width:430px;height:430px"><div class="copy"><span class="mark">${logo()}</span><h1>Landing Pages &amp; MVPs For AI Startups</h1><div class="foot"><span class="chip">Landing Page · $1,499</span><span class="chip">MVP · $3,499</span><span style="margin-left:auto;align-self:center">quixt.dev</span></div></div></div>`), 1200, 630, join(root, 'public/og/default.png'));

const cases = [
  ['tessa', 'Tessa', 'AI Marketing Platform', ['29 Ad Themes', '6 Formats', 'Gemini']],
  ['nandy', 'NandyAI', 'AI Society Management', ['AI Reconcile', '46 Tools', 'RLS']],
  ['flowgentic', 'Flowgentic', 'Multi-Agent Orchestration', ['LangGraph', 'React Flow', 'MIT']],
  ['infinify', 'Infinify', 'Design Studio Landing Page', ['Next.js 16', 'Motion', 'Static']],
];
for (const [slug, name, cat, chips] of cases) {
  shot(`og-${slug}`, og(`<div style="position:absolute;inset:18px;background:#FDF4EF;overflow:hidden"><img src="${graphic(`product-${slug}`)}" style="position:absolute;right:-30px;top:60px;width:660px"><div class="copy" style="color:#AB4200"><span class="mark">${logo(true)}</span><div><p class="eyebrow">Case Study · ${cat}</p><h1 style="font-size:104px;letter-spacing:-0.05em;margin-top:8px">${name}</h1></div><div class="foot">${chips.map((c) => `<span class="chip" style="border-color:rgba(171,66,0,.35);background:#FDF4EF">${c}</span>`).join('')}</div></div></div>`), 1200, 630, join(root, `public/og/${slug}.png`));
}

shot('og-contact', og(`<div class="panel"><img src="${graphic('client-globe')}" style="position:absolute;right:-70px;top:10px;width:560px"><div class="copy"><span class="mark">${logo()}</span><h1 style="font-size:54px">Tell Me What<br>You’re Building.</h1><div class="foot"><span class="chip">Reply In 24h</span><span class="chip">Free 30-Min Call</span><span class="chip">Fixed Quote</span></div></div></div>`), 1200, 630, join(root, 'public/og/contact.png'));

// ---------- Icons ----------
// Glyph spans 68% of the favicon: big enough to read at 16px, and inside the circle Google crops search favicons to.
writeFileSync(join(root, 'public/favicon.svg'), markSvg({ pad: 0.16 }));
console.log('✓ /public/favicon.svg');
const icon = (s, pad) => `<!doctype html><html><head><style>*{margin:0}html,body{width:${s}px;height:${s}px;overflow:hidden}svg{display:block}</style></head><body>${markSvg({ pad, size: s })}</body></html>`;
for (const [s, pad, out] of [[512, 0.18, 'icon-512.png'], [512, 0.24, 'icon-maskable-512.png'], [192, 0.18, 'icon-192.png'], [180, 0.18, 'apple-touch-icon.png'], [96, 0.16, 'favicon-96.png'], [48, 0.16, 'favicon-48.png'], [32, 0.16, 'favicon-32.png'], [16, 0.14, 'favicon-16.png']]) shot(`icon-${s}-${pad}`, icon(s, pad), s, s, join(root, 'public', out));
// favicon.ico = multi-size PNG-in-ICO container (16, 32, 48), valid for every modern browser and for Google
{
  const sizes = [16, 32, 48], pngs = sizes.map((s) => readFileSync(join(root, `public/favicon-${s}.png`)));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(s, e); header.writeUInt8(s, e + 1); header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6); header.writeUInt32LE(pngs[i].length, e + 8); header.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });
  writeFileSync(join(root, 'public/favicon.ico'), Buffer.concat([header, ...pngs]));
  for (const s of sizes) execFileSync('rm', [join(root, `public/favicon-${s}.png`)]);
  console.log('✓ /public/favicon.ico');
}

// ---------- Starter-kit PDFs ----------
// One A4 page each. The blank brief is a real fillable form (AcroForm): Chrome prints the design, then every
// answer box, checkbox and option pill is measured in the same layout and overlaid with a matching PDF field.
const wordmark = readFileSync(join(root, 'public/logo.svg'), 'utf8')
  .replace('fill="#fff"', 'fill="#AB4200"').replace(`fill="${MARK_ACCENT}"`, 'fill="#C9794A"')
  .replace(/ width="[^"]*" height="[^"]*"/, ' class="logo"');
const BUDGETS = ['Under $5K', '$5K–$15K', '$15K–$40K', '$40K+', 'Not Sure'];
const TIMELINES = ['ASAP', '1–3 Months', '3–6 Months', 'Flexible'];
const EX = {
  problem: 'Busy dog owners can’t find trusted walkers at short notice, and current options are word-of-mouth or unreliable social groups.',
  who: 'Aisha, 32, works long hours in Guwahati, owns a Labrador and would pay for a vetted walker she can book in two taps.',
  idea: 'An app where dog owners can book verified walkers nearby, track the walk live and pay in the app.',
  features: [['Sign up / log in', true], ['Browse & book a walker', true], ['Live walk tracking on a map', true], ['Pay in the app', false], ['Ratings & reviews', false]],
  apps: 'Uber for live tracking; Airbnb for trust, profiles, reviews and verified badges.',
  budget: '$15K–$40K', timeline: '1–3 Months',
  success: '500 weekly bookings and a 4.7★ average rating within six months of launch.',
};
const brief = (filled, measure = false) => {
  const ans = (key, rows) => `<div class="ans" style="--rows:${rows}" data-f="${key}" data-kind="text" data-multi="1">${filled ? EX[key] : ''}</div>`;
  const feat = (i) => { const [label, on] = EX.features[i];
    return `<div class="cb"><span class="box${filled && on ? ' on' : ''}" data-f="feature_${i + 1}_done" data-kind="check"></span><span class="fl" data-f="feature_${i + 1}" data-kind="text">${filled ? label : ''}</span></div>`; };
  const pills = (group, items, pick) => `<div class="pills">${items.map((b) => `<span class="pill${filled && b === pick ? ' on' : ''}"><i data-f="${group}" data-kind="radio" data-value="${b}"></i>${b}</span>`).join('')}</div>`;
  const sec = (n, title, hint, body, cls = '') => `<section class="${cls}"><h2><span>${n}</span>${title}</h2><p class="hint">${hint}</p>${body}</section>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Quixt Product Brief${filled ? ' (Example)' : ''}</title><style>${base}
@page { size: A4; margin: 0; }
html, body { width: 210mm; height: 297mm; overflow: hidden; }
body { padding: 0 17mm 11mm; font-size: 9.6pt; display: flex; flex-direction: column; }
.bar { height: 5px; background: #AB4200; margin: 0 -17mm 9mm; flex: none; }
header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1.2px solid rgba(171,66,0,.25); padding-bottom: 4.5mm; }
h1 { font-size: 25pt; line-height: 1; letter-spacing: -0.045em; word-spacing: -0.18em; }
.sub { color: #A0502A; font-size: 8.2pt; margin-top: 2.6mm; }
.logo { display: block; flex: none; height: 7.6mm; width: auto; margin-top: 1.2mm; } /* top-right, cap-aligned with the title */
section { margin-top: 4.6mm; }
h2 { font-family: 'Roboto Mono'; font-weight: 400; font-size: 11.6pt; letter-spacing: -0.025em; word-spacing: -0.12em; display: flex; gap: 3mm; }
h2 span { color: #C9794A; }
.hint { color: #A0502A; font-size: 8pt; margin: .9mm 0 1.8mm; }
.ans { height: calc(var(--rows) * 5.6mm + 2.4mm); padding: 1.6mm 3mm; background: #FDF4EF; border-left: 2px solid #AB4200; font-family: 'Roboto Mono'; font-size: 9.6pt; line-height: 1.5; overflow: hidden; }
.cb { display: flex; gap: 3mm; align-items: center; height: 6.4mm; }
.box { flex: none; width: 3.6mm; height: 3.6mm; border: 1px solid #AB4200; background: #fff; position: relative; }
.box.on { background: #AB4200; } .box.on::after { content: ''; position: absolute; left: 1.05mm; top: .35mm; width: .9mm; height: 1.9mm; border: solid #fff; border-width: 0 1.4px 1.4px 0; transform: rotate(45deg); }
.fl { flex: 1; height: 5.6mm; line-height: 5.6mm; border-bottom: 1px solid rgba(171,66,0,.35); font-family: 'Roboto Mono'; font-size: 9.6pt; }
.pills { display: flex; flex-wrap: wrap; gap: 1.8mm; margin-top: 1mm; }
.pill { display: inline-flex; align-items: center; gap: 1.8mm; height: 6.6mm; padding: 0 3mm 0 2.2mm; border: 1px solid rgba(171,66,0,.4); font-size: 8.6pt; }
.pill i { flex: none; width: 3.2mm; height: 3.2mm; border-radius: 50%; border: 1px solid #AB4200; background: #fff; position: relative; }
.pill.on { background: #AB4200; color: #fff; border-color: #AB4200; } .pill.on i { border-color: #fff; } .pill.on i::after { content: ''; position: absolute; inset: .7mm; border-radius: 50%; background: #AB4200; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7mm; }
.grid > section { margin-top: 0; }
.row { margin-top: 4.6mm; }
footer { margin-top: auto; padding-top: 3.4mm; border-top: 1.2px solid rgba(171,66,0,.25); display: flex; justify-content: space-between; gap: 6mm; font-size: 7.8pt; color: #A0502A; }
</style></head><body><div class="bar"></div>
<header><div><h1>Product Brief</h1><p class="sub">Quixt Starter Kit · v3 · ${filled ? 'Filled Example' : 'Fillable PDF · About 15 Minutes · No Tech Knowledge Needed'}</p></div>${wordmark}</header>
${sec('01', 'The Problem', 'What frustrates your future users today? Describe it like you would to a friend.', ans('problem', 4))}
${sec('02', 'Who It’s For', 'Describe one real person who would use it every week.', ans('who', 4))}
${sec('03', 'Your Idea In One Sentence', '“An app where ___ can ___ so that ___.”', ans('idea', 3))}
<div class="grid row">${sec('04', 'Must-Have Features', 'Only what the first version truly needs. Tick the ones you’re sure about.', [0, 1, 2, 3, 4].map(feat).join(''))}
${sec('05', 'Apps You Like', 'Products whose look or feel you admire, and why.', ans('apps', 5))}</div>
<div class="grid row">${sec('06', 'Rough Budget', 'Pick the closest range.', pills('budget', BUDGETS, EX.budget))}
${sec('07', 'Ideal Timeline', 'When would you like to launch?', pills('timeline', TIMELINES, EX.timeline))}</div>
${sec('08', 'How Will You Know It’s Working?', 'One or two numbers you’d be proud of in six months.', ans('success', 3))}
<footer><span>${filled ? 'Your brief can be this short. Send yours to build@quixt.dev' : 'Fill it in, save it and email it to build@quixt.dev'}, or bring it to your free 30-minute call.</span><span>quixt.dev/contact</span></footer>
${measure ? `<script>addEventListener('load', () => document.fonts.ready.then(() => {
  const px = (e) => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; };
  const fields = [...document.querySelectorAll('[data-f]')].map((e) => ({ ...e.dataset, ...px(e) }));
  const last = [...document.querySelectorAll('section')].pop(), foot = document.querySelector('footer');
  const out = document.createElement('pre'); out.id = 'measure';
  out.textContent = JSON.stringify({ fields, gap: foot.getBoundingClientRect().top - last.getBoundingClientRect().bottom, fits: document.body.scrollHeight <= document.body.clientHeight + 1 });
  document.body.append(out);
}));</script>` : ''}
</body></html>`;
};
function measure(html) {
  const file = join(tmp, 'brief-measure.html'); writeFileSync(file, html);
  const dom = execFileSync(chrome, ['--headless', '--disable-gpu', '--window-size=794,1123', '--virtual-time-budget=4000', '--dump-dom', pathToFileURL(file).href], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const m = dom.match(/<pre id="measure">([^<]*)<\/pre>/); if (!m) throw new Error('Brief measurement failed');
  return JSON.parse(m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
}
async function makeFillable(file, layout) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.load(readFileSync(file));
  if (doc.getPageCount() !== 1) throw new Error(`${file} has ${doc.getPageCount()} pages, expected 1`);
  const page = doc.getPage(0), { height: PH } = page.getSize(), k = 72 / 96; // CSS px → PDF points
  const font = await doc.embedFont(StandardFonts.Courier), ink = rgb(0.118, 0.051, 0.016), brand = rgb(0.671, 0.259, 0);
  const form = doc.getForm(), radios = {};
  const box = (r, inset = 0) => ({ x: (r.x + inset) * k, y: PH - (r.y + r.h - inset) * k, width: (r.w - inset * 2) * k, height: (r.h - inset * 2) * k, borderWidth: 0, borderColor: undefined, backgroundColor: undefined }); // transparent: the printed design shows through
  for (const f of layout.fields) {
    if (f.kind === 'text') {
      const t = form.createTextField(f.f);
      if (f.multi) t.enableMultiline();
      t.addToPage(page, { ...box(f, f.multi ? 4 : 0), font, textColor: ink });
      t.setFontSize(9.5);
    } else if (f.kind === 'check') {
      form.createCheckBox(f.f).addToPage(page, { ...box(f, 1), textColor: brand });
    } else if (f.kind === 'radio') {
      const g = (radios[f.f] ??= form.createRadioGroup(f.f));
      g.addOptionToPage(f.value, page, { ...box(f, 0.5), textColor: brand });
    }
  }
  form.updateFieldAppearances(font);
  doc.setTitle('Quixt Product Brief'); doc.setAuthor('Quixt'); doc.setSubject('Fillable product brief for first-time founders'); doc.setCreator('quixt.dev');
  writeFileSync(file, await doc.save());
  console.log(`✓ fillable: ${layout.fields.length} fields, ${Object.keys(radios).length} option groups`);
}
for (const filled of [false, true]) {
  const layout = measure(brief(filled, true));
  if (!layout.fits || layout.gap < 4) throw new Error(`Brief${filled ? ' example' : ''} does not fit on one page (gap ${layout.gap.toFixed(1)}px)`);
  const out = join(root, `public/downloads/quixt-product-brief${filled ? '-example' : ''}.pdf`);
  pdf(filled ? 'brief-example' : 'brief', brief(filled), out);
  if (!filled) await makeFillable(out, layout);
  else { const { PDFDocument } = await import('pdf-lib'); const d = await PDFDocument.load(readFileSync(out)); if (d.getPageCount() !== 1) throw new Error('Example brief is not one page'); }
}
console.log('Done.');
