import type { CaseStudy } from '../../data/projects';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/**
 * System architecture diagram (1142×480) generated from case-study data.
 * Column x positions/widths match the Figma blueprint; connectors are derived.
 */
export function architecture(arch: CaseStudy['architecture']) {
  const X = [0, 320, 640, 952], W = [230, 230, 240, 190], step = 90, h = 72;
  const counts = arch.columns.map((c) => c.nodes.length);
  const maxH = Math.max(...counts) * step - 18;
  const top = (n: number) => 38 + (maxH - (n * step - 18)) / 2;
  const nodeY = (col: number, i: number) => top(counts[col]) + i * step;
  const mid = (col: number, i: number) => nodeY(col, i) + h / 2;
  let solid = '', dash = '', heads = '';
  const arrow = (x: number, y: number) => (heads += `M${x - 7} ${y - 4}L${x} ${y}L${x - 7} ${y + 4}Z`);
  // clients → gateway (bus)
  const gw = mid(1, 0), busA = X[0] + W[0] + 45;
  for (let i = 0; i < counts[0]; i++) solid += `M${X[0] + W[0]} ${mid(0, i)}H${busA}`;
  solid += `M${busA} ${mid(0, 0)}V${mid(0, counts[0] - 1)}M${busA} ${gw}H${X[1]}`; arrow(X[1], gw);
  // gateway → auth
  if (counts[1] > 1) solid += `M${X[1] + W[1] / 2} ${nodeY(1, 0) + h}V${nodeY(1, 1)}`;
  // gateway → services (bus)
  const busB = X[1] + W[1] + 45;
  solid += `M${X[1] + W[1]} ${gw}H${busB}M${busB} ${mid(2, 0)}V${mid(2, counts[2] - 1)}`;
  for (let i = 0; i < counts[2]; i++) { solid += `M${busB} ${mid(2, i)}H${X[2]}`; arrow(X[2], mid(2, i)); }
  // services → data: [service, data, async]
  const links = arch.links;
  links.forEach(([sv, dt, async], k) => {
    const cx = X[2] + W[2] + 16 + k * 7;
    const p = `M${X[2] + W[2]} ${mid(2, sv)}H${cx}V${mid(3, dt)}H${X[3]}`;
    if (async) dash += p; else solid += p;
    arrow(X[3], mid(3, dt));
  });
  // Split solid connectors into separate paths so each can be drawn + carry a travelling packet.
  const segs = solid.split('M').filter(Boolean).map((p) => 'M' + p);
  let s = segs.map((p) => `<path d="${p}" stroke="#fff" stroke-opacity=".75" stroke-width="1.4" data-draw-path/>`).join('');
  s += `<path class="arch-async" d="${dash}" stroke="#fff" stroke-width="1.4" stroke-dasharray="5 4"/><path d="${heads}" fill="#fff" data-fade/>`;
  // Packets flow client → gateway → services → data along the longer routes.
  const routes = segs.filter((p) => (p.match(/[HV]/g) || []).length >= 2);
  routes.forEach((p, i) => { s += `<rect width="5" height="5" x="-2.5" y="-2.5" fill="#fff" class="packet"><animateMotion dur="${(2.4 + (i % 3) * 0.5).toFixed(1)}s" begin="${(i * 0.37).toFixed(2)}s" repeatCount="indefinite" path="${p}" /></rect>`; });
  arch.columns.forEach((col, c) => {
    s += `<text x="${X[c]}" y="12" font-family="IBM Plex Mono, monospace" font-size="12.5" font-weight="500" fill="#F8E6DA">${String(c + 1).padStart(2, '0')} · ${esc(col.label)}</text><rect x="${X[c]}" y="24" width="${W[c]}" height="1" fill="#fff" fill-opacity=".3"/>`;
    col.nodes.forEach((n, i) => {
      const y = nodeY(c, i), hot = n.highlight, tc = hot ? '#AB4200' : '#fff';
      s += `<g data-node><rect x="${X[c] + 0.5}" y="${y + 0.5}" width="${W[c] - 1}" height="${h - 1}" fill="${hot ? '#fff' : 'rgba(255,255,255,.07)'}" stroke="#fff" stroke-opacity="${hot ? 1 : 0.45}"/>`;
      s += `<rect x="${X[c] + W[c] - 16}" y="${y + 12}" width="6" height="6" fill="${hot ? '#AB4200' : '#fff'}"/>`;
      s += `<text x="${X[c] + 16}" y="${y + 30}" font-family="Roboto Mono, monospace" font-size="16" fill="${tc}">${esc(n.title)}</text>`;
      s += `<text x="${X[c] + 16}" y="${y + 54}" font-family="IBM Plex Mono, monospace" font-size="11.5" fill="${tc}" fill-opacity=".85">${esc(n.sub)}</text></g>`;
    });
  });
  return { svg: s, width: 1142, height: 38 + maxH + 10 };
}
