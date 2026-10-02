/**
 * Infinify — motion-spec / devtools graphics. Values come from the Infinify codebase: the loader
 * (~2.35 s hand-drawn infinity, then a curtain lift), ease cubic-bezier(0.22, 1, 0.36, 1), the pinned
 * About reveal completing at 92 % of the pin, the Process revenue chip (bars 105/85/133/98/120/76/110,
 * $80.02K, +9.02 %), hls.js loaded only on play, a preloaded AVIF hero and FAQPage JSON-LD.
 */
import { f } from './svg';
import { T, BG, grid, corners, onC, hook, grp, every, type Art } from './blueprint';

/** Points along a lemniscate of Bernoulli centred at (cx, cy) with half-width a. */
const lem = (cx: number, cy: number, a: number, n = 160) => Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * Math.PI * 2 + Math.PI / 2; const d = 1 + Math.sin(t) ** 2; return [cx + (a * Math.cos(t)) / d, cy + (a * Math.sin(t) * Math.cos(t)) / d] as [number, number]; });
const poly = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('');
const diamond = (x: number, y: number, r: number, c: string, filled = true) => `<path d="M${f(x)} ${f(y - r)}L${f(x + r)} ${f(y)}L${f(x)} ${f(y + r)}L${f(x - r)} ${f(y)}Z" ${filled ? `fill="${c}"` : `${BG} stroke="${c}"`}/>`;
/** cubic-bezier(x1, y1, x2, y2) sampled into a path inside a box. */
const bezierPath = (bx: number, by: number, bw: number, bh: number, x1: number, y1: number, x2: number, y2: number) => {
  let d = ''; for (let i = 0; i <= 60; i++) { const t = i / 60, u = 1 - t; const x = 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3, y = 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3; d += `${i ? 'L' : 'M'}${f(bx + x * bw)} ${f(by + bh - y * bh)}`; }
  return d;
};

