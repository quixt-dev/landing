/**
 * Tessa — developer / blueprint-styled graphics: monolinear strokes, grid overlays, dimension
 * annotations, CV-style detection boxes, JSON, network waterfalls, diffs and terminal output.
 * All labels are real Tessa concepts (formats, theme keys, queues, credit costs).
 */
import { f } from './svg';

import { T, BG, grid, corners, dimH, dimV, detect, handles, layout, onC, iso, planeTop, NS, hook, grp, every, type Art, type Pt } from './blueprint';

/* ---------------------------------------------------------------- signature (card + backdrop) */
/**
 * Isometric exploded view: a Brand DNA base plate (palette, type specimen, logo) with the ad formats
 * it generates stacked above it — each layer in its true aspect ratio, labelled with pixel sizes.
 */
export const tessaSignature: Art = (W, H, c) => {
  const k = W / 524, s = 0.6 * k, P = 150; // every plate shares one square footprint → a clean, aligned stack
  let out = grid(W, H, c, 16 * k, 0.05) + corners(W, H, c, 14 * k, 5 * k);
  // [label, size, aspect w, aspect h]
  const layers: [string, string, number, number][] = [
    ['brand_dna', 'voice · palette · type', 1, 1],
    ['ig_post', '1080 × 1080', 1, 1],
    ['ig_story', '1080 × 1920', 9, 16],
    ['facebook_post', '1200 × 630', 1.91, 1],
    ['hero_image', '1920 × 1080', 16, 9],
  ];
  const cx = W * 0.34, gap = 29 * k, top = 42 * k, n = layers.length;
  const O = (i: number): Pt => [cx, top + (n - 1 - i) * gap]; // plate back corner — same x for every layer, stack spans 42→248
  // exploded-view guides through the four plate corners
  const [tb, bb] = [O(layers.length - 1), O(0)];
  // one guide per plate corner (bottom → top, so packets rise); each stretches from its base when the stack explodes
  for (const [u, v] of [[0, 0], [P, 0], [0, P], [P, P]]) {
    const [x1, y1] = iso(tb, s, u, v), [, y2] = iso(bb, s, u, v);
    out += `<g class="a-guide" data-gap="${f(gap)}"><path class="a-d a-flow" d="M${f(x1)} ${f(y2)}V${f(y1)}" stroke="${c}" stroke-opacity=".3" stroke-dasharray="${f(2 * k)} ${f(3 * k)}"/></g>`;
  }
  const lx = W * 0.66;
  layers.forEach(([a, b, aw, ah], i) => {
    let body = `<rect width="${P}" height="${P}" ${BG} stroke="${c}" stroke-width="1.3"${NS}/>`;
    if (i === 0) {
      let g = ''; for (let u = 25; u < P; u += 25) g += `M${u} 0V${P}M0 ${u}H${P}`;
      body += `<path d="${g}" stroke="${c}" stroke-opacity=".14"${NS}/>`;
      body += `<text x="12" y="46" font-family="Roboto Mono, monospace" font-size="30" fill="${c}">Aa</text><text x="12" y="62" font-family="IBM Plex Mono, monospace" font-size="8.5" fill="${c}" fill-opacity=".85">Manrope · bold</text>`;
      [1, 0.62, 0.32, 0.14].forEach((o, q) => (body += `<rect x="${12 + q * 22}" y="${P - 34}" width="17" height="17" fill="${c}" fill-opacity="${o}" stroke="${c}"${NS}/>`));
      body += `<path d="M${P - 42} 14h12v12h12v12h-12v-12h-12z" fill="${c}"/><path d="M${P - 30} 14h12v12h-12z" fill="${c}" fill-opacity=".45"/>`;
    } else {
      // true-aspect artboard centred on the plate, with its own crop marks
      const m = 16, box = P - m * 2, sc = Math.min(box / aw, box / ah), w = aw * sc, h = ah * sc, x = (P - w) / 2, y = (P - h) / 2;
      body += `<path d="M${x - 6} ${y}H${x - 2}M${x} ${y - 6}V${y - 2}M${x + w + 2} ${y}H${x + w + 6}M${x + w} ${y - 6}V${y - 2}M${x - 6} ${y + h}H${x - 2}M${x} ${y + h + 2}V${y + h + 6}M${x + w + 2} ${y + h}H${x + w + 6}M${x + w} ${y + h + 2}V${y + h + 6}" stroke="${c}" stroke-opacity=".6"${NS}/>`;
      body += layout(x, y, w, h, c, NS);
    }
    // plate + its leader + label move as one unit (drop-in intro, exploded view on hover)
    const [rx, ry] = iso(O(i), s, P, 0);
    const leader = `<path d="M${f(rx + 4 * k)} ${f(ry)}H${f(lx - 8 * k)}" stroke="${c}" stroke-opacity=".5"/><circle cx="${f(rx + 4 * k)}" cy="${f(ry)}" r="${f(2 * k)}" fill="${c}"/>`;
    const label = T(lx, ry - 1 * k, a, c, 8.2 * k, 1, 'start', 500) + T(lx, ry + 9.5 * k, b, c, 6.8 * k, 0.65);
    out += `<g class="a-layer" data-i="${i}"><g transform="${planeTop(O(i), s)}">${body}</g>${leader}${label}</g>`;
  });
  out += hook(T(W - 22 * k, 30 * k, '// one brand_dna → every format', c, 7.6 * k, 0.75, 'end'), 'a-t', 3) + hook(T(W - 22 * k, H - 22 * k, '6 formats · 29 themes', c, 7.2 * k, 0.65, 'end'), 'a-t', 4);
  return out;
};

