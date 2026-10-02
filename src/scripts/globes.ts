/**
 * Revolving dot-globes rendered on <canvas>.
 *  - [data-globe="dot"]    Hero "globe of dots": lat/lon grid, land dots brighter, lit from upper-left + rim light.
 *  - [data-globe="client"] Contact globe: tilted Earth, great-circle arcs from Guwahati HQ with travelling
 *                          light trails, pulsing HQ rings; drag to spin (with inertia).
 * Pauses when off-screen / tab hidden; draws a single static frame for prefers-reduced-motion.
 */
import { isLand } from '../lib/graphics/landmask';

const D2R = Math.PI / 180;
// 64 brightness buckets: dots stay batched (one fill per bucket) but the steps are too fine to see,
// so nothing pops as the globe turns. Dots also fade in/out across the rim instead of switching on/off.
const LEVELS = 64;
const rim = (z: number) => { const u = Math.min(1, Math.max(0, z / 0.16)); return u * u * (3 - 2 * u); };
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const L = (() => { const v = [-0.55, 0.6, 0.58]; const l = Math.hypot(...v); return v.map((x) => x / l); })(); // screen-space light (x right, y up, z out)
const shade = (x: number, y: number, z: number) => {
  const lambert = Math.max(0, x * L[0] + y * L[1] + z * L[2]);
  return Math.min(1, 0.2 + 0.8 * Math.pow(lambert, 1.25) + 0.5 * Math.pow(1 - z, 3));
};

type Frame = (t: number, dt: number) => void;

function mount(canvas: HTMLCanvasElement, draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => void) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let w = 0, h = 0, raf = 0, running = false, last = 0, t = 0, visible = true;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!running) draw(ctx, w, h, t, 0);
  };
  const loop: Frame = (now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now; t += dt;
    draw(ctx, w, h, t, dt);
    raf = requestAnimationFrame(loop as FrameRequestCallback);
  };
  const start = () => { if (running || reduce || !visible || document.hidden) return; running = true; last = 0; raf = requestAnimationFrame(loop as FrameRequestCallback); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { rootMargin: '100px' }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  resize();
  canvas.closest('[data-globe-wrap]')?.classList.add('is-live');
  start();
}