/* ---------------------------------------------------------------- signature (card + backdrop) */
/** Motion spec sheet: the studio's signature easing curve beside the landing page's intro timeline. */
export const infinifySignature: Art = (W, H, c) => {
  const k = W / 524;
  let s = grid(W, H, c, 16 * k, 0.05) + corners(W, H, c, 14 * k, 5 * k);
  // easing graph
  const bx = 34 * k, by = 50 * k, bw = 150 * k, bh = 150 * k;
  s += `<rect class="a-d" x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" ${BG} stroke="${c}" stroke-opacity=".5"/>`;
  let g = ''; for (let i = 1; i < 4; i++) g += `M${f(bx + (bw * i) / 4)} ${f(by)}V${f(by + bh)}M${f(bx)} ${f(by + (bh * i) / 4)}H${f(bx + bw)}`;
  s += `<path class="a-f" d="${g}" stroke="${c}" stroke-opacity=".12"/><path class="a-f" d="M${f(bx)} ${f(by + bh)}L${f(bx + bw)} ${f(by)}" stroke="${c}" stroke-opacity=".25" stroke-dasharray="${f(2 * k)} ${f(3 * k)}"/>`;
  const p1: [number, number] = [bx + 0.22 * bw, by + bh - 1 * bh], p2: [number, number] = [bx + 0.36 * bw, by + bh - 1 * bh];
  s += `<path class="a-d" data-o="2" d="M${f(bx)} ${f(by + bh)}L${f(p1[0])} ${f(p1[1])}M${f(bx + bw)} ${f(by)}L${f(p2[0])} ${f(p2[1])}" stroke="${c}" stroke-opacity=".6"/>`;
  s += `<path id="if-ease-${Math.round(W)}" class="a-d" data-o="1" d="${bezierPath(bx, by, bw, bh, 0.22, 1, 0.36, 1)}" stroke="${c}" stroke-width="${f(2 * k)}"/>`;
  // a ball rides the curve with the curve's own ease — the signature motion, demonstrated
  s += `<circle class="a-ride" data-ride="#if-ease-${Math.round(W)}" data-dur="1.8" data-rest="1.1" data-ease="none" r="${f(4 * k)}" fill="${c}"/>`;
  [p1, p2].forEach(([x, y]) => (s += `<circle class="a-p" data-o="3" cx="${f(x)}" cy="${f(y)}" r="${f(3.4 * k)}" ${BG} stroke="${c}" stroke-width="${f(1.4 * k)}"/>`));
  s += `<circle class="a-p" data-o="1" cx="${f(bx)}" cy="${f(by + bh)}" r="${f(2.4 * k)}" fill="${c}"/><circle class="a-p" data-o="2"  cx="${f(bx + bw)}" cy="${f(by)}" r="${f(2.4 * k)}" fill="${c}"/>`;
  s += every(T(bx, by - 8 * k, 'ease · cubic-bezier(0.22, 1, 0.36, 1)', c, 7.2 * k, 0.95, 'start', 500) + T(bx, by + bh + 14 * k, 'time →', c, 6.6 * k, 0.6) + T(bx + bw, by + bh + 14 * k, 'progress ↑', c, 6.6 * k, 0.6, 'end'), 'a-t', 1);
  // timeline
  const tx = 222 * k, tw = W - tx - 26 * k, t0 = 62 * k, rowH = 26 * k, dur = 3.2;
  const X = (sec: number) => tx + 70 * k + ((tw - 70 * k) * sec) / dur;
  s += hook(T(tx, 40 * k, 'intro.timeline', c, 7.2 * k, 0.95, 'start', 500), 'a-t', 1);
  for (let q = 0; q <= 3; q++) { const x = X(q); s += `<path d="M${f(x)} ${f(46 * k)}V${f(t0 + rowH * 6 - 6 * k)}" stroke="${c}" stroke-opacity=".12" stroke-dasharray="${f(2 * k)} ${f(3 * k)}"/>` + T(x, 52 * k, `${q}s`, c, 6.4 * k, 0.6, 'middle'); }
  const tracks: [string, number, number, boolean][] = [['loader.draw', 0, 2.35, true], ['loader.curtain', 2.35, 2.9, true], ['nav.pill', 2.55, 3.05, false], ['hero.words', 2.6, 3.15, false], ['cta.stagger', 2.8, 3.2, false], ['marquee.loop', 2.9, 3.2, false]];
  tracks.forEach(([n, a, b, solid], i) => {
    const y = t0 + i * rowH;
    const o = 2 + a * 1.4; // tracks animate in the order they start
    s += hook(T(tx, y + 11.5 * k, n, c, 6.8 * k, 0.9), 'a-t', 1.5 + i * 0.3) + `<path class="a-x" data-o="${1.5 + i * 0.3}" d="M${f(X(0))} ${f(y + 8 * k)}H${f(X(dur))}" stroke="${c}" stroke-opacity=".12"/>`;
    s += `<rect class="a-x" data-o="${o}" x="${f(X(a))}" y="${f(y + 3 * k)}" width="${f(X(b) - X(a))}" height="${f(10 * k)}" ${solid ? `fill="${c}"` : `fill="${c}" fill-opacity=".14" stroke="${c}"`}/>`;
    s += hook(diamond(X(a), y + 8 * k, 3.4 * k, c, false), 'a-p', o) + hook(diamond(X(b), y + 8 * k, 3.4 * k, c), 'a-p', o + 1);
  });
  const px = X(2.35); s += `<path class="a-yd" data-o="5" d="M${f(px)} ${f(46 * k)}V${f(t0 + rowH * 6)}" stroke="${c}" stroke-width="${f(1.2 * k)}"/><rect x="${f(px - 20 * k)}" y="${f(t0 + rowH * 6)}" width="${f(40 * k)}" height="${f(12 * k)}" fill="${c}" class="a-p" data-o="5.5"/>` + T(px, t0 + rowH * 6 + 9 * k, '2350ms', c === '#fff' ? '#AB4200' : '#fff', 6.4 * k, 1, 'middle', 500);
  s += hook(T(W - 22 * k, H - 20 * k, 'prefers-reduced-motion ✓', c, 6.8 * k, 0.65, 'end'), 'a-t', 7);
  // scrub head sweeping the timeline on a loop
  s += `<g class="a-loopx" data-dx="${f(X(dur) - X(0))}" data-dur="5.5"><path d="M${f(X(0))} ${f(56 * k)}V${f(t0 + rowH * 6 - 4 * k)}" stroke="${c}" stroke-opacity=".55" stroke-dasharray="${f(1.5 * k)} ${f(2 * k)}"/><path d="M${f(X(0) - 4 * k)} ${f(56 * k)}h${f(8 * k)}l${f(-4 * k)} ${f(5 * k)}z" fill="${c}"/></g>`;
  return s;
};

