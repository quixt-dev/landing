/**
 * NandyAI — developer / blueprint-styled graphics: an isometric wireframe society matched against a
 * parsed bank statement, plus pipeline, trace, receipt, gate-log and RLS request-path diagrams.
 * Labels use real NandyAI concepts (reconciliation outcomes, tools, roles, flats from the seed data).
 */
import { f } from './svg';
import { T, BG, grid, corners, onC, iso, planeTop, planeLeft, planeRight, NS, hook, grp, every, type Art, type Pt } from './blueprint';

/* ---------------------------------------------------------------- isometric tower */
type Tower = { O: Pt; w: number; d: number; h: number; floors: number; cols: number; name: string; lit: [face: 'L' | 'R', floor: number, col: number][] };
/** Screen point of a window centre on a tower face. */
const windowPt = (t: Tower, s: number, face: 'L' | 'R', floor: number, col: number): Pt => {
  const fh = t.h / t.floors, cw = (face === 'L' ? t.w : t.d) / t.cols;
  const u = (col + 0.5) * cw, z = t.h - (floor + 0.5) * fh;
  return face === 'L' ? iso(t.O, s, u, t.d, z) : iso(t.O, s, t.w, u, z);
};
const tower = (t: Tower, s: number, c: string) => {
  const fh = t.h / t.floors;
  const face = (face: 'L' | 'R') => {
    const span = face === 'L' ? t.w : t.d, cw = span / t.cols; let g = `<rect width="${span}" height="${t.h}" fill="${c}" fill-opacity="${face === 'L' ? 0.05 : 0.12}"${NS} stroke="${c}" stroke-width="1.2"/>`;
    for (let r = 0; r < t.floors; r++) for (let q = 0; q < t.cols; q++) {
      const on = t.lit.some(([fc, fl, cl]) => fc === face && fl === r && cl === q);
      g += `<rect${on ? ` class="a-glow" style="animation-delay:${-((r * 3 + q) % 5) * 0.6}s"` : ''} x="${f(q * cw + cw * 0.22)}" y="${f(r * fh + fh * 0.24)}" width="${f(cw * 0.56)}" height="${f(fh * 0.5)}" ${on ? `fill="${c}"` : `fill="none" stroke="${c}" stroke-opacity=".45"${NS}`}/>`;
    }
    return g;
  };
  let o = `<g transform="${planeLeft(t.O, s, t.d, t.h)}">${face('L')}</g><g transform="${planeRight(t.O, s, t.w, t.h)}">${face('R')}</g>`;
  o += `<g transform="${planeTop(t.O, s, t.h)}"><rect width="${t.w}" height="${t.d}" ${BG} stroke="${c}" stroke-width="1.2"${NS}/><rect x="${t.w * 0.3}" y="${t.d * 0.3}" width="${t.w * 0.4}" height="${t.d * 0.4}" stroke="${c}" stroke-opacity=".5"${NS}/></g>`;
  const [tx, ty] = iso(t.O, s, t.w / 2, t.d / 2, t.h);
  return o + T(tx, ty - (t.w + t.d) * 0.25 * s - 8 * s, `tower ${t.name}`, c, 7.5 * s, 0.85, 'middle', 500);
};

