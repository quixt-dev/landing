/**
 * Builds the Quixt wordmark (public/logo.svg) from the traced glyph source (scripts/brand/glyph-source.svg, the
 * original wordmark trace). The x (with its cutout and accent arm) and the t are reused untouched; the new letters
 * are derived from the same drawing so stem weight, x-height, baseline and overshoots match exactly:
 *   q = the source p mirrored horizontally (bowl left, stem + descender right)
 *   u = the source n rotated 180° about the x-height/baseline band (stem right, bowl overshoots the baseline)
 *   i = a stem of the measured stem width (164 u) from x-height to baseline + a square dot level with the t's top
 * Also writes scripts/brand/quixt-logo.json (letters, x parts, x box) for the motion reel's end card.
 * Usage: node scripts/brand/build-logo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../..');
const src = fs.readFileSync(path.join(here, 'glyph-source.svg'), 'utf8');
const [letters] = [...src.matchAll(/<path fill="#fff" d="([^"]+)"/g)].map((m) => m[1]);
const [accent] = [...src.matchAll(/<path fill="#FFB27A" d="([^"]+)"/g)].map((m) => m[1]);
const subs = letters.split(/(?=M )/).filter((s) => s.trim());
const nums = (s) => s.match(/-?\d+\.?\d*/g).map(Number);
const bb = (s) => { const n = nums(s), xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; };
const pick = (x0, x1) => subs.filter((s) => { const b = bb(s); return b.x0 >= x0 && b.x1 <= x1; });
// transform every coordinate pair of an absolute M/C/L path
const tf = (d, f) => { let xy = 0, px = 0; return d.replace(/-?\d+\.?\d*/g, (v) => { v = +v; if (xy === 0) { px = v; xy = 1; return '\u0000'; } xy = 0; const [X, Y] = f(px, v); return `${X.toFixed(2)} ${Y.toFixed(2)}`; }).replace(/\u0000\s*/g, ''); };
const shift = (d, dx) => tf(d, (x, y) => [x + dx, y]);

const XH = 286, BASE = 1089, STEM = 164, TTOP = 63.2;
const P = pick(1590, 2372), Nn = pick(2418, 3178), X = pick(3210, 4022), T = pick(4050, 4470);
// q: mirror p (x' = x0 + x1 - x), then place
const pb = { x0: 1594, x1: 2369 };
const qRaw = P.map((s) => tf(s, (x, y) => [pb.x0 + pb.x1 - x, y]));
// u: rotate n 180° within its band (x' = x0 + x1 - x, y' = XH + BASE - y)
const nb = { x0: 2421, x1: 3174 };
const uRaw = Nn.map((s) => tf(s, (x, y) => [nb.x0 + nb.x1 - x, XH + BASE - y]));
const rect = (x, y, w, h) => `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} L ${x} ${y}`;

// spacing taken from the source: straight→round ≈ 50, straight→straight ≈ 60, straight→diagonal ≈ 40, x→t as drawn
const L0 = 62.5;
const qx = L0, qDx = qx - pb.x0;
const ux = qx + (pb.x1 - pb.x0) + 50, uDx = ux - nb.x0;
const ix = ux + (nb.x1 - nb.x0) + 60;
const xx = ix + STEM + 40, xDx = xx - 3213.26;
const out = {
  q: qRaw.map((s) => shift(s, qDx)).join(' '),
  u: uRaw.map((s) => shift(s, uDx)).join(' '),
  i: `${rect(ix, XH, STEM, BASE - XH)} ${rect(ix, TTOP, STEM, STEM)}`,
  x: X.map((s) => shift(s, xDx)).join(' '),
  t: T.map((s) => shift(s, xDx)).join(' '),
  arm: shift(accent, xDx),
};
const right = 4465.2 + xDx, W = +(right - L0 + 0.3).toFixed(2), vb = [L0, 63.2, W, 1382.3];
const body = [out.q, out.u, out.i, out.x, out.t].join(' ');
const scale = 1467.44 / 4402.31;   // same rendered size per unit as the old file
fs.writeFileSync(path.join(root, 'public/logo.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${(W * scale).toFixed(2)}" height="460.77" fill-rule="evenodd"><title>Quixt</title><path fill="#fff" d="${body}"/><path fill="#FFB27A" d="${out.arm}"/></svg>`);
// brand-orange version for light surfaces (the navbar when it inverts over the orange footer)
fs.writeFileSync(path.join(root, 'public/logo-brand.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${(W * scale).toFixed(2)}" height="460.77" fill-rule="evenodd"><title>Quixt</title><path fill="#AB4200" d="${body}"/><path fill="#E08A4E" d="${out.arm}"/></svg>`);
const S = 805.7441, xbox = { x: 3213.2559 + xDx, y: 286.1551 - (S - 802.8449) / 2, s: S };
const xParts = X.map((s) => ({ d: shift(s, xDx), ...bb(shift(s, xDx)) }));
fs.writeFileSync(path.join(here, 'quixt-logo.json'), JSON.stringify({
  vb, ratio: W / 1382.3,
  letters: [['q', out.q, qx, qx + (pb.x1 - pb.x0)], ['u', out.u, ux, ux + (nb.x1 - nb.x0)], ['i', out.i, ix, ix + STEM], ['t', out.t, 4053.3 + xDx, 4465.2 + xDx]].map(([k, d, x0, x1]) => ({ k, d, x0, x1 })),
  x: { body: xParts.map((p) => p.d).join(' '), arm: out.arm }, xbox,
}));
console.log('logo.svg', vb.join(' '), 'ratio', (W / 1382.3).toFixed(4), 'x at', xx.toFixed(1));
