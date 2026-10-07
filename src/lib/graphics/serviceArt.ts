/**
 * Service explainers for the home bento, drawn with the same blueprint kit as the case studies. Each one is a
 * developer surface rather than a wireframe:
 *   landing:  editor ↔ live preview. index.astro on the left, the rendered page on the right, leader lines from each
 *             component line to the block it renders, and a build/status bar (SEO, GEO, OG, llms.txt).
 *   mvp:      an agent run trace: span waterfall (auth → retrieval → plan → tools → streamed reply) with a looping
 *             playhead, an evals panel and the deploy pipeline.
 *   speed:    Lighthouse rings over a network waterfall with FCP / LCP markers and the Core Web Vitals.
 *   handover: git log --graph (a feature branch merged, tagged v1.0) and the repo transfer in a terminal.
 * Wide tiles are 640 × 340, narrow ones 400 × 340. Numbers are illustrative targets, not client results.
 */
import { f, arc } from './svg';
import { T, BG, grid, corners, onC, hook, esc, type Art } from './blueprint';
import type { ServiceArt } from '../../data/home';

/** One line of syntax-shaded code: tokens are [text, opacity, weight?]. Faded in (not scrambled) so the shading survives. */
const code = (x: number, y: number, size: number, c: string, toks: [string, number, number?][], o: number) =>
  `<text class="a-f" data-o="${o}" x="${f(x)}" y="${f(y)}" font-family="IBM Plex Mono, monospace" font-size="${f(size * 1.1)}" fill="${c}" xml:space="preserve">` +
  toks.map(([t, op, w]) => `<tspan fill-opacity="${op}"${w ? ` font-weight="${w}"` : ''}>${esc(t)}</tspan>`).join('') + '</text>';
/** Panel header: label on the left, optional note on the right, hairline rule under both. */
const head = (x: number, y: number, w: number, label: string, c: string, k: number, o: number, right = '') =>
  hook(T(x, y, label, c, 8 * k, 0.95, 'start', 500), 'a-t', o) + (right ? hook(T(x + w, y, right, c, 6.8 * k, 0.65, 'end'), 'a-t', o + 0.2) : '') +
  `<path class="a-x" data-o="${o}" d="M${f(x)} ${f(y + 7 * k)}H${f(x + w)}" stroke="${c}" stroke-opacity=".3"/>`;

