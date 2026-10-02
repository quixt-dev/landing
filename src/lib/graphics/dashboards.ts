/**
 * Faithful recreations of each product's primary screen (980×572), in the product's own
 * colours, built from the layouts in each codebase. Values shown are illustrative sample data.
 */
import { f } from './svg';
import type { ProjectSlug } from '../../data/projects';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
type TOpt = { size?: number; w?: number; fill?: string; op?: number; font?: string; anchor?: string; ls?: number };
const mk = (defFont: string) => (x: number, y: number, s: string, o: TOpt = {}) =>
  `<text x="${f(x)}" y="${f(y)}" font-family="${o.font ?? defFont}" font-size="${o.size ?? 11}" font-weight="${o.w ?? 400}" fill="${o.fill ?? '#111'}"${o.op !== undefined ? ` fill-opacity="${o.op}"` : ''}${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${esc(s)}</text>`;
const R = (x: number, y: number, w: number, h: number, fill: string, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"${extra}/>`;
const SANS = "Manrope, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Fragment Mono', 'IBM Plex Mono', monospace";

/* ------------------------------------------------------------------ Tessa */
function tessa() {
  const T = mk(SANS), G = '#216446', MINT = '#e4f3e8', L = '#f1f1f1';
  let s = R(0, 0, 980, 572, '#fff') + `<defs><linearGradient id="ts-btn" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#216446"/><stop offset="1" stop-color="#115134"/></linearGradient></defs>`;
  // sidebar
  s += R(0, 0, 190, 572, '#fafafa') + R(189, 0, 1, 572, '#ededed');
  s += `<path d="M20 20h8v8h8v8h-8v-8h-8z" fill="${G}"/><path d="M28 20h8v8h-8z" fill="${G}" fill-opacity=".45"/>` + T(44, 34, 'tessa', { size: 17, w: 700, ls: -0.4 });
  ['Home', 'Brand DNA', 'Asset Management', 'Campaigns', 'Settings'].forEach((it, i) => {
    const y = 66 + i * 34; if (!i) s += R(12, y - 4, 166, 30, MINT, ' rx="7"');
    s += R(24, y + 5, 12, 12, 'none', ` rx="3" stroke="${i ? '#7f7f7f' : G}" stroke-width="1.4"`) + T(44, y + 15.5, it, { size: 10.5, w: 500, fill: i ? '#3a3a3a' : G });
  });
  ['Support', 'Changelog', 'Invite team'].forEach((it, i) => (s += R(24, 366 + i * 26, 11, 11, 'none', ' rx="3" stroke="#9a9a9a" stroke-width="1.3"') + T(44, 376 + i * 26, it, { size: 10, w: 500, fill: '#555' })));
  s += R(12, 452, 166, 104, '#fff', ' rx="10" stroke="#ededed"') + T(24, 472, 'Credit usage', { size: 9.5, w: 600, fill: '#555' }) + T(24, 497, '42/300', { size: 17, w: 700 });
  s += R(24, 506, 142, 5, '#ededed', ' rx="2.5"') + R(24, 506, 20, 5, G, ' rx="2.5"') + R(24, 520, 142, 26, 'url(#ts-btn)', ' rx="7"') + T(95, 537, 'Buy credits', { size: 10, w: 600, fill: '#fff', anchor: 'middle' });
  // top bar
  s += T(218, 34, 'Home', { size: 10.5, fill: '#000', op: 0.5, w: 500 }) + R(190, 56, 790, 1, L);
  s += R(778, 18, 26, 26, '#fafafa', ' rx="7" stroke="#f1f1f1"') + `<path d="M786 36h10M791 22c-3 0-5 2.5-5 5.5V33h10v-5.5c0-3-2-5.5-5-5.5z" stroke="#333" stroke-width="1.2" fill="none"/>`;
  s += R(812, 18, 112, 27, 'url(#ts-btn)', ' rx="7"') + T(868, 35.5, 'Upgrade plan', { size: 10, w: 600, fill: '#fff', anchor: 'middle' }) + `<circle cx="946" cy="31.5" r="13.5" fill="#d9e8de"/>` + T(946, 35.5, 'AR', { size: 9.5, w: 700, fill: G, anchor: 'middle' });
  // greeting + button
  s += T(218, 90, 'Good Morning, Aisha', { size: 15, w: 700, ls: -0.2 }) + R(820, 72, 132, 28, '#fff', ' rx="7" stroke="#e5e5e5"') + T(886, 90, 'Download Brand PDF', { size: 9.5, w: 600, anchor: 'middle' });
  // stats
  [['128', 'Creatives created'], ['IG Post', 'Top format'], ['12', 'Campaigns created'], ['42 / 300', 'Credits used']].forEach(([v, l], i) => {
    const x = 218 + i * 186; s += R(x, 112, 174, 58, '#fafafa', ' rx="9" stroke="#f1f1f1"') + T(x + 14, 138, v, { size: 15, w: 700 }) + T(x + 14, 157, l, { size: 9.5, fill: '#000', op: 0.6, w: 500 });
  });
  // recent ads
  s += T(218, 200, 'Recent Ads', { size: 12.5, w: 700 }) + T(952, 200, 'See all', { size: 9.5, w: 600, fill: G, anchor: 'end' });
  s += R(218, 212, 170, 200, '#fff', ' rx="11" stroke="#d3d3d3" stroke-dasharray="4 3"') + `<circle cx="303" cy="278" r="16" fill="${MINT}"/><path d="M303 271v14M296 278h14" stroke="${G}" stroke-width="1.6"/>`;
  s += T(303, 312, 'New Ad', { size: 11, w: 700, anchor: 'middle' }) + T(303, 328, 'Start a campaign to create', { size: 8.5, fill: '#777', anchor: 'middle' }) + T(303, 340, 'a new ad.', { size: 8.5, fill: '#777', anchor: 'middle' }) + R(253, 356, 100, 24, 'url(#ts-btn)', ' rx="7"') + T(303, 371.5, 'Create campaign', { size: 9, w: 600, fill: '#fff', anchor: 'middle' });
  const ads: [string, string, string[], string][] = [['IG Post', '2h ago', ['#f3d9c6', '#e7b596'], 'Glow, bottled.'], ['LinkedIn Post', '5h ago', ['#dfe8e1', '#b9cfbf'], 'Ship campaigns on repeat'], ['X Post', '1d ago', ['#e9e1f2', '#cbbde0'], 'Summer drop is live']];
  ads.forEach(([fmt, t, [c1, c2], head], i) => {
    const x = 400 + i * 184, y = 212;
    s += `<defs><linearGradient id="ts-ad${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>` + R(x, y, 172, 152, `url(#ts-ad${i})`, ' rx="9"');
    s += i === 0 ? `<rect x="${x + 70}" y="${y + 50}" width="32" height="72" rx="10" fill="#fff" fill-opacity=".85"/><rect x="${x + 78}" y="${y + 40}" width="16" height="14" rx="3" fill="#8a5a3c"/>` : i === 1 ? `<rect x="${x + 20}" y="${y + 60}" width="132" height="62" rx="6" fill="#fff" fill-opacity=".8"/><path d="M${x + 30} ${y + 110}l18-18 14 10 22-24 30 20" stroke="${G}" stroke-width="2" fill="none"/>` : `<circle cx="${x + 86}" cy="${y + 84}" r="34" fill="#fff" fill-opacity=".7"/><circle cx="${x + 86}" cy="${y + 84}" r="16" fill="#8b6fb3" fill-opacity=".6"/>`;
    s += T(x + 12, y + 24, head, { size: 10.5, w: 800, fill: '#1c1c1c', ls: -0.2 }) + R(x + 12, y + 132, 54, 12, '#111', ' rx="6"') + T(x + 39, y + 141, 'Shop now', { size: 7, w: 700, fill: '#fff', anchor: 'middle' });
    s += R(x, y + 162, 12, 12, 'none', ' rx="3" stroke="#555" stroke-width="1.2"') + T(x + 18, y + 172, fmt, { size: 9.5, w: 600 }) + T(x + 172, y + 172, t, { size: 8.5, fill: '#888', anchor: 'end' });
  });
  // recent campaigns table
  s += T(218, 442, 'Recent Campaigns', { size: 12.5, w: 700 }) + R(772, 428, 104, 22, 'url(#ts-btn)', ' rx="6"') + T(824, 443, 'Create campaign', { size: 8.5, w: 600, fill: '#fff', anchor: 'middle' }) + T(952, 443, 'See all', { size: 9.5, w: 600, fill: G, anchor: 'end' });
  s += R(218, 458, 734, 102, '#fff', ' rx="9" stroke="#f1f1f1"') + R(218, 458, 734, 26, '#fafafa', ' rx="9"');
  const cols = [232, 400, 530, 670, 830];
  ['Campaign name', 'Brand', 'Generated Images', 'Formats', 'Created date'].forEach((h, i) => (s += T(cols[i], 475, h, { size: 8.5, w: 600, fill: '#777' })));
  [['Summer Glow Launch', 'Lumen Skin', '24', 'IG · FB · X', '12 Mar 2026'], ['Spring Restock', 'Lumen Skin', '12', 'IG Story · LinkedIn', '04 Mar 2026']].forEach((row, r) => {
    const y = 504 + r * 30; row.forEach((v, i) => (s += T(cols[i], y, v, { size: 9.5, w: i ? 500 : 700, fill: i ? '#444' : '#111' }))); if (!r) s += R(232, y + 12, 706, 1, L);
  });
  return s;
}

/* ------------------------------------------------------------------ Nandy */
function nandy() {
  const T = mk("'Neue Montreal', 'Helvetica Neue', Arial, sans-serif"), M = mk(MONO), E = '#0a7250', LINE = '#d7e3f0', INK = '#0b1320', MUTED = '#5a6878';
  let s = R(0, 0, 980, 572, '#eef4fb') + `<defs><linearGradient id="nd-act" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0c8a5f"/><stop offset="1" stop-color="#0a7250"/></linearGradient></defs>`;
  s += R(0, 0, 180, 572, '#fff') + R(179, 0, 1, 572, LINE);
  s += R(18, 16, 26, 26, E, ' rx="7"') + `<ellipse cx="31" cy="29" rx="12" ry="5" transform="rotate(45 31 29)" fill="#fff"/>` + T(52, 35, 'nandy', { size: 16, w: 700, fill: INK, ls: -0.3 });
  const groups: [string, string[]][] = [['OVERVIEW', ['Dashboard', 'Assistant']], ['COMMUNITY', ['Directory', 'Bookings', 'Announcements', 'Complaints']], ['FINANCE', ['Insights', 'Billing', 'Payments', 'Nandy Reconcile']], ['OPERATIONS', ['Visitors']], ['GOVERNANCE', ['Roles & Access', 'Audit Log']]];
  let y = 64;
  for (const [g, items] of groups) {
    s += M(20, y, g, { size: 7.5, fill: MUTED, ls: 0.8 }); y += 10;
    for (const it of items) {
      const on = it === 'Dashboard'; if (on) s += R(12, y, 156, 22, 'url(#nd-act)', ' rx="7"');
      s += R(22, y + 6, 10, 10, 'none', ` rx="3" stroke="${on ? '#fff' : '#6b7a8b'}" stroke-width="1.2"`) + T(40, y + 15, it, { size: 9.5, w: 500, fill: on ? '#fff' : INK });
      if (it === 'Complaints' || it === 'Payments') s += `<circle cx="160" cy="${y + 11}" r="3" fill="#12b07a"/>`;
      if (it === 'Nandy Reconcile') s += T(150, y + 15, '✦', { size: 9, fill: E });
      y += 23;
    }
    y += 8;
  }
  s += R(22, 546, 10, 10, 'none', ' rx="2" stroke="#6b7a8b"') + T(40, 555, 'Sign out', { size: 9.5, fill: MUTED });
  // top bar
  s += M(206, 34, 'GOOD MORNING', { size: 8.5, fill: MUTED, ls: 1 }) + T(206, 60, 'Priya', { size: 22, w: 600, fill: INK, ls: -0.5 });
  s += R(724, 30, 118, 28, E, ' rx="8"') + T(783, 48, '+ Raise a charge', { size: 9.5, w: 600, fill: '#fff', anchor: 'middle' });
  s += `<circle cx="866" cy="44" r="13" fill="#fff" stroke="${LINE}"/><circle cx="866" cy="44" r="4.5" stroke="${INK}" stroke-width="1.2" fill="none"/><circle cx="898" cy="44" r="13" fill="#fff" stroke="${LINE}"/><path d="M893 49h10M898 37c-2.5 0-4 2-4 4.5V47h8v-5.5c0-2.5-1.5-4.5-4-4.5z" stroke="${INK}" stroke-width="1.1" fill="none"/><circle cx="904" cy="36" r="3" fill="#12b07a"/><circle cx="936" cy="44" r="14" fill="#dff1e9"/>` + T(936, 48, 'PN', { size: 9, w: 700, fill: E, anchor: 'middle' });
  // stat cards
  const stats: [string, string, string][] = [['Outstanding dues', '₹6,800.00', '#fde8e6'], ['Collected', '₹2,500.00', '#e1f4ec'], ['Active complaints', '2', '#fdeedd'], ['Payments to verify', '1', '#e0f2f0']];
  const icc = ['#c0392b', E, '#d9772b', '#0c7a6e'];
  stats.forEach(([l, v, bg], i) => { const x = 206 + i * 188; s += R(x, 80, 176, 64, '#fff', ` rx="10" stroke="${LINE}"`) + R(x + 12, 92, 30, 30, bg, ' rx="8"') + `<circle cx="${x + 27}" cy="107" r="6" stroke="${icc[i]}" stroke-width="1.5" fill="none"/>` + T(x + 52, 102, l, { size: 9, fill: MUTED }) + T(x + 52, 124, v, { size: 16, w: 600, fill: INK, ls: -0.3 }); });
  // tool cards
  [['Nandy Reconcile', 'Upload a bank statement; Nandy matches payments.'], ['Assistant', 'Ask about dues, payments, complaints and more.'], ['Roles & Access', 'Manage who can do what across the society.'], ['Audit Log', 'Review the tamper-evident record of actions.']].forEach(([t, d], i) => {
    const x = 206 + (i % 2) * 376, y = 156 + Math.floor(i / 2) * 58; s += R(x, y, 364, 50, '#fff', ` rx="10" stroke="${LINE}"`) + R(x + 12, y + 11, 28, 28, '#e7f3ee', ' rx="8"') + T(x + 26, y + 29.5, i ? '•' : '✦', { size: 12, fill: E, anchor: 'middle' }) + T(x + 50, y + 22, t, { size: 10.5, w: 600, fill: INK }) + T(x + 50, y + 37, d, { size: 8.5, fill: MUTED }) + T(x + 348, y + 30, '→', { size: 12, fill: MUTED, anchor: 'end' });
  });
  // your dues
  s += R(206, 276, 740, 110, '#fff', ` rx="10" stroke="${LINE}"`) + M(222, 296, 'YOUR DUES', { size: 8, fill: MUTED, ls: 1 }) + T(222, 326, '₹6,800.00', { size: 24, w: 600, fill: INK, ls: -0.6 }) + T(346, 326, 'outstanding', { size: 10, fill: MUTED });
  s += R(836, 300, 96, 26, '#fff', ` rx="8" stroke="${LINE}"`) + T(884, 317, 'View all dues', { size: 9, w: 600, fill: INK, anchor: 'middle' });
  [['Monthly maintenance · A-101 · due 5 Jul', 'overdue', '#fde8e6', '#c0392b', '₹2,500.00'], ['Water charges · A-101 · due 12 Jul', 'pending', '#fdf2dc', '#b7791f', '₹800.00']].forEach(([t, b, bg, fg, amt], i) => {
    const y = 346 + i * 22; s += T(222, y, t, { size: 9.5, fill: INK }) + R(470, y - 10, 50, 14, bg, ' rx="7"') + T(495, y + 0.5, b, { size: 8, w: 600, fill: fg, anchor: 'middle' }) + M(930, y, amt, { size: 9.5, fill: INK, anchor: 'end' });
  });
  // announcements + activity
  s += R(206, 398, 364, 156, '#fff', ` rx="10" stroke="${LINE}"`) + T(222, 420, 'Recent announcements', { size: 11, w: 600, fill: INK }) + T(554, 420, 'View all →', { size: 9, w: 600, fill: E, anchor: 'end' });
  ['Quarterly maintenance schedule', 'Diwali celebration: RSVP', 'New visitor gate protocol'].forEach((t, i) => { const y = 448 + i * 34; s += T(222, y, t, { size: 9.5, w: 500, fill: INK }) + T(222, y + 13, `${i + 2} days ago`, { size: 8, fill: MUTED }) + R(478, y - 9, 76, 14, '#e7f3ee', ' rx="7"') + T(516, y + 1, 'announcement', { size: 7.5, w: 600, fill: E, anchor: 'middle' }); });
  s += R(582, 398, 364, 156, '#fff', ` rx="10" stroke="${LINE}"`) + T(598, 420, 'Activity', { size: 11, w: 600, fill: INK });
  [['payment.verified', 'unread'], ['complaint.assigned', 'unread'], ['visitor.arrived', 'read'], ['notice.published', 'read']].forEach(([e, st], i) => { const y = 446 + i * 26; s += `<circle cx="602" cy="${y - 3}" r="3.5" fill="${st === 'unread' ? '#12b07a' : '#c5d2e0'}"/>` + M(614, y, e, { size: 9, fill: INK }) + R(876, y - 10, 54, 14, st === 'unread' ? '#e1f4ec' : '#eef2f7', ' rx="7"') + T(903, y + 0.5, st, { size: 7.5, w: 600, fill: st === 'unread' ? E : MUTED, anchor: 'middle' }); });
  s += `<circle cx="946" cy="538" r="20" fill="url(#nd-act)"/>` + T(946, 543, '✦', { size: 14, fill: '#fff', anchor: 'middle' });
  return s;
}

/* ------------------------------------------------------------------ Flowgentic */
function flowgentic() {
  const T = mk("-apple-system, 'Segoe UI', Roboto, Arial, sans-serif"), TEAL = '#009688', BG = '#1A202C', NODE = '#252D3D';
  let s = R(0, 0, 980, 572, BG) + `<defs><pattern id="fg-grid" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".9" fill="#4A5568"/></pattern></defs>`;
  s += R(0, 0, 170, 572, '#171923') + R(169, 0, 1, 572, '#2D3748');
  s += `<path d="M30 14l12 7v14l-12 7-12-7V21z" fill="#77CFA5"/><path d="M24 25l6-3.5 6 3.5M24 31l6-3.5 6 3.5" stroke="#171923" stroke-width="2" fill="none"/>` + T(50, 33, 'Flowgentic', { size: 13, w: 700, fill: '#fff' });
  ['Dashboard', 'Teams', 'Skills', 'Uploads', 'User Settings', 'Admin'].forEach((it, i) => { const y = 66 + i * 34; if (i === 1) s += R(12, y - 3, 146, 28, '#4A5568', ' rx="8"'); s += R(24, y + 5, 11, 11, 'none', ` rx="3" stroke="${i === 1 ? '#fff' : '#A0AEC0'}" stroke-width="1.3"`) + T(44, y + 15, it, { size: 10.5, w: 500, fill: i === 1 ? '#fff' : '#CBD5E0' }); });
  s += `<circle cx="30" cy="544" r="11" fill="#2D3748"/>` + T(30, 548, 'DH', { size: 8, w: 700, fill: '#CBD5E0', anchor: 'middle' }) + T(48, 548, 'dhiraj@team.ai', { size: 9, fill: '#A0AEC0' });
  // header + tabs
  s += T(194, 32, 'Teams  ›  Travel Planner', { size: 9.5, fill: '#A0AEC0' }) + T(194, 60, 'Travel Planner', { size: 20, w: 700, fill: '#fff', ls: -0.3 });
  ['Build', 'Chat', 'Threads', 'Configure'].forEach((t, i) => { const x = 194 + i * 86; s += i === 0 ? R(x, 76, 82, 28, BG, ` stroke="#4A5568"`) + R(x, 102, 82, 3, BG) : ''; s += T(x + 41, 94, t, { size: 10.5, w: 600, fill: i ? '#A0AEC0' : TEAL, anchor: 'middle' }); });
  s += R(186, 104, 778, 1, '#4A5568');
  // canvas
  s += R(186, 112, 778, 448, '#171923', ' rx="6"') + R(186, 112, 778, 448, 'url(#fg-grid)', ' rx="6"');
  const bw = 156, bh = 78;
  type N = { x: number; y: number; name: string; role: string; model: string; tags?: string[]; approval?: boolean; lead?: boolean };
  const root: N = { x: 575, y: 128, name: 'TravelPlanTeamLeader', role: 'Gather inputs from your team and answer…', model: 'gpt-4o-mini', lead: true };
  const l2: N[] = [
    { x: 290, y: 258, name: 'ExecutiveAssistant', role: 'Summarise the final travel plan.', model: 'gpt-4o-mini' },
    { x: 480, y: 258, name: 'PlannerTeam', role: 'Plan activities for every traveller.', model: 'gpt-4o-mini', lead: true },
    { x: 670, y: 258, name: 'FunEngineer', role: 'Find fun things to do nearby.', model: 'gpt-4o-mini', tags: ['duckduckgo-search'] },
    { x: 860, y: 258, name: 'Critic', role: 'Critique the plan for gaps.', model: 'claude-3-haiku', approval: true },
  ];
  const l3: N[] = [
    { x: 385, y: 410, name: 'ParentActivityPlanner', role: 'Activities for adults.', model: 'gpt-4o-mini', tags: ['duckduckgo-search'] },
    { x: 575, y: 410, name: 'KidsActivityPlanner', role: 'Activities for children.', model: 'gpt-4o-mini', tags: ['duckduckgo-search'] },
    { x: 860, y: 410, name: 'WeatherChecker', role: 'Check the forecast.', model: 'llama3.1', tags: ['WeatherForecast'] },
  ];
  const edge = (a: N, b: N) => { const y1 = a.y + bh, y2 = b.y, my = (y1 + y2) / 2; return `<path d="M${a.x} ${y1 + 4}V${my}H${b.x}V${y2 - 4}" stroke="${TEAL}" stroke-width="1.6" fill="none"/>`; };
  l2.forEach((n) => (s += edge(root, n))); s += edge(l2[1], l3[0]) + edge(l2[1], l3[1]) + edge(l2[3], l3[2]);
  const node = (n: N) => {
    const x = n.x - bw / 2; let o = R(x, n.y, bw, bh, NODE, ` rx="8" stroke="${n.lead ? TEAL : '#4A5568'}"`);
    o += T(x + 10, n.y + 17, n.name, { size: 9.5, w: 700, fill: '#fff' }) + R(x + bw - 22, n.y + 7, 14, 14, 'none', ` rx="3" stroke="${TEAL}"`) + `<path d="M${x + bw - 18} ${n.y + 17}l5-5 1.5 1.5-5 5h-1.5z" fill="${TEAL}"/>`;
    o += T(x + 10, n.y + 31, n.role.length > 30 ? n.role.slice(0, 30) + '…' : n.role, { size: 7.5, fill: '#A0AEC0' });
    const mw = n.model.length * 5.2 + 10; o += R(x + 10, n.y + 40, mw, 13, '#2A4365', ' rx="4"') + T(x + 15, n.y + 49.5, n.model, { size: 7.5, w: 600, fill: '#90CDF4' });
    let tx = x + 10; (n.tags ?? []).forEach((t) => { const w = t.length * 4.7 + 10; o += R(tx, n.y + 57, w, 13, '#44337A', ' rx="4"') + T(tx + 5, n.y + 66.5, t, { size: 7.5, w: 600, fill: '#D6BCFA' }); tx += w + 4; });
    if (n.approval) o += R(x + 10, n.y + 57, 88, 13, '#7B341E', ' rx="4"') + T(x + 15, n.y + 66.5, 'Approval Required', { size: 7, w: 700, fill: '#FBD38D' });
    o += `<circle cx="${n.x}" cy="${n.y}" r="4" fill="${BG}" stroke="${TEAL}" stroke-width="1.5"/><circle cx="${n.x}" cy="${n.y + bh}" r="4" fill="${BG}" stroke="${TEAL}" stroke-width="1.5"/>`;
    return o;
  };
  [root, ...l2, ...l3].forEach((n) => (s += node(n)));
  s += R(200, 526, 176, 22, NODE, ' rx="6" stroke="#4A5568"') + T(212, 540.5, '● Hierarchical workflow', { size: 8.5, w: 600, fill: '#48BB78' });
  return s;
}

/* ------------------------------------------------------------------ Infinify */
function infinify() {
  const T = mk("'SF Pro Display', -apple-system, 'Helvetica Neue', Arial, sans-serif");
  let s = R(0, 0, 980, 572, '#fff') + `<defs>
    <radialGradient id="if-earth" cx="0.5" cy="0.1" r="0.9"><stop stop-color="#2b4a7a"/><stop offset=".35" stop-color="#0f1c33"/><stop offset="1" stop-color="#05070c"/></radialGradient>
    <radialGradient id="if-rim" cx="0.5" cy="0" r="0.6"><stop offset=".86" stop-color="#89bcff" stop-opacity="0"/><stop offset=".95" stop-color="#bcd8ff" stop-opacity=".9"/><stop offset="1" stop-color="#89bcff" stop-opacity="0"/></radialGradient>
    <linearGradient id="if-num" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff"/><stop offset="1" stop-color="#89bcff"/></linearGradient>
    <clipPath id="if-card"><rect x="6" y="6" width="968" height="560" rx="12"/></clipPath></defs>`;
  s += `<g clip-path="url(#if-card)">` + R(6, 6, 968, 560, '#050608');
  // stars
  for (let i = 0; i < 70; i++) { const x = (i * 137.5) % 968 + 6, y = ((i * 71.3) % 300) + 10; s += `<circle cx="${f(x)}" cy="${f(y)}" r="${(i % 3) * 0.35 + 0.35}" fill="#fff" fill-opacity="${0.25 + (i % 4) * 0.15}"/>`; }
  // earth from orbit
  s += `<circle cx="640" cy="1180" r="880" fill="url(#if-earth)"/><circle cx="640" cy="1180" r="880" fill="url(#if-rim)"/><circle cx="640" cy="1180" r="886" stroke="#89bcff" stroke-opacity=".45" stroke-width="2" fill="none"/>`;
  s += `<ellipse cx="760" cy="330" rx="260" ry="30" fill="#89bcff" fill-opacity=".08"/>` + R(6, 6, 968, 560, '#000', ' fill-opacity=".2"');
  // glass nav pill
  s += R(250, 22, 480, 38, '#fff', ' rx="19" fill-opacity=".14" stroke="#fff" stroke-opacity=".18"');
  s += `<path d="M272 41c0-5 4-8 8-8 6 0 9 16 16 16 4 0 8-3 8-8s-4-8-8-8c-7 0-10 16-16 16-4 0-8-3-8-8z" stroke="#fff" stroke-width="2.2" fill="none"/>`;
  ['Portfolio', 'Process', 'Pricing', 'FAQs'].forEach((l, i) => { if (i === 0) s += R(318, 30, 66, 22, '#fff', ' rx="11" fill-opacity=".14"'); s += T(351 + i * 72, 45, l, { size: 10, w: 500, fill: '#fff', anchor: 'middle' }); });
  s += R(606, 29, 92, 24, '#fff', ' rx="12"') + T(652, 45, 'Book a free call', { size: 9, w: 600, fill: '#171717', anchor: 'middle' }) + `<circle cx="712" cy="41" r="11" fill="#fff" fill-opacity=".14"/><circle cx="712" cy="41" r="5" stroke="#fff" stroke-width="1.3" fill="none"/>`;
  // badge + headline
  s += R(70, 124, 262, 26, '#fff', ' rx="13" fill-opacity=".14" stroke="#fff" stroke-opacity=".16"') + R(74, 128, 78, 18, '#fff', ' rx="9"') + T(113, 140.5, 'Design Studio', { size: 8.5, w: 600, fill: '#171717', anchor: 'middle' }) + T(160, 141, 'We make your brand look like the future', { size: 8.5, fill: '#fff', op: 0.9 });
  s += T(70, 206, 'Premium Design', { size: 46, w: 500, fill: '#fff', ls: -1 }) + T(70, 254, 'For B2B & Startups', { size: 46, w: 500, fill: '#fff', ls: -1 });
  s += T(70, 290, 'Digital experiences crafted with an obsession for detail,', { size: 11, fill: '#fff', op: 0.8 }) + T(70, 306, 'built to convert and elevate your brand', { size: 11, fill: '#fff', op: 0.8 });
  s += R(70, 326, 118, 32, '#fff', ' rx="16"') + T(129, 346, 'Book a free call', { size: 10.5, w: 600, fill: '#171717', anchor: 'middle' }) + R(198, 326, 100, 32, '#fff', ' rx="16" fill-opacity=".14" stroke="#fff" stroke-opacity=".2"') + T(248, 346, 'View Pricing', { size: 10.5, w: 600, fill: '#fff', anchor: 'middle' });
  s += T(70, 384, 'Trusted by 50+ Companies  •  100% Human made  •  10+ Years Experience', { size: 8.5, fill: '#fff', op: 0.75 });
  // revenue chip
  const cx = 660, cy = 150; s += R(cx, cy, 250, 158, '#000', ' rx="12" fill-opacity=".45" stroke="#fff" stroke-opacity=".12"');
  s += T(cx + 18, cy + 36, '$80.02K', { size: 24, w: 600, fill: 'url(#if-num)', ls: -0.5 }) + `<path d="M${cx + 190} ${cy + 22}l4-6 4 6z" fill="#70CF9E"/>` + T(cx + 202, cy + 22, '9.02%', { size: 8, w: 600, fill: '#89bcff' }) + T(cx + 232, cy + 36, 'Revenue Generated', { size: 8.5, fill: '#fff', op: 0.75, anchor: 'end' });
  const hs = [105, 85, 133, 98, 120, 76, 110], k = 0.72, base = cy + 148;
  hs.forEach((h, i) => { const x = cx + 18 + i * 32; s += R(x, base - h * k, 22, h * k, '#fffffc', ` rx="5" fill-opacity="${i >= 5 ? 1 : i === 2 ? 0.22 : 0.06}"`); });
  const mx = cx + 18 + 2 * 32 + 11; s += `<path d="M${mx} ${cy + 46}V${base}" stroke="#70CF9E" stroke-opacity=".5" stroke-dasharray="3 3"/><circle cx="${mx}" cy="${base - 133 * k}" r="4.5" fill="#fff"/><circle cx="${mx}" cy="${base - 133 * k}" r="9" stroke="#fff" stroke-opacity=".35" fill="none"/>`;
  // process card hint
  s += R(660, 330, 250, 110, '#fff', ' rx="12" fill-opacity=".06" stroke="#fff" stroke-opacity=".1"') + T(678, 358, '03 · Launch & Scale', { size: 11, w: 600, fill: '#fff' }) + T(678, 378, 'Ship fast, measure, and keep', { size: 9, fill: '#fff', op: 0.7 }) + T(678, 392, 'improving what converts.', { size: 9, fill: '#fff', op: 0.7 });
  s += `<path d="M678 420h214" stroke="#fff" stroke-opacity=".1"/><circle cx="${678 + 214 * 0.64}" cy="420" r="3" fill="#89bcff"/>`;
  s += `</g>`;
  return s;
}

export const dashboards: Record<ProjectSlug, () => string> = { tessa, nandy, flowgentic, infinify };
