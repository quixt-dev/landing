import { circ, f, norm } from './svg';

const LEVELS = 12;
const shade = (x: number, y: number, z: number, L: number[]) => {
  const lambert = Math.max(0, x * L[0] + y * L[1] + z * L[2]);
  const rim = Math.pow(1 - z, 3);
  return Math.min(1, 0.2 + 0.8 * Math.pow(lambert, 1.25) + 0.5 * rim);
};
const flush = (groups: string[][], color = '#fff') =>
  groups.map((d, i) => (d.length ? `<path d="${d.join('')}" fill="${color}" fill-opacity="${f(i / LEVELS)}"/>` : '')).join('');

/**
 * Hero "globe of dots": an orthographic latitude/longitude grid. Dots crowd and merge
 * at the poles and limb, stay sparse at the centre, and are lit from the upper-left
 * (plus a rim light) to read as a 3D sphere.
 */
export function dotGlobe(size = 240) {
  const R = size * 0.4833, c = size / 2, L = norm([-0.55, -0.6, 0.58]);
  const g: string[][] = Array.from({ length: LEVELS + 1 }, () => []);
  for (let lat = -85; lat <= 85; lat += 5) {
    const ph = (lat * Math.PI) / 180;
    for (let lon = -90; lon <= 90; lon += 4) {
      const th = (lon * Math.PI) / 180;
      const x = Math.cos(ph) * Math.sin(th), y = Math.sin(ph), z = Math.cos(ph) * Math.cos(th);
      if (z < -0.001) continue;
      const lv = Math.max(1, Math.round(shade(x, y, z, L) * LEVELS));
      g[lv].push(circ(c + R * x, c + R * y, 0.7 + 0.75 * (lv / LEVELS), 1));
    }
  }
  return flush(g);
}

/**
 * Contact-page globe: evenly spaced dots on a tilted sphere centred near India,
 * with great-circle arcs from the Guwahati HQ to client cities.
 */
export function clientGlobe(cx = 290, cy = 300, R = 205, phi0 = 22, lam0 = 84) {
  const d2r = Math.PI / 180, p0 = phi0 * d2r, l0 = lam0 * d2r, L = norm([-0.55, 0.6, 0.58]);
  const proj = (lat: number, lon: number): [number, number, number] => {
    const p = lat * d2r, l = lon * d2r - l0;
    return [
      Math.cos(p) * Math.sin(l),
      Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l),
      Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l),
    ];
  };
  const g: string[][] = Array.from({ length: LEVELS + 1 }, () => []);
  for (let lat = -80; lat <= 80; lat += 5) {
    const step = 4 / Math.max(0.2, Math.cos(lat * d2r));
    const off = (lat / 5) % 2 ? step / 2 : 0;
    for (let lon = -180 + off; lon < 180; lon += step) {
      const [x, y, z] = proj(lat, lon);
      if (z < 0) continue;
      const lv = Math.max(1, Math.round(shade(x, y, z, L) * LEVELS));
      g[lv].push(circ(cx + R * x, cy - R * y, 0.75 + 0.85 * (lv / LEVELS), 1));
    }
  }
  let s = flush(g);
  const hq: [number, number] = [26.14, 91.74];
  const cities: [number, number][] = [[51.5, -0.12], [52.5, 13.4], [25.2, 55.3], [-1.3, 36.8], [1.35, 103.8], [35.7, 139.7]];
  const vec = (lat: number, lon: number) => { const p = lat * d2r, l = lon * d2r; return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)]; };
  const toLL = (u: number[]): [number, number] => [Math.asin(u[2]) / d2r, Math.atan2(u[1], u[0]) / d2r];
  const A = vec(...hq);
  let arcs = '', ends = '';
  for (const city of cities) {
    const B = vec(...city);
    const om = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
    let d = '', pen = false;
    for (let i = 0; i <= 64; i++) {
      const t = i / 64, k1 = Math.sin((1 - t) * om) / Math.sin(om), k2 = Math.sin(t * om) / Math.sin(om);
      let [x, y, z] = proj(...toLL([k1 * A[0] + k2 * B[0], k1 * A[1] + k2 * B[1], k1 * A[2] + k2 * B[2]]));
      const lift = 1 + 0.32 * Math.sin(Math.PI * t) * Math.min(1, om);
      x *= lift; y *= lift;
      if (z < 0) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + f(cx + R * x) + ' ' + f(cy - R * y); pen = true;
    }
    arcs += d;
    const [x, y, z] = proj(...city);
    if (z > 0) ends += `<rect x="${f(cx + R * x - 3.5)}" y="${f(cy - R * y - 3.5)}" width="7" height="7" fill="#AB4200" stroke="#fff" stroke-width="1.5"/>`;
  }
  const [hx, hy] = proj(...hq); const X = cx + R * hx, Y = cy - R * hy;
  s += `<path d="${arcs}" stroke="#fff" stroke-width="1.3" stroke-opacity=".9"/>${ends}`;
  s += `<circle cx="${f(X)}" cy="${f(Y)}" r="28" stroke="#fff" stroke-opacity=".25"/><circle cx="${f(X)}" cy="${f(Y)}" r="16" stroke="#fff" stroke-opacity=".55"/><rect x="${f(X - 6)}" y="${f(Y - 6)}" width="12" height="12" fill="#fff"/><rect x="${f(X - 2)}" y="${f(Y - 2)}" width="4" height="4" fill="#AB4200"/>`;
  return s;
}