/* ---------------------------------------------------------------- landing page: editor ↔ preview */
export const landingArt: Art = (W, H, c) => {
  const k = W / 640, K = (v: number) => f(v * k), ink = onC(c);
  let s = grid(W, H, c, 16 * k, 0.05) + corners(W, H, c, 12 * k, 4 * k);

  // window chrome: traffic squares, file tabs, dev-server note, editor | preview split
  const wx = 24 * k, wy = 24 * k, ww = 592 * k, wh = 296 * k, bar = 22 * k, split = 300 * k, sb = wy + wh - 18 * k;
  s += `<rect class="a-d" x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="${f(wh)}" ${BG} stroke="${c}" stroke-width="${K(1.2)}"/>`;
  s += `<path class="a-x" data-o="0.4" d="M${f(wx)} ${f(wy + bar)}H${f(wx + ww)}" stroke="${c}" stroke-opacity=".5"/>`;
  for (let i = 0; i < 3; i++) s += `<rect class="a-p" data-o="0.5" x="${f(wx + (8 + i * 9) * k)}" y="${f(wy + 8 * k)}" width="${K(6)}" height="${K(6)}" stroke="${c}" stroke-opacity=".6"/>`;
  const tabs: [string, number][] = [['index.astro', 70], ['Hero.astro', 64], ['llms.txt', 54]];
  let tx = wx + 40 * k;
  tabs.forEach(([name, w], i) => {
    const tw = w * k, on = i === 0;
    s += `<path class="a-f" data-o="${0.6 + i * 0.1}" d="M${f(tx + tw)} ${f(wy + 4 * k)}V${f(wy + bar)}" stroke="${c}" stroke-opacity=".25"/>`;
    if (on) s += `<rect class="a-x" data-o="0.7" x="${f(tx)}" y="${f(wy)}" width="${f(tw)}" height="${K(2)}" fill="${c}"/>`;
    s += hook(T(tx + tw / 2, wy + 14.5 * k, name, c, 7 * k, on ? 1 : 0.5, 'middle', on ? 500 : 400), 'a-t', 0.6 + i * 0.1);
    tx += tw;
  });
  s += hook(T(wx + ww - 10 * k, wy + 14.5 * k, 'astro dev · localhost:4321', c, 6.8 * k, 0.55, 'end'), 'a-t', 0.9);
  s += `<path class="a-yd" data-o="0.8" d="M${f(split)} ${f(wy + bar)}V${f(sb)}" stroke="${c}" stroke-opacity=".4"/>`;

  // editor: index.astro with line numbers; lines 7–10 are wired to the blocks they render
  const KW = 1, P = 0.5, S = 0.72, A = 0.78, N = 0.92; // keyword, punctuation, string, attribute, name
  const lines: [string, number, number?][][] = [
    [['---', P]],
    [['import ', KW, 500], ['Layout ', N], ['from ', KW, 500], ["'@/layouts/Base.astro'", S]],
    [['import ', KW, 500], ['Waitlist ', N], ['from ', KW, 500], ["'@/islands/Waitlist'", S]],
    [['const ', KW, 500], ['{ plans } = ', N], ['await ', KW, 500], ['getPlans()', N]],
    [['---', P]],
    [['<', P], ['Layout ', KW, 500], ['title', A], ['=', P], ['"YourModel"', S], ['>', P]],
    [['  <', P], ['Hero ', KW, 500], ['headline', A], ['=', P], ['"Agents that ship"', S], [' />', P]],
    [['  <', P], ['Waitlist ', KW, 500], ['client:visible ', A], ['to', A], ['=', P], ['"resend"', S], [' />', P]],
    [['  <', P], ['Install ', KW, 500], ['cmd', A], ['=', P], ['"pip install yourmodel"', S], [' />', P]],
    [['  <', P], ['Pricing ', KW, 500], ['plans', A], ['=', P], ['{plans}', N], [' />', P]],
    [['  <', P], ['Logos ', KW, 500], ['set', A], ['=', P], ['"backers"', S], [' />', P]],
    [['</', P], ['Layout', KW, 500], ['>', P]],
  ];
  const lx = wx + 30 * k, ly0 = wy + bar + 22 * k, lh = 16 * k, wired = [6, 7, 8, 9], active = 7;
  s += `<rect class="a-x" data-o="3.4" x="${f(wx + 1 * k)}" y="${f(ly0 + active * lh - 11 * k)}" width="${f(split - wx - 2 * k)}" height="${K(15)}" fill="${c}" fill-opacity=".07"/>` +
    `<rect class="a-p" data-o="3.4" x="${f(wx + 1 * k)}" y="${f(ly0 + active * lh - 11 * k)}" width="${K(2)}" height="${K(15)}" fill="${c}"/>`;
  lines.forEach((toks, i) => {
    const y = ly0 + i * lh, o = 1 + i * 0.16;
    s += hook(T(lx - 8 * k, y, String(i + 1), c, 6.8 * k, wired.includes(i) ? 0.95 : 0.35, 'end'), 'a-f', o);
    s += code(lx, y, 7.2 * k, c, toks, o);
  });
  const caretX = lx + 41 * 0.66 * 7.2 * k + 2 * k; // end of the 41-character Waitlist line
  s += `<rect class="a-blink" x="${f(caretX)}" y="${f(ly0 + active * lh - 8 * k)}" width="${K(4.5)}" height="${K(10)}" fill="${c}"/>`;

  // preview: the page those lines render
  const fx = 316 * k, fy = wy + bar + 14 * k, fw = 284 * k, fh = 226 * k, cx = fx + 14 * k;
  s += hook(T(fx, fy - 4 * k, 'preview', c, 6.4 * k, 0.55), 'a-t', 1.2) + hook(T(fx + fw, fy - 4 * k, '1440 → 375 · responsive', c, 6.4 * k, 0.55, 'end'), 'a-t', 1.3);
  s += `<rect class="a-d" data-o="1.2" x="${f(fx)}" y="${f(fy)}" width="${f(fw)}" height="${f(fh)}" ${BG} stroke="${c}" stroke-opacity=".8"/>`;
  s += `<path class="a-x" data-o="1.5" d="M${f(fx)} ${f(fy + 16 * k)}H${f(fx + fw)}" stroke="${c}" stroke-opacity=".35"/>`;
  s += `<rect class="a-f" data-o="1.6" x="${f(fx + 60 * k)}" y="${f(fy + 4 * k)}" width="${K(164)}" height="${K(9)}" stroke="${c}" stroke-opacity=".3"/>` + hook(T(fx + 142 * k, fy + 11 * k, 'https://yourmodel.ai', c, 6 * k, 0.75, 'middle'), 'a-t', 1.6);
  const ny = fy + 30 * k;
  s += `<rect class="a-p" data-o="2" x="${f(cx)}" y="${f(ny - 4 * k)}" width="${K(24)}" height="${K(6)}" fill="${c}"/>`;
  for (let i = 0; i < 3; i++) s += `<rect class="a-x" data-o="2.1" x="${f(fx + (150 + i * 30) * k)}" y="${f(ny - 2.5 * k)}" width="${K(20)}" height="${K(3)}" fill="${c}" fill-opacity=".45"/>`;
  s += `<rect class="a-f" data-o="2.2" x="${f(fx + fw - 50 * k)}" y="${f(ny - 8 * k)}" width="${K(36)}" height="${K(12)}" stroke="${c}"/>` + hook(T(fx + fw - 32 * k, ny + 0.6 * k, 'sign in', c, 5.8 * k, 0.9, 'middle'), 'a-f', 2.2);
  const hy = ny + 16 * k;
  s += `<rect class="a-f" data-o="2.3" x="${f(cx)}" y="${f(hy)}" width="${K(84)}" height="${K(12)}" stroke="${c}" stroke-opacity=".6"/>` +
    `<circle class="a-pulse" cx="${f(cx + 7 * k)}" cy="${f(hy + 6 * k)}" r="${K(2.2)}" fill="${c}"/>` + hook(T(cx + 13 * k, hy + 8.6 * k, 'private beta', c, 6 * k, 0.9), 'a-t', 2.3);
  const h1 = hy + 20 * k, h2 = h1 + 15 * k;
  s += `<rect class="a-x" data-o="2.5" x="${f(cx)}" y="${f(h1)}" width="${K(196)}" height="${K(11)}" fill="${c}"/>`;
  s += `<rect class="a-x" data-o="2.6" x="${f(cx)}" y="${f(h2)}" width="${K(146)}" height="${K(11)}" fill="${c}"/>`;
  s += `<rect class="a-x" data-o="2.8" x="${f(cx)}" y="${f(h2 + 19 * k)}" width="${K(176)}" height="${K(3)}" fill="${c}" fill-opacity=".35"/>`;
  s += `<rect class="a-x" data-o="2.9" x="${f(cx)}" y="${f(h2 + 26 * k)}" width="${K(128)}" height="${K(3)}" fill="${c}" fill-opacity=".35"/>`;
  const cy = h2 + 38 * k;
  s += `<rect class="a-p" data-o="3" x="${f(cx)}" y="${f(cy)}" width="${K(80)}" height="${K(16)}" fill="${c}"/>` + hook(T(cx + 40 * k, cy + 10.6 * k, 'join waitlist →', ink, 6.2 * k, 1, 'middle', 500), 'a-f', 3.1);
  s += `<rect class="a-p" data-o="3.1" x="${f(cx + 86 * k)}" y="${f(cy)}" width="${K(46)}" height="${K(16)}" stroke="${c}"/>` + hook(T(cx + 109 * k, cy + 10.6 * k, 'docs', c, 6.2 * k, 1, 'middle'), 'a-f', 3.2);
  const iy = cy + 26 * k;
  s += `<rect class="a-f" data-o="3.2" x="${f(cx)}" y="${f(iy)}" width="${K(176)}" height="${K(18)}" fill="${c}" fill-opacity=".06" stroke="${c}" stroke-opacity=".5"/>`;
  s += hook(T(cx + 8 * k, iy + 12 * k, '$ pip install yourmodel', c, 6.6 * k, 0.95), 'a-t', 3.3) + `<rect x="${f(cx + 160 * k)}" y="${f(iy + 5 * k)}" width="${K(7)}" height="${K(8)}" stroke="${c}" stroke-opacity=".6"/>`;
  const py = iy + 28 * k;
  for (let i = 0; i < 3; i++) {
    const x = cx + i * 86 * k, hot = i === 1;
    s += `<rect class="a-p" data-o="${3.4 + i * 0.1}" x="${f(x)}" y="${f(py)}" width="${K(78)}" height="${K(28)}" ${hot ? `fill="${c}" fill-opacity=".12"` : BG} stroke="${c}" stroke-opacity="${hot ? 1 : 0.5}"/>` +
      `<rect x="${f(x + 8 * k)}" y="${f(py + 8 * k)}" width="${K(28)}" height="${K(4)}" fill="${c}"/><rect x="${f(x + 8 * k)}" y="${f(py + 17 * k)}" width="${K(48)}" height="${K(3)}" fill="${c}" fill-opacity=".4"/>`;
  }
  const gy = py + 38 * k;
  s += hook(T(cx, gy + 5 * k, 'backed by', c, 5.6 * k, 0.5), 'a-f', 3.7);
  for (let i = 0; i < 4; i++) s += `<rect class="a-f" data-o="${3.7 + i * 0.08}" x="${f(cx + (50 + i * 50) * k)}" y="${f(gy)}" width="${K(38)}" height="${K(7)}" fill="${c}" fill-opacity=".16"/>`;

  // leader lines: source line → rendered block, with packets travelling along them
  const targets: [number, number][] = [[6, h1 + 5.5 * k], [7, cy + 8 * k], [8, iy + 9 * k], [9, py + 14 * k]];
  targets.forEach(([line, ty], i) => {
    const sy = ly0 + line * lh - 3 * k, x1 = split - 4 * k, x2 = cx - 5 * k, o = 4.2 + i * 0.25;
    s += `<circle class="a-p" data-o="${o}" cx="${f(x1)}" cy="${f(sy)}" r="${K(2)}" fill="${c}"/>`;
    s += `<path class="a-d a-flow" data-o="${o}" d="M${f(x1)} ${f(sy)}C${f(x1 + 14 * k)} ${f(sy)} ${f(x2 - 14 * k)} ${f(ty)} ${f(x2)} ${f(ty)}" stroke="${c}" stroke-opacity=".75" stroke-dasharray="${K(2)} ${K(2)}"/>`;
    s += `<circle class="a-p" data-o="${o + 0.6}" cx="${f(x2)}" cy="${f(ty)}" r="${K(2)}" ${BG} stroke="${c}"/>`;
  });

  // status bar
  s += `<path class="a-x" data-o="5" d="M${f(wx)} ${f(sb)}H${f(wx + ww)}" stroke="${c}" stroke-opacity=".5"/>`;
  s += `<rect class="a-x" data-o="5" x="${f(wx)}" y="${f(sb)}" width="${f(ww)}" height="${K(18)}" fill="${c}" fill-opacity=".06"/>`;
  s += hook(T(wx + 10 * k, sb + 12 * k, '✓ build 412ms · 6 pages · 0 kb blocking js', c, 6.6 * k, 0.85), 'a-t', 5.2);
  s += hook(T(wx + ww - 10 * k, sb + 12 * k, 'seo ✓  geo ✓  og ✓  llms.txt ✓', c, 6.6 * k, 0.95, 'end', 500), 'a-t', 5.5);
  return s;
};

