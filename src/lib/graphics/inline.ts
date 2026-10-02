import { circ, f, polar } from './svg';

/** Hero "team" card: concentric orbits, gradient sweep and avatar anchor points. */
export const orbitPositions: [number, number][] = [[169, 34], [132, 101], [218, 122], [86, 160], [159, 172], [240, 196], [132, 257]];
export function orbit() {
  const cx = 169, cy = 148;
  const [x1, y1] = polar(cx, cy, 115, 14.3);
  let s = `<defs><linearGradient id="orbit-sweep" x1="${cx}" y1="${cy - 115}" x2="${cx + 115}" y2="${cy}" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient></defs>`;
  s += `<g class="orbit-sweep"><path d="M${cx} ${cy}V${cy - 115}A115 115 0 0 1 ${f(x1)} ${f(y1)}Z" fill="url(#orbit-sweep)"/><path d="M${cx} ${cy}V${cy - 115}" stroke="#fff" stroke-opacity=".8"/></g>`;
  for (const [r, w, o] of [[115, 2, 1], [84, 1.5, 0.9], [52, 1.5, 0.9]] as const)
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}"/>`;
  s += `<g class="orbit-core"><circle cx="${cx}" cy="${cy}" r="20" stroke="#fff" stroke-opacity=".5" stroke-dasharray="2 3"/></g>`;
  s += `<path d="M${cx - 115} ${cy}H${cx + 115}" stroke="#fff" stroke-opacity=".15" stroke-width=".8"/><circle cx="${cx}" cy="${cy}" r="2" fill="#fff"/>`;
  return s;
}

/** Fading dot grid for the top-right corner of pricing cards; animated by PricingCard's CSS. */
export function cornerDots() {
  let s = '';
  for (let gx = 0; gx < 13; gx++) for (let gy = 0; gy < 11; gy++) {
    const x = 176 - gx * 14 - 4, y = gy * 14 + 6, dist = Math.hypot(gx, gy) / 14;
    const op = Math.max(0, 0.85 - dist * 1.1) * (0.5 + 0.5 * ((gx + gy) % 2));
    // --o is the resting opacity (also the static fallback), --d staggers a wave that radiates out from the corner
    if (op > 0.05) s += `<rect x="${x}" y="${y}" width="2.4" height="2.4" fill="#fff" opacity="${f(op)}" style="--o:${f(op)};--d:${f(dist * 1.9)}s"/>`;
  }
  return s;
}

/** ECG trace (repeating beats) for vitals widgets. */
export function ecgPath(beats: number, period: number, base: number, amp = 1, startX = 0) {
  let e = `M${startX} ${base}`;
  for (let b = 0; b < beats; b++) {
    const o = startX + b * period, k = period / 74;
    const X = (v: number) => f(o + v * k), Y = (v: number) => f(base + (v - 40) * amp);
    e += `H${X(14)}C${X(17)} ${Y(40)} ${X(18)} ${Y(33)} ${X(22)} ${Y(33)}S${X(26)} ${Y(40)} ${X(28)} ${Y(40)}H${X(32)}L${X(35)} ${Y(46)}L${X(39)} ${Y(6)}L${X(43)} ${Y(58)}L${X(46)} ${Y(40)}H${X(54)}C${X(58)} ${Y(40)} ${X(60)} ${Y(28)} ${X(65)} ${Y(28)}S${X(71)} ${Y(40)} ${X(74)} ${Y(40)}`;
  }
  return e;
}

/** Smooth Catmull-Rom line through points, as cubic Béziers. */
export function smoothLine(pts: [number, number][]) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}


export { circ };