/* ---------------------------------------------------------------- signature (card + backdrop) */
/** Parsed bank statement on the left; each matched row wires into a lit flat window in the society. */
export const nandySignature: Art = (W, H, c) => {
  const k = W / 524, s = 1 * k;
  let out = grid(W, H, c, 16 * k, 0.05) + corners(W, H, c, 14 * k, 5 * k);
  // statement panel
  const px = 26 * k, py = 36 * k, pw = 214 * k, rowH = 24 * k;
  const rows: [string, string, string, 'ok' | '?' | 'x'][] = [
    ['12 Jun', 'UPI/CR/A-101', '2,500.00', 'ok'], ['12 Jun', 'NEFT/B-202', '2,500.00', 'ok'], ['13 Jun', 'UPI/CR/98··12', '800.00', '?'],
    ['14 Jun', 'IMPS/A-102', '1,800.00', 'ok'], ['15 Jun', 'NEFT/B-201', '2,500.00', 'ok'], ['15 Jun', 'CHQ/004512', '4,300.00', 'x'],
  ];
  out += every(`<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(30 * k + rows.length * rowH)}" ${BG} stroke="${c}"/><path d="M${f(px)} ${f(py + 20 * k)}H${f(px + pw)}" stroke="${c}" stroke-opacity=".5"/>`, 'a-d', 0);
  out += every(T(px + 8 * k, py + 13.5 * k, 'bank_statement.pdf', c, 7.6 * k, 1, 'start', 500) + T(px + pw - 8 * k, py + 13.5 * k, 'parsed', c, 7 * k, 0.7, 'end'), 'a-t', 0);
  // towers
  const A: Tower = { O: [372 * k, 132 * k], w: 46, d: 40, h: 100, floors: 5, cols: 3, name: 'A', lit: [['L', 1, 0], ['L', 2, 2], ['R', 1, 1]] };
  const B: Tower = { O: [456 * k, 150 * k], w: 40, d: 36, h: 76, floors: 4, cols: 3, name: 'B', lit: [['L', 1, 1], ['L', 2, 0]] };
  // ground plate
  out += grp(`<g transform="${planeTop([372 * k - 26 * k, 122 * k], s)}"><rect x="-30" y="-6" width="170" height="120" stroke="${c}" stroke-opacity=".2" stroke-dasharray="2 3"${NS}/></g>`, 'a-f', 1);
  out += grp(tower(B, s, c), 'a-f', 1.4) + grp(tower(A, s, c), 'a-f', 1);
  // scan band sweeping the statement while it is being reconciled
  out += `<g class="a-scan" style="--scan-y:${f(rowH * (rows.length - 1))}px;--scan-dur:4.2s"><rect x="${f(px + 1)}" y="${f(py + 30 * k)}" width="${f(pw - 2)}" height="${f(rowH)}" fill="${c}" fill-opacity=".07"/><rect x="${f(px + 1)}" y="${f(py + 30 * k + rowH - 1)}" width="${f(pw - 2)}" height="1.2" fill="${c}" fill-opacity=".6"/></g>`;
  // rows + leaders
  const targets: Pt[] = [windowPt(A, s, 'L', 1, 0), windowPt(A, s, 'L', 2, 2), [0, 0], windowPt(B, s, 'L', 1, 1), windowPt(B, s, 'L', 2, 0), [0, 0]];
  rows.forEach(([d, n, a, st], i) => {
    const y = py + 30 * k + i * rowH + rowH / 2;
    const o = 2 + i * 0.7; // each row is reconciled in turn: row → verdict → connector → flat lights up
    if (i % 2) out += `<rect x="${f(px + 1)}" y="${f(y - rowH / 2)}" width="${f(pw - 2)}" height="${f(rowH)}" fill="${c}" fill-opacity=".05"/>`;
    out += every(T(px + 8 * k, y + 3 * k, d, c, 7 * k, 0.7) + T(px + 48 * k, y + 3 * k, n, c, 7.2 * k, 0.95) + T(px + pw - 26 * k, y + 3 * k, a, c, 7.2 * k, 0.95, 'end'), 'a-t', o);
    const mx = px + pw - 13 * k;
    if (st === 'ok') {
      out += grp(`<rect x="${f(mx - 5 * k)}" y="${f(y - 5 * k)}" width="${f(10 * k)}" height="${f(10 * k)}" fill="${c}"/><path d="M${f(mx - 2.5 * k)} ${f(y)}l${f(1.8 * k)} ${f(2 * k)} ${f(3.4 * k)} ${f(-4 * k)}" stroke="${onC(c)}" stroke-width="${f(1.2 * k)}"/>`, 'a-p', o + 0.5);
      const [tx, ty] = targets[i];
      out += `<path class="a-d a-flow" data-o="${o + 0.8}" d="M${f(px + pw)} ${f(y)}C${f(px + pw + 50 * k)} ${f(y)} ${f(tx - 50 * k)} ${f(ty)} ${f(tx)} ${f(ty)}" stroke="${c}" stroke-opacity=".7" stroke-width="${f(0.9 * k)}"/><circle class="a-p" data-o="${o + 2}" cx="${f(tx)}" cy="${f(ty)}" r="${f(2.2 * k)}" fill="${c}"/>`;
    } else if (st === '?') {
      out += grp(`<rect x="${f(mx - 5 * k)}" y="${f(y - 5 * k)}" width="${f(10 * k)}" height="${f(10 * k)}" stroke="${c}"/>` + T(mx, y + 3 * k, '?', c, 7 * k, 1, 'middle', 600), 'a-p', o + 0.5) + `<path class="a-f" data-o="${o + 0.8}" d="M${f(px + pw)} ${f(y)}h${f(26 * k)}" stroke="${c}" stroke-dasharray="${f(2 * k)} ${f(2 * k)}" stroke-opacity=".6"/>` + hook(T(px + pw + 30 * k, y + 3 * k, '2 flats', c, 6.6 * k, 0.75), 'a-t', o + 1);
    } else {
      out += grp(`<rect x="${f(mx - 5 * k)}" y="${f(y - 5 * k)}" width="${f(10 * k)}" height="${f(10 * k)}" stroke="${c}" stroke-dasharray="${f(2 * k)} ${f(1.5 * k)}"/>` + T(mx, y + 3 * k, '×', c, 7.5 * k, 1, 'middle'), 'a-p', o + 0.5);
    }
  });
  out += hook(T(px, py + 30 * k + rows.length * rowH + 16 * k, '4 matched · 1 ambiguous · 1 unmatched', c, 7 * k, 0.75), 'a-t', 7);
  out += hook(T(W - 22 * k, H - 22 * k, '// classify() → officer review', c, 7.5 * k, 0.7, 'end'), 'a-t', 7.5);
  return out;
};