/* ---------------------------------------------------------------- mvp: agent run trace */
export const mvpArt: Art = (W, H, c) => {
  const k = W / 640, K = (v: number) => f(v * k), ink = onC(c);
  let s = grid(W, H, c, 16 * k, 0.05) + corners(W, H, c, 12 * k, 4 * k);
  s += head(30 * k, 32 * k, 580 * k, 'trace · run_8f2c1a', c, k, 0, '● 2.41s · 3,726 tokens · $0.011');

  // time axis
  const bx0 = 256 * k, bw = 354 * k, total = 2.4, X = (t: number) => bx0 + (bw * t) / total;
  const top = 58 * k, rowH = 22 * k, bottom = top + 7 * rowH + 6 * k;
  for (let i = 0; i <= 4; i++) {
    const t = (total / 4) * i, x = X(t);
    s += hook(T(x, top - 2 * k, `${+t.toFixed(1)}s`, c, 6.2 * k, 0.55, i === 0 ? 'start' : i === 4 ? 'end' : 'middle'), 'a-f', 0.6);
    s += `<path d="M${f(x)} ${f(top + 4 * k)}V${f(bottom)}" stroke="${c}" stroke-opacity=".12" stroke-dasharray="${K(2)} ${K(3)}"/>`;
  }
  // spans: [label, start s, end s, style, duration]
  const spans: [string, number, number, 'root' | 'light' | 'mid' | 'solid' | 'stream', string][] = [
    ['POST /api/agent/run', 0, 2.41, 'root', '2.41s'],
    ['├ auth.session', 0, 0.06, 'light', '60ms'],
    ['├ retrieve · pgvector k=8', 0.06, 0.25, 'mid', '190ms'],
    ['├ llm.plan · claude', 0.25, 0.86, 'solid', '610ms'],
    ['├ tool.search_docs', 0.86, 1.09, 'mid', '230ms'],
    ['├ tool.create_ticket', 1.09, 1.23, 'mid', '140ms'],
    ['└ llm.respond · stream', 1.23, 2.4, 'stream', '1.17s'],
  ];
  spans.forEach(([label, a, b, style, dur], i) => {
    const y = top + 6 * k + i * rowH, by = y + 5 * k, bh = 11 * k, x1 = X(a), x2 = X(b), o = 1.2 + a * 1.4 + i * 0.12;
    s += hook(T(30 * k, y + 13.5 * k, label, c, 7.4 * k, i === 0 ? 1 : 0.85, 'start', i === 0 ? 500 : 400), 'a-t', 1 + i * 0.15);
    const fill = style === 'root' ? `fill="${c}" fill-opacity=".08" stroke="${c}"` : style === 'light' ? `fill="${c}" fill-opacity=".3"` : style === 'mid' ? `fill="${c}" fill-opacity=".55"` : `fill="${c}"`;
    s += `<rect class="a-x" data-o="${o}" x="${f(x1)}" y="${f(by)}" width="${f(Math.max(x2 - x1, 2 * k))}" height="${f(bh)}" ${fill}/>`;
    if (style === 'stream') { // streamed tokens: ticks across the bar
      let d = ''; for (let x = x1 + 4 * k; x < x2 - 30 * k; x += 5 * k) d += `M${f(x)} ${f(by + 3 * k)}V${f(by + bh - 3 * k)}`;
      s += `<path class="a-x" data-o="${o + 0.3}" d="${d}" stroke="${ink}" stroke-opacity=".45"/>`;
    }
    const inside = x2 > bx0 + bw - 40 * k;
    s += hook(T(inside ? x2 - 4 * k : x2 + 5 * k, by + 8.4 * k, dur, inside && style !== 'root' ? ink : c, 6.2 * k, inside ? 1 : 0.7, inside ? 'end' : 'start'), 'a-f', o + 0.4);
  });
  // replay playhead sweeping the trace
  s += `<g class="a-loopx" data-dx="${f(bw)}" data-dur="5.2"><path d="M${f(bx0)} ${f(top + 4 * k)}V${f(bottom)}" stroke="${c}" stroke-opacity=".6" stroke-dasharray="${K(1.5)} ${K(2)}"/><path d="M${f(bx0 - 4 * k)} ${f(top + 2 * k)}h${K(8)}l${K(-4)} ${K(5)}z" fill="${c}"/></g>`;

  // evals panel
  const ey = 240 * k, ew = 288 * k;
  s += `<rect class="a-d" data-o="4.4" x="${K(30)}" y="${f(ey)}" width="${f(ew)}" height="${K(76)}" ${BG} stroke="${c}" stroke-opacity=".6"/>`;
  s += hook(T(42 * k, ey + 16 * k, 'evals', c, 7.6 * k, 1, 'start', 500), 'a-t', 4.6);
  s += `<rect class="a-p" data-o="4.8" x="${f(30 * k + ew - 86 * k)}" y="${f(ey + 6 * k)}" width="${K(76)}" height="${K(14)}" fill="${c}"/>` + hook(T(30 * k + ew - 48 * k, ey + 15.6 * k, '24/24 passing', ink, 6.2 * k, 1, 'middle', 500), 'a-f', 5);
  const evals: [string, number][] = [['faithfulness', 0.94], ['tool_accuracy', 1], ['answer_relevance', 0.91]];
  evals.forEach(([name, v], i) => {
    const y = ey + 36 * k + i * 15 * k, o = 4.9 + i * 0.2;
    s += hook(T(42 * k, y, name, c, 6.8 * k, 0.85), 'a-t', o);
    s += `<rect x="${K(160)}" y="${f(y - 5 * k)}" width="${K(104)}" height="${K(5)}" fill="${c}" fill-opacity=".14"/><rect class="a-x" data-o="${o}" x="${K(160)}" y="${f(y - 5 * k)}" width="${f(104 * k * v)}" height="${K(5)}" fill="${c}"/>`;
    s += hook(T(30 * k + ew - 10 * k, y, v.toFixed(2), c, 6.8 * k, 1, 'end', 500), 'a-t', o + 0.2);
  });

  // stack + deploy
  const sx = 330 * k, sw = 280 * k;
  s += `<rect class="a-d" data-o="4.6" x="${f(sx)}" y="${f(ey)}" width="${f(sw)}" height="${K(76)}" ${BG} stroke="${c}" stroke-opacity=".6"/>`;
  s += hook(T(sx + 12 * k, ey + 16 * k, 'stack', c, 7.6 * k, 1, 'start', 500), 'a-t', 4.8) + hook(T(sx + sw - 12 * k, ey + 16 * k, 'one core workflow', c, 6.4 * k, 0.6, 'end'), 'a-t', 4.9);
  const chips = ['next.js', 'fastapi', 'langgraph', 'pgvector'], chw = 52 * k, gap = 16 * k, chy = ey + 26 * k;
  chips.forEach((name, i) => {
    const x = sx + 12 * k + i * (chw + gap), o = 5 + i * 0.2;
    s += `<rect class="a-p" data-o="${o}" x="${f(x)}" y="${f(chy)}" width="${f(chw)}" height="${K(18)}" ${i === 2 ? `fill="${c}"` : `${BG} stroke="${c}"`}/>` + hook(T(x + chw / 2, chy + 12 * k, name, i === 2 ? ink : c, 6.4 * k, 1, 'middle'), 'a-f', o + 0.1);
    if (i < chips.length - 1) s += `<path class="a-d a-flow" data-o="${o + 0.2}" d="M${f(x + chw + 2 * k)} ${f(chy + 9 * k)}H${f(x + chw + gap - 2 * k)}" stroke="${c}" stroke-width="${K(1.2)}"/>`;
  });
  s += hook(T(sx + 12 * k, ey + 64 * k, '$ vercel --prod  → app.yourmodel.ai ✓', c, 6.8 * k, 0.9), 'a-t', 5.8);
  return s;
};

