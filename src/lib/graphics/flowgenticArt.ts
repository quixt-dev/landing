/**
 * Flowgentic — developer / blueprint-styled graphics. Every label is a real identifier from the repo:
 * node types, build.py graph calls, the skill-definition schema, the RAG pipeline (chunk_size 500,
 * BAAI/bge-small-en-v1.5), InterruptDecision values and the ChatResponse SSE payload.
 */
import { f } from './svg';
import { T, BG, grid, corners, onC, iso, planeTop, NS, hook, grp, every, type Art, type Pt } from './blueprint';

/* ---------------------------------------------------------------- signature (card + backdrop) */
/**
 * Isometric exploded view of one team at three levels of the stack: the React Flow canvas you draw,
 * the LangGraph StateGraph it compiles to, and the Postgres checkpointer that persists each thread.
 * Nodes share local coordinates across plates, so dashed guides drop straight through the layers.
 */
export const flowgenticSignature: Art = (W, H, c) => {
  const k = W / 524, s = 0.7 * k, pw = 180, ph = 120;
  let out = grid(W, H, c, 16 * k, 0.05) + corners(W, H, c, 14 * k, 5 * k);
  const root: [number, number] = [90, 18];
  const kids: [number, number][] = [[30, 60], [70, 60], [110, 60], [150, 60]];
  const grand: [number, number][] = [[52, 100], [88, 100], [150, 100]];
  const parentOf = [1, 1, 3];
  const cx = W * 0.36, gap = 64 * k, topY = H * 0.08;
  const O = (i: number): Pt => [cx - ((pw - ph) / 2) * 0.866 * s, topY + i * gap];
  const step = (a: [number, number], b: [number, number], ya: number, yb: number) => { const my = (ya + yb) / 2; return `M${a[0]} ${ya}V${my}H${b[0]}V${yb}`; };
  // guides first (behind plates)
  let guides = '';
  for (const p of [root, kids[3], grand[2]]) { const [x0, y0] = iso(O(0), s, p[0], p[1]); const [, y2] = iso(O(2), s, p[0], p[1]); guides += `<g class="a-guide" data-gap="${f(gap)}"><path class="a-d a-flow" data-o="4" d="M${f(x0)} ${f(y0)}V${f(y2)}" stroke="${c}" stroke-opacity=".3" stroke-dasharray="${f(2 * k)} ${f(3 * k)}"/></g>`; }
  // bottom → top so upper plates overlap lower ones
  const plates: string[] = [];
  // 2 · checkpointer
  {
    let b = `<rect width="${pw}" height="${ph}" ${BG} stroke="${c}" stroke-width="1.3"${NS}/>`;
    for (let i = 0; i < 6; i++) { const y = 10 + i * 17; b += `<rect x="10" y="${y}" width="${pw - 20}" height="11" ${i === 0 ? `fill="${c}" fill-opacity=".85"` : `stroke="${c}" stroke-opacity=".45"${NS}`}/>`; b += `<rect x="16" y="${y + 4}" width="${[40, 60, 34, 52, 46, 38][i]}" height="3" fill="${i === 0 ? onC(c) : c}" fill-opacity="${i === 0 ? 1 : 0.5}"/>`; }
    plates[2] = b;
  }
  // 1 · StateGraph
  {
    let b = `<rect width="${pw}" height="${ph}" ${BG} stroke="${c}" stroke-width="1.3"${NS}/>`;
    const e = (a: [number, number], z: [number, number], dash = false) => `<path d="M${a[0]} ${a[1]}L${z[0]} ${z[1]}" stroke="${c}" stroke-opacity=".75"${dash ? ' stroke-dasharray="3 3"' : ''}${NS}/>`;
    b += e([14, 18], root) + e(root, [166, 18], true);
    kids.forEach((q) => (b += e(root, q)));
    grand.forEach((g, i) => (b += e(kids[parentOf[i]], g)));
    b += `<circle cx="126" cy="60" r="7" stroke="${c}" stroke-dasharray="2 2"${NS}/>`; // tool loop on FunEngineer
    [[14, 18], [166, 18]].forEach(([x, y]) => (b += `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${c}"/>`));
    [root, ...kids, ...grand].forEach(([x, y], i) => (b += `<circle cx="${x}" cy="${y}" r="${i === 0 ? 6 : 4.5}" ${i === 0 || i === 2 ? `fill="${c}"` : `${BG} stroke="${c}"${NS}`}/>`));
    plates[1] = b;
  }
  // 0 · canvas
  {
    let b = `<rect width="${pw}" height="${ph}" ${BG} stroke="${c}" stroke-width="1.3"${NS}/>`;
    let dots = ''; for (let x = 10; x < pw; x += 10) for (let y = 10; y < ph; y += 10) dots += `M${x} ${y}h.8`;
    b += `<path d="${dots}" stroke="${c}" stroke-opacity=".35" stroke-width="1.6"${NS}/>`;
    let edges = kids.map((q) => step(root, q, root[1] + 7, q[1] - 7)).join('') + grand.map((g, i) => step(kids[parentOf[i]], g, kids[parentOf[i]][1] + 7, g[1] - 7)).join('');
    b += `<path class="a-flow" d="${edges}" stroke="${c}" stroke-width="1.2"${NS}/>`;
    const card = ([x, y]: [number, number], w: number, hot = false) => `<rect x="${x - w / 2}" y="${y - 7}" width="${w}" height="14" ${hot ? `fill="${c}"` : `${BG} stroke="${c}"${NS}`}/><rect x="${x - w / 2 + 3}" y="${y - 3}" width="${w * 0.5}" height="2.4" fill="${hot ? onC(c) : c}"/><rect x="${x - w / 2 + 3}" y="${y + 1.5}" width="${w * 0.3}" height="2" fill="${hot ? onC(c) : c}" fill-opacity=".55"/>`;
    b += card(root, 40, true) + kids.map((q) => card(q, 30)).join('') + grand.map((g) => card(g, 30)).join('');
    plates[0] = b;
  }
  out += guides;
  // labels on the right, leader lines from each plate's right corner
  const names: [string, string][] = [['canvas', 'react-flow · 8 members'], ['StateGraph', 'langgraph · hierarchical'], ['checkpointer', 'postgres · threads']];
  const lx = W * 0.7;
  // each plate + leader + label is one layer: drops in bottom-up, spreads apart on hover (top lifts most)
  for (let i = 2; i >= 0; i--) {
    const [a, b] = names[i], [rx, ry] = iso(O(i), s, pw, 0);
    const leader = `<path d="M${f(rx + 3 * k)} ${f(ry)}H${f(lx - 6 * k)}" stroke="${c}" stroke-opacity=".55"/><circle cx="${f(rx + 3 * k)}" cy="${f(ry)}" r="${f(2 * k)}" fill="${c}"/>` + T(lx, ry - 1.5 * k, a, c, 8.4 * k, 1, 'start', 500) + T(lx, ry + 9 * k, b, c, 7 * k, 0.65);
    out += `<g class="a-layer" data-i="${2 - i}"><g transform="${planeTop(O(i), s)}">${plates[i]}</g>${leader}</g>`;
  }
  out += hook(T(22 * k, H - 22 * k, '// draw → compile() → stream', c, 7.5 * k, 0.75), 'a-t', 5) + hook(T(W - 22 * k, H - 22 * k, 'MIT · self-hosted', c, 7.5 * k, 0.65, 'end'), 'a-t', 5.5);
  return out;
};