/* ---------------------------------------------------------------- modules */
/** Brand DNA extraction: website wireframe with detection boxes → extracted JSON (all inside bounds). */
export const scrape: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.06);
  const bx = 20, by = 16, bw = Math.round(W * 0.46), bh = H - 32; // browser frame: 20..411 × 16..224
  s += every(`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" stroke="${c}" fill="${c}" fill-opacity=".04"/><path d="M${bx} ${by + 18}H${bx + bw}" stroke="${c}" stroke-opacity=".5"/>`, 'a-d', 0);
  [0, 1, 2].forEach((i) => (s += `<circle class="a-p" data-o="1" cx="${bx + 10 + i * 9}" cy="${by + 9}" r="2.4" stroke="${c}" stroke-opacity=".7"/>`));
  s += every(`<rect x="${bx + 44}" y="${by + 4}" width="${bw - 88}" height="10" stroke="${c}" stroke-opacity=".5"/>`, 'a-x', 1) + hook(T(bx + 50, by + 12, 'https://superyou.in', c, 6.6, 0.8), 'a-t', 1);
  const X = bx + 16, R = bx + bw - 16, Y = by + 30; // content box 36..395 × 46..
  // nav
  s += every(`<rect x="${X}" y="${Y}" width="40" height="11" fill="${c}"/>` + [0, 1, 2, 3].map((i) => `<rect x="${R - 118 + i * 30}" y="${Y + 4}" width="20" height="3" fill="${c}" fill-opacity=".5"/>`).join(''), 'a-x', 2);
  // hero copy (left) + product (right)
  const colW = Math.round((R - X) * 0.5);
  s += every(`<rect x="${X}" y="${Y + 28}" width="${colW - 20}" height="9" fill="${c}"/><rect x="${X}" y="${Y + 42}" width="${colW - 44}" height="9" fill="${c}"/><rect x="${X}" y="${Y + 60}" width="${colW - 30}" height="3" fill="${c}" fill-opacity=".5"/><rect x="${X}" y="${Y + 68}" width="${colW - 56}" height="3" fill="${c}" fill-opacity=".5"/><rect x="${X}" y="${Y + 80}" width="46" height="13" stroke="${c}"/>`, 'a-x', 2);
  const ix = X + colW + 14, iy = Y + 20, iw = R - ix, ih = 84;
  s += every(`<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" stroke="${c}" stroke-opacity=".6"/><path d="M${f(ix + iw * 0.36)} ${iy + ih - 8}V${iy + 22}C${f(ix + iw * 0.36)} ${iy + 12} ${f(ix + iw * 0.64)} ${iy + 12} ${f(ix + iw * 0.64)} ${iy + 22}V${iy + ih - 8}Z" stroke="${c}"/>`, 'a-d', 2);
  // palette strip
  const py = Y + 118, ph = 26; ['#E1251B', '#7A3E1D', '#F4E3D3', '#1C1C1C'].forEach((_, i) => { const w = (R - X - 18) / 4; s += `<rect class="a-y" data-o="3" x="${f(X + i * (w + 6))}" y="${py}" width="${f(w)}" height="${ph}" fill="${c}" fill-opacity="${[0.9, 0.55, 0.2, 0.75][i]}"/>`; });
  // detection boxes — inset 4px from the content they wrap, never touching the frame
  // detection boxes "lock on" one by one, while a scan line sweeps the page
  s += grp(detect(X - 4, Y - 4, 66, 19, 'logo 0.97', c), 'a-p', 4) + grp(detect(X - 4, Y + 24, colW - 12, 31, 'voice', c), 'a-p', 5) + grp(detect(ix - 4, iy - 4, iw + 8, ih + 8, 'product ×12', c), 'a-p', 6) + grp(detect(X - 4, py - 4, R - X + 8, ph + 8, 'palette', c), 'a-p', 7);
  s += `<g class="a-scan" style="--scan-y:${bh - 26}px;--scan-dur:3.8s"><rect x="${bx + 1}" y="${by + 19}" width="${bw - 2}" height="14" fill="${c}" fill-opacity=".08"/><rect x="${bx + 1}" y="${by + 32}" width="${bw - 2}" height="1.4" fill="${c}" fill-opacity=".85"/></g>`;
  // arrow + label + json
  const jx = bx + bw + 88;
  s += `<path class="a-d a-flow" data-o="8" d="M${bx + bw + 8} ${H / 2}H${jx - 12}" stroke="${c}" stroke-width="1.3"/><path class="a-f" data-o="8" d="M${jx - 18} ${H / 2 - 4}L${jx - 12} ${H / 2}L${jx - 18} ${H / 2 + 4}" stroke="${c}"/>` + hook(T((bx + bw + jx) / 2 - 2, H / 2 + 14, 'gemini-vision', c, 6.6, 0.8, 'middle'), 'a-t', 8);
  const js = ['brand_dna = {', '  voice:   "bold, playful",', '  fonts:   ["Manrope 700"],', '  logo:    "s3://…/logo.svg",', '  palette: [', '', '  products: 12,', '}'];
  js.forEach((l, i) => (s += hook(T(jx, 40 + i * 22, l, c, 9, i === 0 || i === js.length - 1 ? 1 : 0.92), 'a-t', 9)));
  ['#E1251B', '#7A3E1D', '#F4E3D3', '#1C1C1C'].forEach((hex, i) => (s += `<rect class="a-p" data-o="11" x="${jx + 20 + i * 76}" y="${40 + 5 * 22 - 10}" width="11" height="11" fill="${c}" fill-opacity="${[1, 0.6, 0.25, 0.85][i]}" stroke="${c}"/>` + hook(T(jx + 35 + i * 76, 40 + 5 * 22, hex, c, 7.6, 0.85), 'a-t', 11)));
  return s;
};
/** Campaign engine: dev-tools network waterfall of per-format jobs across Celery queues. */
export const waterfall: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const x0 = 18, y0 = 34, rowH = 26, nameW = 150, tx = x0 + nameW, tw = W - tx - 18;
  s += every(T(x0, 22, 'NAME', c, 7.5, 0.7, 'start', 500) + T(x0 + 104, 22, 'QUEUE', c, 7.5, 0.7, 'start', 500) + T(tx, 22, 'queued → copy → render', c, 7.5, 0.7, 'start', 500), 'a-t', 0);
  s += `<path class="a-d" d="M${x0} 28H${W - 18}" stroke="${c}" stroke-opacity=".4"/>`;
  for (let i = 0; i <= 4; i++) s += `<path class="a-d" data-o="1" d="M${f(tx + (tw * i) / 4)} 28V${y0 + rowH * 6}" stroke="${c}" stroke-opacity=".12" stroke-dasharray="2 3"/>`;
  const jobs: [string, string, number, number, number][] = [['ig_post', 'gpu', 0.02, 0.18, 0.46], ['ig_story', 'gpu', 0.06, 0.2, 0.56], ['facebook_post', 'gpu', 0.1, 0.16, 0.5], ['twitter_header', 'gpu', 0.18, 0.14, 0.4], ['linkedin_post', 'gpu', 0.22, 0.18, 0.52], ['hero_image', 'gpu', 0.3, 0.22, 0.6]];
  jobs.forEach(([n, q, st, cp, rd], i) => {
    const y = y0 + i * rowH; if (i % 2) s += `<rect x="${x0}" y="${y}" width="${W - 36}" height="${rowH}" fill="${c}" fill-opacity=".04"/>`;
    s += every(T(x0, y + 16, n, c, 8.5, 0.95) + T(x0 + 104, y + 16, q, c, 8, 0.7), 'a-f', 1 + i * 0.5);
    const a = tx + tw * st, b = a + tw * cp, e = Math.min(tx + tw, b + tw * rd * 0.6);
    // queued outline grows, then the render bar fills — in job order, like a real waterfall
    s += `<rect class="a-x" data-o="${2 + i * 0.6}" x="${f(a)}" y="${y + 9}" width="${f(b - a)}" height="8" fill="none" stroke="${c}"/><rect class="a-x" data-o="${3 + i * 0.6}" x="${f(b)}" y="${y + 9}" width="${f(e - b)}" height="8" fill="${c}"/>`;
    s += i === 5 ? `<rect class="a-glow" x="${f(e - 12)}" y="${y + 9}" width="12" height="8" fill="${c}" fill-opacity=".3"/><g class="a-spin" data-o="7">${T(e + 7, y + 16, '⟳', c, 9, 0.9, 'middle')}</g>` : hook(T(e + 4, y + 16, '✓', c, 9, 0.9), 'a-p', 3.4 + i * 0.6);
  });
  const fy = y0 + rowH * 6 + 18;
  s += `<path class="a-d" data-o="6" d="M${x0} ${fy - 8}H${W - 18}" stroke="${c}" stroke-opacity=".4"/>` + hook(T(x0, fy + 4, 'task 7f3a · 5/6 done · polling /tasks/{id}', c, 8, 0.85), 'a-t', 7);
  return s;
};
/** Ad themes: design-tool canvas with named, dimensioned artboards and a selection. */
export const artboards: Art = (W, H, c) => {
  let s = grid(W, H, c, 12, 0.07);
  const ab: [number, number, number, number, string, string][] = [[26, 40, 104, 104, 'product_hero', '1080 × 1080'], [156, 30, 70, 124, 'ugc_style', '1080 × 1920'], [252, 52, 138, 72, 'social_proof_stats', '1200 × 630']];
  ab.forEach(([x, y, w, h, n, d], i) => { s += hook(T(x, y - 6, n, c, 8, 0.95, 'start', 500), 'a-t', i) + every(layout(x, y, w, h, c), 'a-d', i) + hook(T(x + w, y + h + 12, d, c, 7.5, 0.7, 'end'), 'a-f', i + 1); });
  s += grp(handles(252, 52, 138, 72, c) + `<rect x="252" y="52" width="138" height="72" stroke="${c}" stroke-width="1.6"/>`, 'a-p', 4);
  s += grp(dimH(252, 390, 144, '1200', c) + dimV(52, 124, 404, '630', c), 'a-f', 5);
  s += grp(`<rect x="${W - 150}" y="${H - 58}" width="124" height="38" stroke="${c}" stroke-opacity=".5"/>` + T(W - 144, H - 44, 'theme: 3 / 29', c, 8, 0.9) + T(W - 144, H - 30, 'meme_style_viral ›', c, 7.5, 0.7), 'a-f', 6);
  s += hook(T(26, H - 28, '+ 26 more themes', c, 8, 0.7), 'a-t', 6);
  return s;
};
/** Chat & image editing: prompt, marquee selection on the creative, and the resulting diff. */
export const diff: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  s += `<rect class="a-d" x="18" y="18" width="${W - 36}" height="24" stroke="${c}"/>` + hook(T(28, 34, '> make the background warmer, golden hour', c, 8.5, 0.95), 'a-t', 1) + `<rect class="a-p" data-o="2" x="${W - 46}" y="24" width="18" height="12" fill="${c}"/>` + hook(T(W - 37, 33, '↵', onC(c), 8, 1, 'middle'), 'a-p', 2);
  const ix = 18, iy = 56, iw = 150, ih = 150;
  s += `<rect class="a-f" data-o="2" x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="${c}" fill-opacity=".08" stroke="${c}"/><path class="a-d" data-o="2" d="M${ix + 50} ${iy + ih - 20}V${iy + 50}C${ix + 50} ${iy + 34} ${ix + 100} ${iy + 34} ${ix + 100} ${iy + 50}V${iy + ih - 20}Z" stroke="${c}" stroke-width="1.3"/>`;
  s += `<rect class="a-p a-march" data-o="3" x="${ix + 8}" y="${iy + 8}" width="${iw - 16}" height="${ih - 16}" stroke="${c}" stroke-dasharray="4 3"/>` + hook(T(ix + 10, iy + ih + 14, 'mask: background', c, 7.5, 0.8), 'a-t', 3);
  const dx = ix + iw + 18;
  const rows: [string, string][] = [['@@', 'edit_image · v1 → v2'], ['-', 'background: #F1F1F1'], ['+', 'background: #F3D9C6'], ['-', 'lighting:   neutral'], ['+', 'lighting:   golden-hour'], [' ', 'subject:    unchanged'], [' ', 'cost:       0.5 credits']];
  rows.forEach(([m, t], i) => { const y = iy + 8 + i * 20, o = 4 + i * 0.5; if (m === '+' || m === '-') s += `<rect class="a-x" data-o="${o}" x="${dx}" y="${y - 3}" width="${W - dx - 18}" height="18" fill="${c}" fill-opacity="${m === '+' ? 0.14 : 0.05}"/>`; s += hook(T(dx + 6, y + 10, m, c, 9, 1, 'start', 600), 'a-p', o) + hook(T(dx + 20, y + 10, t, c, 8.5, m === '@@' ? 0.7 : 0.95), 'a-t', o); });
  return s;
};
/** Credits: terminal breakdown with the real per-action costs and a usage meter. */
export const usage: Art = (W, H, c) => {
  let s = every(`<rect x="18" y="16" width="${W - 36}" height="${H - 32}" stroke="${c}" stroke-opacity=".6"/><path d="M18 34H${W - 18}" stroke="${c}" stroke-opacity=".4"/>`, 'a-d', 0);
  [0, 1, 2].forEach((i) => (s += `<rect class="a-p" data-o="1" x="${28 + i * 10}" y="22" width="6" height="6" fill="${c}" fill-opacity="${0.4 + i * 0.3}"/>`));
  s += hook(T(W / 2, 29, 'zsh · tessa', c, 7.5, 0.7, 'middle'), 'a-t', 1);
  const L = ['$ tessa credits --breakdown', '', 'ACTION             COST', 'website_scrape     10.0', 'product_scrape      2.0', 'format_generate     1.0', 'image_edit          0.5', '──────────────────────'];
  L.forEach((l, i) => (s += hook(T(30, 52 + i * 15, l, c, 8.5, i === 0 ? 1 : i === 2 ? 0.7 : 0.92, 'start', i === 0 ? 500 : 400), 'a-t', 2 + i * 0.7)));
  const y = 52 + L.length * 15 + 4, bw = W - 60 - 90;
  s += hook(T(30, y, 'used', c, 8.5, 0.7), 'a-f', 8) + `<rect class="a-x" data-o="8" x="62" y="${y - 8}" width="${bw}" height="9" stroke="${c}" stroke-opacity=".6"/>`;
  for (let i = 0; i < 26; i++) { const x = 64 + i * ((bw - 4) / 26); if (i < 4) s += `<rect class="a-p" data-o="${9 + i * 0.3}" x="${f(x)}" y="${y - 6}" width="${f((bw - 4) / 26 - 1.5)}" height="5" fill="${c}"/>`; }
  s += hook(T(62 + bw + 8, y, '128/1000', c, 8.5, 1), 'a-t', 9);
  s += hook(T(30, y + 18, '$', c, 8.5, 0.9), 'a-f', 10) + `<rect class="a-blink" x="40" y="${y + 10}" width="6" height="10" fill="${c}"/>`;
  return s;
};