/* ---------------------------------------------------------------- hero globe */
function dotGlobe(canvas: HTMLCanvasElement) {
  // Precompute sphere points (lat rows × lon columns) + land flags once.
  const pts: { ph: number; lon: number; land: number }[] = [];
  for (let lat = -85; lat <= 85; lat += 5) for (let lon = -180; lon < 180; lon += 4) pts.push({ ph: lat * D2R, lon: lon * D2R, land: isLand(lat, lon) });
  const cosP = pts.map((p) => Math.cos(p.ph)), sinP = pts.map((p) => Math.sin(p.ph));
  let rot = -20 * D2R; // start with Africa/Europe roughly facing
  mount(canvas, (ctx, w, h, _t, dt) => {
    rot += dt * (Math.PI * 2) / 48; // one revolution every 48 s
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h), R = s * 0.4833, cx = w / 2, cy = h / 2;
    const k = s / 240; // dot scale relative to the 240px design
    const ocean: number[][] = Array.from({ length: LEVELS + 1 }, () => []);
    const land: number[][] = Array.from({ length: LEVELS + 1 }, () => []);
    for (let i = 0; i < pts.length; i++) {
      const th = pts[i].lon + rot;
      const x = cosP[i] * Math.sin(th), y = sinP[i], z = cosP[i] * Math.cos(th);
      if (z <= 0) continue;
      const lv = Math.round(shade(x, y, z) * rim(z) * LEVELS);
      if (lv < 1) continue;
      (pts[i].land ? land : ocean)[lv].push(cx + R * x, cy - R * y); // north up
    }
    ctx.fillStyle = '#fff';
    for (let lv = 1; lv <= LEVELS; lv++) {
      const b = lv / LEVELS;
      for (const [set, alpha, rad] of [[ocean[lv], (0.12 + b * 0.3) * Math.min(1, b * 6), (0.45 + 0.4 * b) * k], [land[lv], Math.min(1, 0.45 + b * 0.75) * Math.min(1, b * 6), (1.05 + 0.75 * b) * k]] as const) {
        if (!set.length) continue;
        ctx.globalAlpha = alpha; ctx.beginPath();
        for (let j = 0; j < set.length; j += 2) { ctx.moveTo(set[j] + rad, set[j + 1]); ctx.arc(set[j], set[j + 1], rad, 0, Math.PI * 2); }
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  });
}

/* -------------------------------------------------------------- client globe */
function clientGlobe(canvas: HTMLCanvasElement) {
  const hq: [number, number] = [26.12, 91.8];
  const cities: [number, number][] = [[51.5, -0.12], [52.5, 13.4], [25.2, 55.3], [-1.3, 36.8], [1.35, 103.8], [35.7, 139.7], [-33.9, 151.2], [55.8, 37.6], [-26.2, 28.0]];
  const vec = (lat: number, lon: number) => { const p = lat * D2R, l = lon * D2R; return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)]; };
  const A = vec(...hq);
  // Precompute each arc as lat/lon samples (great-circle slerp) + lift profile.
  const arcs = cities.map((c) => {
    const B = vec(...c); const om = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
    const N = 72, s: [number, number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, k1 = Math.sin((1 - t) * om) / Math.sin(om), k2 = Math.sin(t * om) / Math.sin(om);
      const u = [k1 * A[0] + k2 * B[0], k1 * A[1] + k2 * B[1], k1 * A[2] + k2 * B[2]];
      s.push([Math.asin(u[2]) / D2R, Math.atan2(u[1], u[0]) / D2R, 1 + 0.16 * Math.sin(Math.PI * t) * Math.min(1, om)]);
    }
    return { s, city: c, speed: 0.16 + (om / Math.PI) * 0.08, phase: Math.random() };
  });
  // Evenly spaced dot field (step grows toward the poles).
  const pts: { lat: number; lon: number; land: number }[] = [];
  for (let lat = -80; lat <= 80; lat += 4) {
    const step = 3.4 / Math.max(0.2, Math.cos(lat * D2R)); const off = (lat / 4) % 2 ? step / 2 : 0;
    for (let lon = -180 + off; lon < 180; lon += step) pts.push({ lat, lon, land: isLand(lat, lon) });
  }
  const p0 = 22 * D2R, cp0 = Math.cos(p0), sp0 = Math.sin(p0);
  // Cinematic sway around India (keeps the HQ + flight paths in view); drag to spin freely,
  // momentum decays and the globe glides back.
  let lam0 = 84, offset = 0, vel = 0;
  // Drag to spin
  let dragging = false, lastX = 0, lastT = 0;
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastT = performance.now(); canvas.setPointerCapture(e.pointerId); canvas.classList.add('is-dragging'); });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return; const now = performance.now(); const dx = e.clientX - lastX;
    const deg = -dx * 0.35; offset += deg; vel = (deg / Math.max(1, now - lastT)) * 1000; lastX = e.clientX; lastT = now;
  });
  const end = () => { dragging = false; canvas.classList.remove('is-dragging'); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);

  mount(canvas, (ctx, w, h, t, dt) => {
    if (!dragging) {
      offset += vel * dt; vel *= Math.exp(-dt * 1.8);
      if (Math.abs(vel) < 25) { offset = ((((offset + 180) % 360) + 360) % 360) - 180; offset += -offset * Math.min(1, dt * 0.9); }
    }
    lam0 = 84 + 34 * Math.sin((t * Math.PI * 2) / 46) + offset;
    const l0 = lam0 * D2R, cl0 = Math.cos(l0), sl0 = Math.sin(l0);
    const k = w / 580, cx = w / 2, cy = h * (300 / 540), R = 205 * k;
    const proj = (lat: number, lon: number) => {
      const p = lat * D2R, l = lon * D2R, cp = Math.cos(p), sp = Math.sin(p), cl = Math.cos(l) * cl0 + Math.sin(l) * sl0, sl = Math.sin(l) * cl0 - Math.cos(l) * sl0;
      return [cp * sl, cp0 * sp - sp0 * cp * cl, sp0 * sp + cp0 * cp * cl];
    };
    ctx.clearRect(0, 0, w, h);
    // atmosphere glow
    const g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.18);
    g.addColorStop(0, 'rgba(255,255,255,0.10)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2); ctx.fill();
    // dots
    const ocean: number[][] = Array.from({ length: LEVELS + 1 }, () => []), land: number[][] = Array.from({ length: LEVELS + 1 }, () => []);
    for (const p of pts) {
      const [x, y, z] = proj(p.lat, p.lon); if (z <= 0) continue;
      const lv = Math.round(shade(x, y, z) * rim(z) * LEVELS);
      if (lv < 1) continue;
      (p.land ? land : ocean)[lv].push(cx + R * x, cy - R * y);
    }
    ctx.fillStyle = '#fff';
    for (let lv = 1; lv <= LEVELS; lv++) {
      const b = lv / LEVELS;
      for (const [set, alpha, rad] of [[ocean[lv], (0.08 + b * 0.26) * Math.min(1, b * 6), (0.5 + 0.4 * b) * k], [land[lv], Math.min(1, 0.4 + b * 0.8) * Math.min(1, b * 6), (1 + 0.8 * b) * k]] as const) {
        if (!set.length) continue; ctx.globalAlpha = alpha; ctx.beginPath();
        for (let j = 0; j < set.length; j += 2) { ctx.moveTo(set[j] + rad, set[j + 1]); ctx.arc(set[j], set[j + 1], rad, 0, Math.PI * 2); }
        ctx.fill();
      }
    }
    // arcs + travelling light trails
    ctx.lineCap = 'round';
    for (const a of arcs) {
      const scr = a.s.map(([la, lo, lift]) => { const [x, y, z] = proj(la, lo); return [cx + R * x * lift, cy - R * y * lift, z] as const; });
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1 * k + 0.3;
      for (let i = 0; i < scr.length - 1; i++) {
        const [x1, y1, z1] = scr[i], [x2, y2, z2] = scr[i + 1]; const z = Math.min(z1, z2); if (z < 0.04) continue;
        ctx.globalAlpha = 0.5 * Math.min(1, z * 4); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      const cyc = ((t * a.speed + a.phase) % 1.35); // 0..1 travel, then short rest
      if (cyc <= 1 && !reduce) {
        // the head moves continuously along the arc (interpolated between samples); the trail is 16 samples long
        const at = (f: number) => { const n = scr.length - 1, c = Math.min(n, Math.max(0, f)), i = Math.min(n - 1, Math.floor(c)), u = c - i, A2 = scr[i], B2 = scr[i + 1];
          return [A2[0] + (B2[0] - A2[0]) * u, A2[1] + (B2[1] - A2[1]) * u, A2[2] + (B2[2] - A2[2]) * u] as const; };
        const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);   // eased travel: glides off and lands
        const headF = ease(cyc) * (scr.length - 1), LEN = 16, STEPS = 24;
        ctx.lineWidth = 2.4 * k;
        for (let j = 0; j < STEPS; j++) {
          const f1 = headF - LEN + (LEN * j) / STEPS, f2 = headF - LEN + (LEN * (j + 1)) / STEPS;
          if (f2 <= 0) continue;
          const p1 = at(f1), p2 = at(f2); const zz = Math.min(p1[2], p2[2]); if (zz < 0.02) continue;
          ctx.globalAlpha = ((j + 1) / STEPS) ** 1.6 * Math.min(1, zz * 4); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
        }
        const [hx, hy, hz] = at(headF);
        if (hz > 0.02) { ctx.globalAlpha = Math.min(1, hz * 4); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hx, hy, 2.6 * k, 0, Math.PI * 2); ctx.fill(); }
      }
      const [ex, ey, ez] = scr[scr.length - 1];
      if (ez > 0.02) { ctx.globalAlpha = Math.min(1, ez * 4); ctx.fillStyle = '#AB4200'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; const s = 7 * k; ctx.fillRect(ex - s / 2, ey - s / 2, s, s); ctx.strokeRect(ex - s / 2, ey - s / 2, s, s); }
    }
    // HQ pulse
    const [hx, hy, hz] = proj(...hq);
    if (hz > 0) {
      const X = cx + R * hx, Y = cy - R * hy, fade = Math.min(1, hz * 4);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2;
      for (let i = 0; i < 2; i++) { const p = reduce ? 0.5 : ((t / 2.4 + i / 2) % 1); ctx.globalAlpha = (1 - p) * 0.7 * fade; ctx.beginPath(); ctx.arc(X, Y, (8 + p * 30) * k, 0, Math.PI * 2); ctx.stroke(); }
      ctx.globalAlpha = fade; ctx.fillStyle = '#fff'; const s = 12 * k; ctx.fillRect(X - s / 2, Y - s / 2, s, s); ctx.fillStyle = '#AB4200'; ctx.fillRect(X - 2 * k, Y - 2 * k, 4 * k, 4 * k);
    }
    ctx.globalAlpha = 1;
  });
}

document.querySelectorAll<HTMLCanvasElement>('canvas[data-globe]').forEach((c) => (c.dataset.globe === 'client' ? clientGlobe(c) : dotGlobe(c)));