/* ---------------------------------------------------------------- bento */
/** Team builder: the canvas on the left compiles into the LangGraph calls on the right. */
export const compileView: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.06);
  const px = 20, py = 20, pw = 300, ph = H - 40;
  s += every(`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" ${BG} stroke="${c}"/><path d="M${px} ${py + 18}H${px + pw}" stroke="${c}" stroke-opacity=".5"/>` + T(px + 8, py + 12.5, 'Build', c, 7.4, 1, 'start', 500) + T(px + 44, py + 12.5, 'Chat', c, 7.4, 0.55) + T(px + 76, py + 12.5, 'Threads', c, 7.4, 0.55) + T(px + pw - 8, py + 12.5, 'hierarchical', c, 7, 0.7, 'end'), 'a-d', 0);
  let dots = ''; for (let x = px + 10; x < px + pw; x += 12) for (let y = py + 28; y < py + ph; y += 12) dots += `M${x} ${y}h.8`;
  s += every(`<path d="${dots}" stroke="${c}" stroke-opacity=".3" stroke-width="1.4"/>`, 'a-f', 0);
  const cw = 58, chh = 22;
  const N: Record<string, [number, number]> = { Leader: [170, 58], Assistant: [60, 112], Planner: [130, 112], Fun: [205, 112], Critic: [276, 112], Parents: [96, 170], Kids: [160, 170], Weather: [276, 170] };
  const E: [string, string][] = [['Leader', 'Assistant'], ['Leader', 'Planner'], ['Leader', 'Fun'], ['Leader', 'Critic'], ['Planner', 'Parents'], ['Planner', 'Kids'], ['Critic', 'Weather']];
  let ed = ''; E.forEach(([a, b]) => { const [ax, ay] = N[a], [bx, by] = N[b]; const y1 = ay + chh / 2, y2 = by - chh / 2, my = (y1 + y2) / 2; ed += `M${ax} ${y1}V${my}H${bx}V${y2}`; });
  s += every(`<path d="${ed}" stroke="${c}" stroke-width="1.3"/>`, 'a-d a-flow', 2);
  Object.entries(N).forEach(([n, [x, y]], ni) => { const hot = n === 'Leader' || n === 'Planner'; s += grp(`<rect x="${x - cw / 2}" y="${y - chh / 2}" width="${cw}" height="${chh}" ${hot ? `fill="${c}"` : `${BG} stroke="${c}"`}/>` + T(x - cw / 2 + 5, y + 3, n, hot ? onC(c) : c, 6.8, 1) + `<circle cx="${x}" cy="${y - chh / 2}" r="2" ${BG} stroke="${c}"/><circle cx="${x}" cy="${y + chh / 2}" r="2" ${BG} stroke="${c}"/>`, 'a-p', 1 + (y > 150 ? 0.9 : y > 90 ? 0.45 : 0) + ni * 0.05); });
  // compile arrow
  const ax1 = px + pw + 12, ax2 = 398;
  s += every(`<path d="M${ax1} ${H / 2}H${ax2 - 6}" stroke="${c}" stroke-width="1.3"/><path d="M${ax2 - 12} ${H / 2 - 4}L${ax2 - 6} ${H / 2}L${ax2 - 12} ${H / 2 + 4}" stroke="${c}"/>` + T((ax1 + ax2) / 2, H / 2 - 8, 'compile', c, 7, 0.85, 'middle'), 'a-d', 3);
  // code panel
  const cx = 404, cwid = W - cx - 20;
  s += every(`<rect x="${cx}" y="${py}" width="${cwid}" height="${ph}" ${BG} stroke="${c}"/><path d="M${cx} ${py + 18}H${cx + cwid}" stroke="${c}" stroke-opacity=".5"/>` + T(cx + 8, py + 12.5, 'core/graph/build.py', c, 7.4, 1, 'start', 500) + T(cx + cwid - 8, py + 12.5, 'python', c, 7, 0.7, 'end'), 'a-d', 3);
  const lines = ['graph = StateGraph(TeamState)', 'graph.add_node("TravelPlanTeamLeader", LeaderNode(...))', 'graph.add_node("PlannerTeam", create_hierarchical_graph(...))', 'graph.add_edge(START, "TravelPlanTeamLeader")', 'graph.add_conditional_edges(', '    "TravelPlanTeamLeader", router, members)', 'app = graph.compile(', '    checkpointer=checkpointer,', '    interrupt_before=["Critic_tools"])'];
  lines.forEach((l, i) => { const y = py + 38 + i * 19; if (i === 1 || i === 2) s += `<rect class="a-x" data-o="${4 + i * 0.45}" x="${cx + 1}" y="${y - 11}" width="${cwid - 2}" height="16" fill="${c}" fill-opacity=".08"/>`; s += hook(T(cx + 22, y, String(i + 1), c, 6.8, 0.4, 'end'), 'a-f', 4 + i * 0.45) + hook(T(cx + 30, y, l, c, 7.4, 0.95), 'a-t', 4 + i * 0.45); });
  return s;
};
/** Skills: a custom HTTP skill definition (README schema) beside the registry of built-in skills. */
export const skillDef: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const jx = 16, jy = 16, jw = 222, jh = H - 32;
  s += every(`<rect x="${jx}" y="${jy}" width="${jw}" height="${jh}" ${BG} stroke="${c}"/><path d="M${jx} ${jy + 18}H${jx + jw}" stroke="${c}" stroke-opacity=".5"/>` + T(jx + 8, jy + 12.5, 'skill_definition.json', c, 7.2, 1, 'start', 500), 'a-d', 0);
  const L = ['{', '  "url": "https://api.weather.dev",', '  "method": "GET",', '  "type": "function",', '  "function": {', '    "name": "WeatherForecast",', '    "parameters": {', '      "city": { "type": "string" }', '    }, "required": ["city"]', '  }', '}'];
  L.forEach((l, i) => (s += hook(T(jx + 8, jy + 34 + i * 15.5, l, c, 7, l.includes('"name"') ? 1 : 0.88, 'start', l.includes('"name"') ? 600 : 400), 'a-t', 1 + i * 0.3)));
  const rx = jx + jw + 12, rw = W - rx - 16;
  s += every(T(rx, jy + 12, 'skills', c, 7.4, 1, 'start', 500) + `<path d="M${rx} ${jy + 18}H${rx + rw}" stroke="${c}" stroke-opacity=".5"/>`, 'a-t', 1);
  const reg: [string, string][] = [['duckduckgo-search', 'builtin'], ['wikipedia', 'builtin'], ['yahoo-finance', 'builtin'], ['ask-human', 'builtin'], ['WeatherForecast', 'custom']];
  reg.forEach(([n, t], i) => { const y = jy + 36 + i * 24, hot = t === 'custom'; if (hot) s += `<rect class="a-x" data-o="5" x="${rx - 2}" y="${y - 12}" width="${rw + 4}" height="19" fill="${c}"/>`; s += T(rx + 3, y, n, hot ? onC(c) : c, 6.6, 1) + T(rx + rw - 1, y, t, hot ? onC(c) : c, 6, hot ? 1 : 0.6, 'end'); });
  const by = jy + jh - 34;
  s += every(`<rect x="${rx}" y="${by}" width="${rw}" height="34" stroke="${c}" stroke-dasharray="3 2"/>` + T(rx + 6, by + 14, 'POST /skills/validate', c, 6.4, 0.9) + T(rx + 6, by + 27, '200 · valid ✓', c, 6.6, 1, 'start', 600), 'a-p', 6);
  return s;
};
/** Knowledge base: pdf → 500-char chunks → 384-d bge embedding → Qdrant top-k for a query. */
export const ragPipe: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const y = 44; const boxes: [string, string][] = [['guide.pdf', 'PyMuPDF'], ['chunks', 'size 500'], ['embed', 'fastembed'], ['qdrant', 'collection']];
  const bw = 78, gap = (W - 32 - bw * 4) / 3;
  boxes.forEach(([a, b], i) => { const x = 16 + i * (bw + gap); s += `<rect class="a-p" data-o="${i * 0.8}" x="${f(x)}" y="${y - 18}" width="${bw}" height="36" ${i === 2 ? `fill="${c}"` : `${BG} stroke="${c}"`}/>` + every(T(x + 7, y - 4, a, i === 2 ? onC(c) : c, 7.2, 1, 'start', 500) + T(x + 7, y + 10, b, i === 2 ? onC(c) : c, 6.4, 0.75), 'a-t', i * 0.8 + 0.2); if (i < 3) { const ax = x + bw + 3, bx2 = x + bw + gap - 3; s += `<path d="M${f(ax)} ${y}H${f(bx2)}" stroke="${c}"/><path d="M${f(bx2 - 5)} ${y - 3.5}L${f(bx2)} ${y}L${f(bx2 - 5)} ${y + 3.5}" stroke="${c}"/>`; } });
  // vector strip
  const vy = 88; s += every(T(16, vy, 'BAAI/bge-small-en-v1.5 · float32[384]', c, 7, 0.85), 'a-t', 2);
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const n = 64, vw = (W - 32) / n; for (let i = 0; i < n; i++) { const v = rnd() * 2 - 1; const h = Math.abs(v) * 14 + 1; s += `<rect class="${v > 0 ? 'a-y' : 'a-yd'}" data-o="${3 + i * 0.03}" x="${f(16 + i * vw)}" y="${f(vy + 22 - (v > 0 ? h : 0))}" width="${f(vw - 1.2)}" height="${f(h)}" fill="${c}" fill-opacity="${f(0.35 + Math.abs(v) * 0.65)}"/>`; }
  s += every(`<path d="M16 ${vy + 22}H${W - 16}" stroke="${c}" stroke-opacity=".4"/>`, 'a-d', 2);
  // top-k
  const ty = 134; s += every(`<rect x="16" y="${ty}" width="${W - 32}" height="${H - ty - 14}" ${BG} stroke="${c}" stroke-opacity=".7"/>` + T(24, ty + 15, 'q: "kid-friendly museums in lisbon"', c, 7, 1, 'start', 500) + T(W - 24, ty + 15, 'top_k=3', c, 6.6, 0.7, 'end'), 'a-d', 5);
  [['0.83', 'chunk_14 · p.6'], ['0.79', 'chunk_02 · p.1'], ['0.71', 'chunk_31 · p.12']].forEach(([sc, ch], i) => { const yy = ty + 34 + i * 17; const w = (W - 150) * +sc; s += hook(T(24, yy, sc, c, 7, 1), 'a-t', 6 + i * 0.4) + `<rect class="a-x" data-o="${6 + i * 0.4}" x="54" y="${yy - 7}" width="${f(w)}" height="7" fill="${c}" fill-opacity="${1 - i * 0.25}"/>` + hook(T(W - 24, yy, ch, c, 6.6, 0.8, 'end'), 'a-t', 6.2 + i * 0.4); });
  return s;
};
/** Human in the loop: a sequence diagram — the graph pauses via interrupt_before and resumes on a decision. */
export const sequence: Art = (W, H, c) => {
  let s = grid(W, H, c, 16, 0.05);
  const lanes: [string, number][] = [['you', 56], ['graph', 200], ['Critic_tools', 344]];
  lanes.forEach(([n, x], i) => { const w = n.length * 7 + 16; s += every(`<rect x="${x - w / 2}" y="16" width="${w}" height="20" ${i === 1 ? `fill="${c}"` : `${BG} stroke="${c}"`}/>` + T(x, 30, n, i === 1 ? onC(c) : c, 7.4, 1, 'middle', 500) , 'a-p', i * 0.3) + `<path class="a-f" data-o="1" d="M${x} 36V${H - 14}" stroke="${c}" stroke-opacity=".35" stroke-dasharray="3 3"/>`; });
  let mo = 1.5;
  const msg = (y: number, from: number, to: number, label: string, dash = false) => { mo += 0.8; const a = lanes[from][1], b = lanes[to][1], dir = b > a ? 1 : -1; return `<path class="a-d${dash ? '' : ' a-flow'}" data-o="${mo}" d="M${a} ${y}H${b - dir * 5}" stroke="${c}"${dash ? ' stroke-dasharray="4 3"' : ''}/><path class="a-p" data-o="${mo + 0.3}" d="M${b - dir * 10} ${y - 3.5}L${b - dir * 4} ${y}L${b - dir * 10} ${y + 3.5}" stroke="${c}"/>` + hook(T((a + b) / 2, y - 5, label, c, 6.8, 0.95, 'middle'), 'a-t', mo); };
  s += msg(62, 0, 1, 'message: "plan my trip"');
  s += every(`<path d="M200 80h26v14h-20" stroke="${c}"/><path d="M211 90.5L206 94L211 97.5" stroke="${c}"/>` + T(232, 90, 'Critic → tool_calls', c, 6.6, 0.85), 'a-f', 2.2);
  s += every(`<rect x="186" y="104" width="28" height="20" ${BG} stroke="${c}"/><rect x="195" y="108" width="3" height="12" fill="${c}"/><rect x="202" y="108" width="3" height="12" fill="${c}"/>` + T(222, 118, 'interrupt_before', c, 6.8, 1, 'start', 600), 'a-p', 2.6);
  s += msg(144, 1, 0, 'paused · awaiting review', true);
  s += msg(170, 0, 1, 'decision: "approved"');
  s += msg(196, 1, 2, 'execute tool');
  s += msg(218, 2, 1, 'tool_output', true);
  return s;
};
/** Public API: a curl call with the team key and the SSE frames (ChatResponse) streaming back. */
export const sseStream: Art = (W, H, c) => {
  let s = every(`<rect x="14" y="12" width="${W - 28}" height="${H - 24}" ${BG} stroke="${c}" stroke-opacity=".7"/><path d="M14 30H${W - 14}" stroke="${c}" stroke-opacity=".4"/>`, 'a-d', 0);
  [0, 1, 2].forEach((i) => (s += `<rect x="${24 + i * 10}" y="18" width="6" height="6" fill="${c}" fill-opacity="${0.4 + i * 0.3}"/>`));
  s += every(T(W / 2, 25, 'zsh · stream-public', c, 7, 0.7, 'middle'), 'a-t', 0);
  const L: [string, number, number?][] = [
    ['$ curl -N -X POST $API/teams/7/stream-public/t_42 \\', 1, 500],
    ['    -H "x-api-key: fg_••••••••" \\', 0.85],
    ['    -d \'{"message":{"type":"human","content":"hi"}}\'', 0.85],
    ['', 0],
    ['data: {"type":"ai","name":"TravelPlanTeamLeader",…}', 0.95],
    ['data: {"type":"tool","name":"FunEngineer",', 0.95],
    ['       "tool_calls":[{"name":"duckduckgo-search"}]}', 0.8],
    ['data: {"type":"ai","name":"Critic","content":"Looks"}', 0.95],
    ['data: {"type":"ai","name":"Critic","content":" good"}', 0.95],
  ];
  L.forEach(([l, op, w], i) => { const y = 48 + i * 17, o = 1 + i * (i < 3 ? 0.6 : 0.9); if (l.startsWith('data:')) s += `<rect class="a-yd" data-o="${o}" x="22" y="${y - 9}" width="3" height="11" fill="${c}"/>`; s += hook(T(l.startsWith('data:') || l.startsWith('    ') || l.startsWith('       ') ? 30 : 24, y, l, c, 6.8, op, 'start', w ?? 400), 'a-t', o); });
  s += `<rect class="a-blink" x="24" y="${48 + L.length * 17 - 5}" width="6" height="11" fill="${c}"/>`;
  return s;
};