/* ---------------------------------------------------------------- bento */
/** Infinity loader: film strip of the hand-drawn stroke at five keyframes, then the curtain lift. */
export const loaderStrip: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const n = 5, fx = 20, fy = 22, gap = 10, fw = (W - fx * 2 - gap * (n - 1)) / n, fh = 130;
  const stamps = ['0ms', '590ms', '1175ms', '1760ms', '2350ms'];
  for (let i = 0; i < n; i++) {
    const x = fx + i * (fw + gap), frac = i / (n - 1);
    s += every(`<rect x="${f(x)}" y="${fy}" width="${f(fw)}" height="${fh}" ${BG} stroke="${c}" stroke-opacity=".6"/>`, 'a-f', i * 0.5);
    for (let h = 0; h < 6; h++) s += `<rect x="${f(x + 6 + h * ((fw - 12) / 6))}" y="${fy + 5}" width="6" height="4" stroke="${c}" stroke-opacity=".35"/><rect x="${f(x + 6 + h * ((fw - 12) / 6))}" y="${fy + fh - 9}" width="6" height="4" stroke="${c}" stroke-opacity=".35"/>`;
    const pts = lem(x + fw / 2, fy + fh / 2, fw * 0.36);
    s += every(`<path d="${poly(pts)}Z" stroke="${c}" stroke-opacity=".15" stroke-dasharray="2 3"/>`, 'a-f', i * 0.5);
    if (frac > 0) { const cut = pts.slice(0, Math.max(2, Math.round(frac * (pts.length - 1)) + 1)); s += `<path class="a-d" data-o="${1 + i * 0.6}" d="${poly(cut)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`; const [hx, hy] = cut[cut.length - 1]; if (frac < 1) s += `<circle cx="${f(hx)}" cy="${f(hy)}" r="4" fill="${c}"/><circle class="a-pulse" cx="${f(hx)}" cy="${f(hy)}" r="8" stroke="${c}" stroke-opacity=".4"/>`; }
    s += every(T(x + 6, fy + fh + 16, stamps[i], c, 7.4, 1, 'start', 500) + T(x + fw - 6, fy + fh + 16, `${Math.round(frac * 100)}%`, c, 7, 0.7, 'end'), 'a-t', 1 + i * 0.6);
  }
  // ruler + curtain
  const ry = fy + fh + 38, rx1 = fx, rx2 = W - fx, split = rx1 + (rx2 - rx1) * 0.82;
  s += every(`<path d="M${rx1} ${ry}H${rx2}" stroke="${c}" stroke-opacity=".5"/><rect x="${rx1}" y="${ry - 5}" width="${f(split - rx1)}" height="10" fill="${c}" fill-opacity=".85"/><rect x="${f(split)}" y="${ry - 5}" width="${f(rx2 - split)}" height="10" stroke="${c}" stroke-dasharray="3 2"/>`, 'a-x', 5);
  s += every(T(rx1 + 6, ry + 3.5, 'stroke-dashoffset 1 → 0', onC(c), 7, 1) + T(rx2 - 6, ry + 20, 'curtain · translateY(-100%)', c, 7, 0.85, 'end'), 'a-t', 5.5);
  return s;
};
/** Draggable portfolio: two marquee rows moving in opposite directions, with drag + inertia readouts. */
export const marqueeSpec: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const tw = 86, th = 54, gap = 10;
  const row = (y: number, off: number, video: boolean) => { let o = ''; for (let i = -2; i < 7; i++) { const x = off + i * (tw + gap); o += `<rect x="${f(x)}" y="${y}" width="${tw}" height="${th}" rx="6" ${BG} stroke="${c}"/>`; o += video ? `<path d="M${f(x + tw / 2 - 5)} ${y + th / 2 - 7}L${f(x + tw / 2 + 8)} ${y + th / 2}L${f(x + tw / 2 - 5)} ${y + th / 2 + 7}Z" fill="${c}"/>` : `<rect x="${f(x + 8)}" y="${y + 8}" width="${tw - 16}" height="${th - 26}" rx="3" fill="${c}" fill-opacity=".12"/><rect x="${f(x + 8)}" y="${y + th - 12}" width="${tw * 0.45}" height="3" fill="${c}"/>`; } return o; };
  s += `<g class="a-loopx" data-dx="${-(tw + gap)}" data-dur="5">${row(34, -40, false)}</g><g class="a-loopx" data-dx="${tw + gap}" data-dur="6.5">${row(124, 8, true)}</g>`;
  s += every(`<path d="M${W - 70} 22H${W - 20}M${W - 26} 18L${W - 20} 22L${W - 26} 26" stroke="${c}"/>` + T(18, 25, 'row_1 · dir -1 · design shots', c, 6.8, 0.9), 'a-f', 0);
  s += every(`<path d="M70 112H20M26 108L20 112L26 116" stroke="${c}"/>` + T(W - 18, 115, 'row_2 · dir +1 · mux hls', c, 6.8, 0.9, 'end'), 'a-f', 0.3);
  // drag readout
  const dy = 198; s += every(`<rect x="18" y="${dy}" width="${W - 36}" height="28" ${BG} stroke="${c}" stroke-opacity=".7"/>` + T(26, dy + 17.5, 'dragX -142px', c, 7, 1, 'start', 500), 'a-d', 1);
  let sp = ''; for (let i = 0; i <= 30; i++) { const x = 118 + i * ((W - 150 - 118) / 30), v = Math.exp(-i / 7) * 10; sp += `${i ? 'L' : 'M'}${f(x)} ${f(dy + 22 - v)}`; }
  s += every(`<path d="${sp}" stroke="${c}" stroke-width="1.3"/>` + T(W - 26, dy + 17.5, 'inertia', c, 6.6, 0.7, 'end'), 'a-d', 1.5);
  return s;
};
/** Pinned statement: the scroll pin as a track; words darken until 92 % of the pin. */
export const pinSpec: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const x = 30, y1 = 26, y2 = H - 30, v = 0.62, yv = y1 + (y2 - y1) * v, y92 = y1 + (y2 - y1) * 0.92;
  s += every(`<path d="M${x} ${y1}V${y2}" stroke="${c}" stroke-opacity=".3" stroke-width="6" stroke-linecap="round"/><path d="M${x} ${y1}V${f(yv)}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`, 'a-d', 0);
  s += every(`<path d="M${x - 12} ${y1}H${x + 12}M${x - 12} ${y2}H${x + 12}" stroke="${c}" stroke-width="1.4"/>` + T(x + 16, y1 + 3, 'start start', c, 6.6, 0.8) + T(x + 16, y2 + 3, 'end end', c, 6.6, 0.8), 'a-f', 0.5);
  s += every(`<path d="M${x - 10} ${f(y92)}H${x + 10}" stroke="${c}" stroke-dasharray="2 2"/>` + T(x + 16, y92 + 3, '0.92', c, 6.6, 1, 'start', 600), 'a-f', 1);
  s += every(`<rect x="${x + 12}" y="${f(yv - 8)}" width="44" height="16" fill="${c}"/>` + T(x + 34, yv + 3, 'v 0.62', onC(c), 6.8, 1, 'middle'), 'a-p', 1.5);
  // statement words
  const wx = 108, ww = W - wx - 20; let n = 0, lit = 0; const widths = [58, 34, 70, 26, 48, 62, 30, 54, 40, 66, 28, 52, 44, 36, 60, 38, 50];
  const lines: [number, number][] = [];
  let lx = wx, ly = 34; widths.forEach((w) => { if (lx + w > wx + ww) { lx = wx; ly += 24; } lines.push([lx, ly]); lx += w + 8; });
  lit = Math.round(Math.min(1, v / 0.92) * widths.length);
  widths.forEach((w, i) => { const [px, py] = lines[i]; s += `<rect class="${i < lit ? 'a-x' : 'a-f'}" data-o="${2 + i * 0.18}" x="${px}" y="${py}" width="${w}" height="12" ${i < lit ? `fill="${c}"` : `fill="${c}" fill-opacity=".14"`}/>`; n++; });
  void n;
  const fy = H - 44;
  s += every(`<rect x="${wx}" y="${fy - 14}" width="${ww}" height="34" ${BG} stroke="${c}" stroke-opacity=".6"/>` + T(wx + 8, fy, 'revealed = round(min(1, v / 0.92)', c, 6.8, 0.95) + T(wx + 8, fy + 13, `           · (words + 1))  → ${lit}/${widths.length}`, c, 6.8, 0.95), 'a-d', 5);
  return s;
};
/** Process scenes: the revenue chip (real bar heights) plus its hover choreography as timeline tracks. */
export const chipSpec: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const cx = 18, cy = 14, cw = 206, ch = 126;
  s += every(`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="10" ${BG} stroke="${c}"/>` + T(cx + 12, cy + 26, '$80.02K', c, 14, 1, 'start', 500) + `<path d="M${cx + cw - 58} ${cy + 20}l4-6 4 6z" fill="${c}"/>` + T(cx + cw - 48, cy + 20, '9.02%', c, 6.8, 1, 'start', 600) + T(cx + cw - 12, cy + 32, 'Revenue Generated', c, 6.2, 0.7, 'end'), 'a-d', 0);
  const hs = [105, 85, 133, 98, 120, 76, 110], kk = 0.58, base = cy + ch - 10;
  hs.forEach((h, i) => { const x = cx + 14 + i * 26; s += `<rect class="a-y" data-o="${1 + i * 0.2}" x="${x}" y="${f(base - h * kk)}" width="18" height="${f(h * kk)}" rx="4" ${i >= 5 ? `fill="${c}"` : i === 2 ? `fill="${c}" fill-opacity=".3" stroke="${c}"` : `fill="${c}" fill-opacity=".08" stroke="${c}" stroke-opacity=".6"`}/>`; });
  const mx = cx + 14 + 2 * 26 + 9; s += every(`<path d="M${mx} ${cy + 40}V${base}" stroke="${c}" stroke-dasharray="2 3"/><circle cx="${mx}" cy="${f(base - 133 * kk)}" r="4" fill="${c}"/><circle cx="${mx}" cy="${f(base - 133 * kk)}" r="8" stroke="${c}" stroke-opacity=".4"/>`, 'a-d', 3);
  // choreography
  const tx = cx + cw + 16, tw = W - tx - 16; s += every(T(tx, cy + 12, 'on hover', c, 7.2, 1, 'start', 500), 'a-t', 0.5);
  const X = (ms: number) => tx + (tw * ms) / 1000;
  [['bars.rise', 0, 480], ['line.wipe', 360, 720], ['dot.pop', 700, 900], ['count.up', 0, 900]].forEach(([n, a, b], i) => { const y = cy + 30 + i * 26; s += T(tx, y, n as string, c, 6.6, 0.9) + `<path d="M${tx} ${y + 8}H${tx + tw}" stroke="${c}" stroke-opacity=".15"/><rect class="a-x" data-o="${4 + (a as number) / 250}" x="${f(X(a as number))}" y="${y + 4}" width="${f(X(b as number) - X(a as number))}" height="8" ${i === 3 ? `fill="${c}" fill-opacity=".2" stroke="${c}"` : `fill="${c}"`}/>` + hook(diamond(X(b as number), y + 8, 3, c), 'a-p', 4.4 + (b as number) / 250); });
  s += every(T(tx, cy + 30 + 4 * 26 + 2, '0', c, 6.2, 0.6) + T(tx + tw, cy + 30 + 4 * 26 + 2, '1000ms', c, 6.2, 0.6, 'end'), 'a-f', 4);
  s += every(`<rect x="${cx}" y="${cy + ch + 16}" width="${W - cx * 2}" height="${H - cy - ch - 32}" ${BG} stroke="${c}" stroke-opacity=".6"/>` + T(cx + 10, cy + ch + 38, 'CardAutoplay · replays the scene on mobile (no hover)', c, 6.8, 0.9) + T(cx + 10, cy + ch + 54, 'ease: cubic-bezier(0.22, 1, 0.36, 1)', c, 6.8, 0.75), 'a-f', 4.5);
  return s;
};
/** SEO & performance: a network waterfall (preloaded AVIF hero, deferred hls.js) and the JSON-LD graph. */
export const perfSpec: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const x0 = 16, nameW = 112, tx = x0 + nameW, tw = W - tx - 16, y0 = 34, rh = 22;
  s += every(T(x0, 22, 'NAME', c, 6.6, 0.7, 'start', 500) + T(tx, 22, '0', c, 6.4, 0.6) + T(tx + tw, 22, '1.6s', c, 6.4, 0.6, 'end') + `<path d="M${x0} 28H${W - 16}" stroke="${c}" stroke-opacity=".4"/>`, 'a-t', 0);
  const X = (sec: number) => tx + (tw * sec) / 1.6;
  const rows: [string, number, number, string][] = [['document', 0, 0.18, ''], ['hero-earth.avif', 0.12, 0.62, 'preload · high'], ['sf-pro.woff2', 0.16, 0.36, ''], ['app.js', 0.2, 0.5, ''], ['lenis.js', 0.48, 0.6, ''], ['hls.js', 1.2, 1.5, 'on play']];
  rows.forEach(([n, a, b, tag], i) => { const y = y0 + i * rh; if (i % 2) s += `<rect x="${x0}" y="${y}" width="${W - 32}" height="${rh}" fill="${c}" fill-opacity=".05"/>`; s += hook(T(x0, y + 14.5, n, c, 6.8, 0.95), 'a-t', 0.5 + i * 0.3) + `<rect class="a-x" data-o="${1 + a * 3}" x="${f(X(a))}" y="${y + 7}" width="${f(X(b) - X(a))}" height="8" ${n === 'hls.js' ? `stroke="${c}" stroke-dasharray="3 2"` : `fill="${c}"`}/>`; if (tag) s += X(b) + 70 > W - 16 ? T(X(a) - 5, y + 14.5, tag, c, 6.2, 0.8, 'end') : T(X(b) + 5, y + 14.5, tag, c, 6.2, 0.8); });
  const lcp = X(0.62); s += every(`<path d="M${f(lcp)} 28V${y0 + rh * rows.length}" stroke="${c}" stroke-dasharray="2 2"/>` + T(lcp + 4, y0 + rh * rows.length + 10, 'LCP', c, 6.6, 1, 'start', 600), 'a-yd', 3.5);
  const jy = y0 + rh * rows.length + 20;
  s += every(`<rect x="${x0}" y="${jy}" width="${W - 32}" height="${H - jy - 12}" ${BG} stroke="${c}" stroke-opacity=".6"/>` + T(x0 + 8, jy + 15, '<script type="application/ld+json">', c, 6.6, 0.75) + T(x0 + 8, jy + 29, '{ "@type": ["Organization", "FAQPage"], "mainEntity": 10 }', c, 6.6, 0.95), 'a-d', 4);
  return s;
};