/* ---------------------------------------------------------------- bento */
/** Reconcile pipeline: statement → extract (DeepSeek) → deterministic classify → officer review. */
export const reconcileFlow: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.06);
  const dx = 22, dy = 44, dw = 96, dh = 128;
  s += every(`<path d="M${dx} ${dy}H${dx + dw - 20}L${dx + dw} ${dy + 20}V${dy + dh}H${dx}Z" stroke="${c}" ${BG}/><path d="M${dx + dw - 20} ${dy}V${dy + 20}H${dx + dw}" stroke="${c}"/>`, 'a-d', 0);
  for (let i = 0; i < 7; i++) s += `<rect class="a-x" data-o="${1 + i * 0.25}" x="${dx + 12}" y="${dy + 32 + i * 12}" width="${[60, 48, 66, 40, 58, 52, 34][i]}" height="3" fill="${c}" fill-opacity=".55"/>`;
  s += every(T(dx, dy - 10, 'statement.pdf', c, 8, 0.95, 'start', 500) + T(dx, dy + dh + 18, 'pdf · csv · xlsx', c, 7, 0.7), 'a-t', 0);
  const arrow = (x1: number, x2: number, y: number, label: string, o: number) => `<path class="a-d a-flow" data-o="${o}" d="M${x1} ${y}H${x2 - 5}" stroke="${c}" stroke-width="1.2"/><path class="a-f" data-o="${o}" d="M${x2 - 10} ${y - 4}L${x2 - 4} ${y}L${x2 - 10} ${y + 4}" stroke="${c}"/>` + hook(T((x1 + x2) / 2, y - 7, label, c, 6.8, 0.8, 'middle'), 'a-t', o);
  s += arrow(dx + dw + 8, 196, H / 2, 'extract', 3);
  const tx = 200, tw = 404, ty = 26, rh = 30;
  s += `<rect class="a-d" data-o="3" x="${tx}" y="${ty}" width="${tw}" height="${34 + 5 * rh}" ${BG} stroke="${c}"/>`;
  s += every([['DATE', 12], ['NARRATION', 70], ['AMOUNT', 250], ['OUTCOME', 322]].map(([t, x]) => T(tx + (x as number), ty + 21, t as string, c, 7.4, 0.7, 'start', 500)).join(''), 'a-t', 4) + `<path class="a-d" data-o="4" d="M${tx} ${ty + 30}H${tx + tw}" stroke="${c}" stroke-opacity=".5"/>`;
  const rows: [string, string, string, string][] = [['12 Jun', 'UPI/CR/A-101/RAVI', '2,500.00', 'matched'], ['12 Jun', 'NEFT/B-202/MAINT', '2,500.00', 'matched'], ['13 Jun', 'UPI/CR/98··12', '800.00', 'ambiguous'], ['14 Jun', 'IMPS/A-102/NAIR', '1,800.00', 'matched'], ['15 Jun', 'CHQ/004512', '4,300.00', 'unmatched']];
  rows.forEach(([d, n, a, o], i) => {
    const y = ty + 30 + i * rh, b = 5 + i * 0.55; if (o === 'ambiguous') s += `<rect class="a-glow" x="${tx + 1}" y="${y + 1}" width="${tw - 2}" height="${rh - 1}" fill="${c}" fill-opacity=".1"/>`;
    s += every(T(tx + 12, y + 19, d, c, 7.6, 0.75) + T(tx + 70, y + 19, n, c, 7.8, 0.95) + T(tx + 300, y + 19, a, c, 7.8, 0.95, 'end'), 'a-t', b);
    const cw = o.length * 5.8 + 16;
    s += grp(o === 'matched' ? `<rect x="${tx + 322}" y="${y + 8}" width="${cw}" height="15" fill="${c}"/>` + T(tx + 330, y + 19, o, onC(c), 7.2, 1) : `<rect x="${tx + 322}" y="${y + 8}" width="${cw}" height="15" stroke="${c}"${o === 'unmatched' ? ' stroke-dasharray="3 2"' : ''}/>` + T(tx + 330, y + 19, o, c, 7.2, 1), 'a-p', b + 0.6);
    if (i < 4) s += `<path d="M${tx} ${y + rh}H${tx + tw}" stroke="${c}" stroke-opacity=".15"/>`;
  });
  s += hook(T(tx, ty + 34 + 5 * rh + 18, 'classify(txn, residents) · deterministic, sorted by residentId', c, 7, 0.7), 'a-t', 8);
  s += arrow(tx + tw + 8, 640, H / 2, 'review', 8.5);
  const rx = 642, rw = W - rx - 20;
  s += `<rect class="a-d" data-o="9" x="${rx}" y="44" width="${rw}" height="128" ${BG} stroke="${c}"/>` + hook(T(rx + 12, 64, 'officer review', c, 8.4, 1, 'start', 500), 'a-t', 9);
  [['matched', '3'], ['ambiguous', '1'], ['unmatched', '1']].forEach(([l, v], i) => (s += every(T(rx + 12, 88 + i * 17, l, c, 7.8, 0.85) + T(rx + rw - 12, 88 + i * 17, v, c, 7.8, 1, 'end'), 'a-f', 9.5 + i * 0.3)));
  s += grp(`<rect x="${rx + 12}" y="${142}" width="${(rw - 30) / 2}" height="18" fill="${c}"/>` + T(rx + 12 + (rw - 30) / 4, 154.5, 'Confirm', onC(c), 7.6, 1, 'middle'), 'a-p', 10.5) + grp(`<rect x="${rx + 18 + (rw - 30) / 2}" y="142" width="${(rw - 30) / 2}" height="18" stroke="${c}"/>` + T(rx + 18 + (rw - 30) * 0.75, 154.5, 'Edit', c, 7.6, 1, 'middle'), 'a-p', 10.8);
  return s;
};
/** Assistant: a tracing-style span timeline — question → tool call → result → proposal. */
export const trace: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const x0 = 30, y0 = 34, step = 44, bx = 120, bw = W - bx - 24;
  s += `<path id="tr-life" class="a-d" d="M${x0} ${y0}V${y0 + step * 3}" stroke="${c}" stroke-opacity=".4"/><rect class="a-ride" data-ride="#tr-life" data-dur="2.8" data-ease="power1.inOut" width="5" height="5" fill="${c}"/>`;
  const spans: [string, string, number, number, boolean][] = [
    ['user', '"What do I owe for B-202?"', 0, 1, false],
    ['tool_call', 'my_dues({ flat: "B-202" })', 0.08, 0.34, true],
    ['result', '₹4,300.00 · 2 items · 1 overdue', 0.42, 0.18, false],
    ['proposal', 'create_reminder(B-202)', 0.6, 0.4, true],
  ];
  spans.forEach(([k, t, st, len, solid], i) => {
    const y = y0 + i * step, o = 1 + i * 1.1;
    s += `<rect class="a-p" data-o="${o}" x="${x0 - 5}" y="${y - 5}" width="10" height="10" ${i === 3 ? `fill="${c}"` : `${BG} stroke="${c}"`}/>` + hook(T(x0 + 14, y + 3, k, c, 7.6, 0.8, 'start', 500), 'a-t', o);
    s += `<rect class="a-x" data-o="${o + 0.3}" x="${f(bx + bw * st)}" y="${y - 7}" width="${f(bw * len)}" height="14" ${solid ? `fill="${c}" fill-opacity=".9"` : `fill="${c}" fill-opacity=".1" stroke="${c}"`}/>` + hook(T(bx + 2, y + 21, t, c, 7.6, 0.95), 'a-t', o + 0.5);
  });
  const py = y0 + step * 3 + 30;
  s += grp(`<rect x="${bx}" y="${py}" width="58" height="17" fill="${c}"/>` + T(bx + 29, py + 12, 'Confirm', onC(c), 7.4, 1, 'middle'), 'a-p', 5.5) + grp(`<rect x="${bx + 64}" y="${py}" width="58" height="17" stroke="${c}"/>` + T(bx + 93, py + 12, 'Decline', c, 7.4, 1, 'middle'), 'a-p', 5.8) + hook(T(W - 24, py + 12, '46 tools allowlisted', c, 7, 0.7, 'end'), 'a-t', 6);
  return s;
};
/** Billing & dues: a monospace dues receipt with a perforated edge and an OVERDUE stamp. */
export const receipt: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const x = W * 0.2, w = W * 0.6, y = 14, h = H - 30;
  let zig = `M${x} ${y}H${x + w}V${y + h}`; const n = 16; for (let i = 0; i < n; i++) { const x1 = x + w - (w / n) * (i + 0.5), x2 = x + w - (w / n) * (i + 1); zig += `L${f(x1)} ${y + h - 6}L${f(x2)} ${y + h}`; } zig += 'Z';
  s += `<path class="a-d" d="${zig}" ${BG} stroke="${c}"/>`;
  let line = 1;
  const L = (yy: number, a: string, b = '', op = 0.95, wgt = 400) => every(T(x + 14, yy, a, c, 7.8, op, 'start', wgt) + (b ? T(x + w - 14, yy, b, c, 7.8, op, 'end', wgt) : ''), 'a-t', (line += 0.45));
  s += L(y + 22, 'DUES · FLAT B-202', '', 1, 500) + L(y + 36, 'Green Meadows RWA · Jun 2026', '', 0.65);
  s += `<path class="a-f" data-o="2" d="M${x + 12} ${y + 46}H${x + w - 12}" stroke="${c}" stroke-dasharray="2 3" stroke-opacity=".6"/>`;
  s += L(y + 64, 'Monthly maintenance', '2,500.00') + L(y + 78, '  due 11 Jun 2026', '', 0.6) + L(y + 98, 'Lift motor replacement', '1,800.00') + L(y + 112, '  due 26 Jun 2026', '', 0.6);
  s += `<path class="a-f" data-o="4.5" d="M${x + 12} ${y + 124}H${x + w - 12}" stroke="${c}" stroke-dasharray="2 3" stroke-opacity=".6"/>` + L(y + 144, 'TOTAL', '₹4,300.00', 1, 600);
  for (let i = 0; i < 26; i++) s += `<rect class="a-y" data-o="${5.5 + i * 0.04}" x="${f(x + 14 + i * ((w - 28) / 26))}" y="${y + 158}" width="${[1, 2, 1, 3][i % 4]}" height="16" fill="${c}"/>`;
  // stamp thuds in last (outer group animates, inner keeps its rotation)
  s += grp(`<g transform="rotate(-10 ${f(x + w - 50)} ${y + 24})"><rect x="${f(x + w - 90)}" y="${y + 13}" width="78" height="22" ${BG} stroke="${c}" stroke-width="1.8"/>${T(x + w - 51, y + 28.5, 'OVERDUE', c, 8.6, 1, 'middle', 600)}</g>`, 'a-p', 7);
  return s;
};
/** Visitors & gate: a QR pass inside scan brackets, next to the gate event log. */
export const gatePass: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const n = 17, cs = 5.2, qx = 34, qy = 52, qs = n * cs;
  let d = ''; let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) { const inF = (r < 6 && q < 6) || (r < 6 && q > n - 7) || (r > n - 7 && q < 6); if (!inF && rnd() > 0.5) d += `M${f(qx + q * cs)} ${f(qy + r * cs)}h${cs}v${cs}h-${cs}Z`; }
  const finder = (fx: number, fy: number, o: number) => grp(`<rect x="${f(qx + fx * cs + cs / 2)}" y="${f(qy + fy * cs + cs / 2)}" width="${f(5 * cs)}" height="${f(5 * cs)}" stroke="${c}" stroke-width="${cs}"/><rect x="${f(qx + (fx + 2) * cs)}" y="${f(qy + (fy + 2) * cs)}" width="${f(2 * cs)}" height="${f(2 * cs)}" fill="${c}"/>`, 'a-p', o);
  s += `<rect class="a-d" x="${qx - 16}" y="${qy - 32}" width="${qs + 32}" height="${qs + 70}" ${BG} stroke="${c}"/>` + hook(T(qx - 6, qy - 16, 'VISITOR PASS', c, 7.4, 1, 'start', 500), 'a-t', 0);
  s += `<path class="a-f" data-o="2" d="${d}" fill="${c}"/>` + finder(0, 0, 1) + finder(n - 6, 0, 1.3) + finder(0, n - 6, 1.6);
  const b = 8; s += `<path class="a-p" data-o="2.5" d="M${qx - 6} ${qy - 6 + b}V${qy - 6}H${qx - 6 + b}M${qx + qs + 6 - b} ${qy - 6}H${qx + qs + 6}V${qy - 6 + b}M${qx + qs + 6} ${qy + qs + 6 - b}V${qy + qs + 6}H${qx + qs + 6 - b}M${qx - 6 + b} ${qy + qs + 6}H${qx - 6}V${qy + qs + 6 - b}" stroke="${c}" stroke-width="1.8"/>`;
  // laser scan sweeps the code continuously
  s += `<g class="a-scan" style="--scan-y:${f(qs + 8)}px;--scan-dur:2.2s"><rect x="${qx - 8}" y="${qy - 12}" width="${qs + 16}" height="8" fill="${c}" fill-opacity=".14"/><rect x="${qx - 8}" y="${qy - 4}" width="${qs + 16}" height="1.6" fill="${c}"/></g>`;
  s += every(T(qx - 6, qy + qs + 20, 'Ravi K. · A-101', c, 7.4, 0.95) + T(qx - 6, qy + qs + 32, 'valid 16:00–20:00', c, 6.8, 0.7), 'a-t', 3);
  const lx = qx + qs + 44, lw = W - lx - 18;
  s += `<rect class="a-d" data-o="1" x="${lx}" y="24" width="${lw}" height="${H - 48}" ${BG} stroke="${c}" stroke-opacity=".7"/>` + hook(T(lx + 10, 40, 'gate.log', c, 7.6, 1, 'start', 500), 'a-t', 1);
  [['12:57', 'pass.scanned', 1], ['12:57', 'visitor.approval', 1], ['12:58', 'push → A-101', 1], ['12:58', 'entry.logged', 0], ['13:40', 'exit.logged', 0]].forEach(([t, e, on], i) => {
    const y = 64 + i * 26, o = 3 + i * 0.7; s += `<circle class="a-p${i === 2 ? ' a-pulse' : ''}" data-o="${o}" cx="${lx + 13}" cy="${y - 3}" r="3" ${on ? `fill="${c}"` : `stroke="${c}" stroke-opacity=".6"`}/>` + every(T(lx + 22, y, t as string, c, 7, 0.65) + T(lx + 58, y, e as string, c, 7.6, 0.95), 'a-t', o);
  });
  return s;
};
/** Tenant isolation: a request passing session → tenant → RBAC (wall 1), then Postgres RLS (wall 2) filtering rows. */
export const rls: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.06);
  const y = 56, w1 = W - 150, w2 = W - 112, tx = W - 100, tw = 84;
  s += `<path id="rls-req" d="M56 ${y}H${tx - 6}" stroke="none"/>`;
  s += grp(`<rect x="18" y="${y - 11}" width="76" height="22" stroke="${c}" ${BG}/>` + T(56, y + 3, 'GET /dues', c, 7.2, 1, 'middle'), 'a-p', 0);
  ['session', 'tenant', 'rbac'].forEach((st, i) => { const x = 104 + i * 52; s += `<path class="a-d" data-o="${1 + i * 0.6}" d="M${x - 10} ${y}H${x}" stroke="${c}"/>` + grp(`<rect x="${x}" y="${y - 10}" width="44" height="20" ${i === 1 ? `fill="${c}"` : `stroke="${c}" ${BG}`}/>` + T(x + 22, y + 3.2, st, i === 1 ? onC(c) : c, 6.8, 1, 'middle'), 'a-p', 1.2 + i * 0.6); });
  s += `<path class="a-d" data-o="3" d="M${104 + 3 * 52 - 8} ${y}H${tx - 6}" stroke="${c}"/><path class="a-f" data-o="3" d="M${tx - 11} ${y - 4}L${tx - 5} ${y}L${tx - 11} ${y + 4}" stroke="${c}"/>`;
  s += `<rect class="a-ride" data-ride="#rls-req" data-dur="2.4" data-rest="1.2" width="6" height="6" fill="${c}"/>`;
  const wall = (x: number, label: string, o: number) => `<path class="a-yd" data-o="${o}" d="M${x} 24V${H - 20}" stroke="${c}" stroke-width="2.2"/><path class="a-f" data-o="${o}" d="M${x + 4} 24V${H - 20}" stroke="${c}" stroke-opacity=".35" stroke-dasharray="2 3"/>` + hook(T(x + 2, 18, label, c, 6.6, 0.85, 'middle'), 'a-t', o);
  s += wall(w1, 'app', 3.5) + wall(w2, 'RLS', 4);
  s += every(T(18, 96, 'SET LOCAL app.tenant_id', c, 7.2, 0.95) + T(18, 110, "  = 'green-meadows';", c, 7.2, 0.95), 'a-t', 4.5);
  s += every(T(18, H - 52, 'CREATE POLICY tenant ON dues', c, 7, 0.8) + T(18, H - 38, 'USING (society_id =', c, 7, 0.8) + T(18, H - 24, " current_setting('app.tenant_id'))", c, 7, 0.8), 'a-t', 5.5);
  s += hook(T(tx, 84, 'dues', c, 7, 0.75, 'start', 500), 'a-t', 5);
  [['green-meadows', 1], ['green-meadows', 1], ['palm-grove', 0], ['green-meadows', 1], ['lake-view', 0]].forEach(([t, on], i) => {
    const yy = 92 + i * 22; s += grp(`<rect x="${tx}" y="${yy}" width="${tw}" height="16" ${on ? `${BG} stroke="${c}"` : `fill="none" stroke="${c}" stroke-opacity=".35" stroke-dasharray="3 2"`}/>` + T(tx + 5, yy + 11.2, t as string, c, 6.2, on ? 0.95 : 0.4), on ? 'a-x' : 'a-f', 5.5 + i * 0.35);
  });
  return s;
};