/* ---------------------------------------------------------------- speed: lighthouse + waterfall */
export const speedArt: Art = (W, H, c) => {
  const k = W / 400, K = (v: number) => f(v * k);
  let s = grid(W, H, c, 16 * k, 0.05) + corners(W, H, c, 12 * k, 4 * k);
  s += head(28 * k, 30 * k, 344 * k, 'lighthouse', c, k, 0, 'mobile · slow 4g');
  ['perf', 'a11y', 'best', 'seo'].forEach((label, i) => {
    const gx = (71 + i * 86) * k, gy = 74 * k, r = 19 * k, o = 0.5 + i * 0.2;
    s += `<circle cx="${f(gx)}" cy="${f(gy)}" r="${f(r)}" stroke="${c}" stroke-opacity=".18" stroke-width="${K(3)}"/>`;
    s += `<path class="a-d" data-o="${o}" d="${arc(gx, gy, r, -90, 269.5)}" stroke="${c}" stroke-width="${K(3)}"/>`;
    s += hook(T(gx, gy + 3.4 * k, '100', c, 8.8 * k, 1, 'middle', 500), 'a-t', o + 0.4) + hook(T(gx, gy + r + 12 * k, label, c, 6.8 * k, 0.7, 'middle'), 'a-f', o);
  });
  // network waterfall
  const top = 126 * k, x0 = 120 * k, ww = 252 * k, total = 1.2, X = (t: number) => x0 + (ww * t) / total, rowH = 17 * k;
  s += hook(T(28 * k, top, 'network', c, 7.4 * k, 0.95, 'start', 500), 'a-t', 1.4);
  for (let i = 0; i <= 4; i++) {
    const t = (total / 4) * i, x = X(t);
    s += hook(T(x, top, i ? `${+t.toFixed(1)}s` : '0', c, 6 * k, 0.55, i === 4 ? 'end' : 'middle'), 'a-f', 1.4);
    s += `<path d="M${f(x)} ${f(top + 5 * k)}V${f(top + 6 * rowH + 10 * k)}" stroke="${c}" stroke-opacity=".12" stroke-dasharray="${K(2)} ${K(3)}"/>`;
  }
  const reqs: [string, number, number, 'solid' | 'mid' | 'defer' | 'light', string][] = [
    ['document', 0, 0.18, 'solid', '14 kb'], ['font · plex', 0.18, 0.34, 'mid', '15 kb'], ['font · roboto', 0.18, 0.36, 'mid', '13 kb'],
    ['hero.avif', 0.2, 0.52, 'mid', '34 kb'], ['motion.js', 0.36, 0.66, 'defer', 'defer'], ['analytics', 0.9, 1.02, 'light', 'idle'],
  ];
  reqs.forEach(([label, a, b, style, size], i) => {
    const y = top + 10 * k + i * rowH, o = 1.8 + a * 2 + i * 0.1;
    s += hook(T(28 * k, y + 8 * k, label, c, 6.8 * k, 0.85), 'a-t', 1.6 + i * 0.12);
    const fill = style === 'solid' ? `fill="${c}"` : style === 'mid' ? `fill="${c}" fill-opacity=".55"` : style === 'light' ? `fill="${c}" fill-opacity=".25"` : `${BG} stroke="${c}" stroke-dasharray="${K(2)} ${K(1.5)}"`;
    s += `<rect class="a-x" data-o="${o}" x="${f(X(a))}" y="${f(y + 2 * k)}" width="${f(X(b) - X(a))}" height="${K(8)}" ${fill}/>`;
    s += hook(T(X(b) + 5 * k, y + 8.6 * k, size, c, 6 * k, 0.65), 'a-f', o + 0.3);
  });
  // first / largest paint markers
  const mb = top + 6 * rowH + 10 * k;
  ([['fcp 0.36s', 0.36, 'end'], ['lcp 0.52s', 0.52, 'start']] as const).forEach(([label, t, anchor], i) => {
    const x = X(t), o = 3.4 + i * 0.3;
    s += `<path class="a-yd" data-o="${o}" d="M${f(x)} ${f(top + 6 * k)}V${f(mb)}" stroke="${c}" stroke-width="${K(1.2)}" stroke-dasharray="${K(3)} ${K(2)}"/>`;
    s += hook(T(x + (anchor === 'end' ? -4 : 4) * k, mb + 10 * k, label, c, 6.6 * k, 1, anchor, 500), 'a-t', o + 0.2);
  });
  // core web vitals
  const vy = 274 * k, vw = 108 * k;
  ([['lcp', '0.52s'], ['inp', '40ms'], ['cls', '0.00']] as const).forEach(([n, v], i) => {
    const x = (28 + i * 118) * k, o = 4 + i * 0.2;
    s += `<rect class="a-p" data-o="${o}" x="${f(x)}" y="${f(vy)}" width="${f(vw)}" height="${K(38)}" ${BG} stroke="${c}" stroke-opacity=".6"/>`;
    s += hook(T(x + 9 * k, vy + 14 * k, n, c, 6.6 * k, 0.7), 'a-f', o) + hook(T(x + vw - 9 * k, vy + 14 * k, '✓', c, 7 * k, 1, 'end'), 'a-f', o + 0.2);
    s += hook(T(x + 9 * k, vy + 30 * k, v, c, 10 * k, 1, 'start', 500), 'a-t', o + 0.1);
  });
  return s;
};

/* ---------------------------------------------------------------- handover: git graph + repo transfer */
export const handoverArt: Art = (W, H, c) => {
  const k = W / 400, K = (v: number) => f(v * k), ink = onC(c);
  let s = grid(W, H, c, 16 * k, 0.05) + corners(W, H, c, 12 * k, 4 * k);
  s += head(28 * k, 30 * k, 344 * k, '$ git log --graph --oneline', c, k, 0, 'main');
  const y0 = 60 * k, step = 24 * k, main = 40 * k, feat = 58 * k, Y = (r: number) => y0 + r * step;
  // lanes: main, plus feat/agent branching at row 4 and merging back at row 1
  s += `<path class="a-yd" data-o="0.5" d="M${f(main)} ${f(Y(0))}V${f(Y(6))}" stroke="${c}" stroke-width="${K(1.4)}"/>`;
  s += `<path class="a-d a-flow" data-o="1.2" d="M${f(main)} ${f(Y(4))}C${f(main)} ${f(Y(4) - 12 * k)} ${f(feat)} ${f(Y(4) - 10 * k)} ${f(feat)} ${f(Y(3))}V${f(Y(2))}C${f(feat)} ${f(Y(1) + 10 * k)} ${f(main)} ${f(Y(1) + 12 * k)} ${f(main)} ${f(Y(1))}" stroke="${c}" stroke-width="${K(1.4)}" stroke-opacity=".8"/>`;
  const commits: [number, boolean, string, string][] = [
    [0, false, 'a1f3c9e', 'launch: yourmodel.ai'], [1, false, 'e41b9d0', 'merge feat/agent'], [2, true, '7d2e1b0', 'agent: tool calling'],
    [3, true, '3c9a4f2', 'agent: rag over docs'], [4, false, '9b81e7d', 'auth + stripe billing'], [5, false, '5e0d2c4', 'ui from figma'], [6, false, '2f0c6a1', 'scaffold next.js'],
  ];
  commits.forEach(([r, onFeat, hash, msg]) => {
    const y = Y(r), x = onFeat ? feat : main, o = 0.8 + (6 - r) * 0.3, tip = r === 0;
    s += `<circle class="a-p" data-o="${o}" cx="${f(x)}" cy="${f(y)}" r="${K(4.2)}" ${tip ? `fill="${c}"` : `${BG} stroke="${c}" stroke-width="${K(1.4)}"`}/>`;
    s += hook(T(78 * k, y + 3 * k, hash, c, 7 * k, 0.55), 'a-t', o) + hook(T(130 * k, y + 3 * k, msg, c, 7.4 * k, tip ? 1 : 0.9, 'start', tip ? 500 : 400), 'a-t', o + 0.1);
  });
  // refs on the tip
  const ry = Y(0) - 7 * k;
  s += `<rect class="a-p" data-o="3" x="${K(244)}" y="${f(ry)}" width="${K(34)}" height="${K(14)}" fill="${c}"/>` + hook(T(261 * k, ry + 10 * k, 'v1.0', ink, 6.6 * k, 1, 'middle', 500), 'a-f', 3.1);
  s += `<rect class="a-p" data-o="3.1" x="${K(282)}" y="${f(ry)}" width="${K(38)}" height="${K(14)}" ${BG} stroke="${c}"/>` + hook(T(301 * k, ry + 10 * k, 'HEAD', c, 6.6 * k, 1, 'middle', 500), 'a-f', 3.2);
  s += `<circle class="a-pulse" cx="${f(main)}" cy="${f(Y(0))}" r="${K(8)}" stroke="${c}" stroke-opacity=".5"/>`;
  // terminal: the handover itself
  const ty = 236 * k, tw = 344 * k, th = 80 * k;
  s += `<rect class="a-d" data-o="3.4" x="${K(28)}" y="${f(ty)}" width="${f(tw)}" height="${f(th)}" ${BG} stroke="${c}" stroke-opacity=".7"/>`;
  s += `<path class="a-x" data-o="3.5" d="M${K(28)} ${f(ty + 16 * k)}H${f(28 * k + tw)}" stroke="${c}" stroke-opacity=".3"/>`;
  for (let i = 0; i < 3; i++) s += `<rect class="a-p" data-o="3.5" x="${f((36 + i * 8) * k)}" y="${f(ty + 5.5 * k)}" width="${K(5)}" height="${K(5)}" stroke="${c}" stroke-opacity=".6"/>`;
  s += hook(T(28 * k + tw - 8 * k, ty + 11 * k, 'zsh · handover', c, 6 * k, 0.55, 'end'), 'a-f', 3.5);
  const term: [string, number, number][] = [['$ gh repo transfer your-org/app', 0.95, 400], ['✓ owner: you · admin: you · ci: green', 1, 500], ['$ vercel --prod  → yourmodel.ai ✓', 0.95, 400]];
  term.forEach(([line, op, w], i) => (s += hook(T(40 * k, ty + (32 + i * 16) * k, line, c, 7 * k, op, 'start', w), 'a-t', 3.8 + i * 0.5)));
  s += `<rect class="a-blink" x="${f(40 * k + 34 * 0.66 * 7 * k + 4 * k)}" y="${f(ty + 56 * k)}" width="${K(4.5)}" height="${K(9)}" fill="${c}"/>`;
  return s;
};

export const serviceArts: Record<ServiceArt, Art> = { landing: landingArt, mvp: mvpArt, speed: speedArt, handover: handoverArt };
