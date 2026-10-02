/**
 * quixt.dev edge Worker.
 * Static files in dist/ are served by Workers Static Assets; only /api/* reaches this code
 * (see `assets.run_worker_first` in wrangler.jsonc).
 *
 *   POST /api/brief  ← the 4-step project brief on /contact/ (multipart, optional attachments)
 *   POST /api/book   ← the "Book a free 30-min call" card on /contact/
 *
 * Both send a formatted email to INBOX via the `send_email` binding. Forms work without JS
 * (303 redirect to /contact/thanks/); with JS they post with `Accept: application/json`.
 */
import { buildOptions, stages } from '../src/data/contact';

interface Env {
  EMAIL: { send(message: unknown): Promise<{ messageId: string }> };
  RATE_LIMITER?: { limit(opts: { key: string }): Promise<{ success: boolean }> };
  ASSETS: { fetch(req: Request): Promise<Response> };
  INBOX: string;
  SENDER: string;
}

const MAX_ATTACH_BYTES = 3.5 * 1024 * 1024; // send() caps the whole message at 5 MiB; base64 adds ~33%
const MIN_FILL_MS = 2500; // humans don't finish a form in under 2.5 s

const buildLabel = Object.fromEntries(buildOptions.map((o) => [o.value, o.title]));
const stageLabel = Object.fromEntries(stages.map((s) => [s.value, s.title]));

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/brief' || url.pathname === '/api/book') {
      if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'POST' });
      try {
        return await handle(url.pathname === '/api/brief' ? 'brief' : 'book', request, env);
      } catch (err) {
        console.error('form error', err);
        return reply(request, false, 'Something went wrong on our side. Please email build@quixt.dev and we’ll pick it up from there.', 500);
      }
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'Not found' }, 404);
    return env.ASSETS.fetch(request);
  },
};

async function handle(kind: 'brief' | 'book', request: Request, env: Env): Promise<Response> {
  // Same-origin only (browsers always send Origin on cross-site POSTs).
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return reply(request, false, 'Forbidden', 403);

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (env.RATE_LIMITER && !(await env.RATE_LIMITER.limit({ key: `${kind}:${ip}` })).success) {
    return reply(request, false, 'Too many submissions in a short time. Please wait a minute and try again.', 429);
  }

  const form = await request.formData();
  const str = (k: string, max = 2000) => String(form.get(k) ?? '').trim().slice(0, max);

  // Spam traps: hidden honeypot field, and a timestamp the page sets when it loads.
  const started = Number(str('_t'));
  if (str('_gotcha') || (started && Date.now() - started < MIN_FILL_MS)) return reply(request, true); // pretend success

  const name = str('name', 120);
  const email = str('email', 200);
  if (!name || !isEmail(email)) return reply(request, false, 'Please add your name and a valid email address.', 422);

  const cf = (request as Request & { cf?: { city?: string; country?: string } }).cf;
  const meta: Row[] = [
    ['Submitted', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'],
    ['From', [cf?.city, cf?.country].filter(Boolean).join(', ')],
    ['Page', request.headers.get('Referer') ?? ''],
  ];

  let subject: string, intro: string, rows: Row[], message = '';
  const attachments: { content: ArrayBuffer; filename: string; type: string; disposition: 'attachment' }[] = [];
  const skipped: string[] = [];

  if (kind === 'brief') {
    const build = buildLabel[str('build')] ?? (str('build') || '—');
    message = str('description', 4000);
    rows = [
      ['Name', name], ['Email', email], ['Phone', str('phone', 60)], ['Preferred contact', str('contact_method', 40)],
      ['Wants to build', build], ['Stage', stageLabel[str('stage')] ?? str('stage')],
      ['Budget', str('budget', 60)], ['Timeline', str('timeline', 60)], ['Plan', str('plan', 60)],
      ['NDA first', str('nda') === 'yes' ? 'Yes, send an NDA before the call' : 'No'],
    ];
    let total = 0;
    for (const f of form.getAll('attachment')) {
      if (typeof f === 'string' || !f.size) continue;
      if (total + f.size > MAX_ATTACH_BYTES || attachments.length >= 10) { skipped.push(`${f.name} (${kb(f.size)})`); continue; }
      total += f.size;
      attachments.push({ content: await f.arrayBuffer(), filename: f.name.slice(0, 120), type: f.type || 'application/octet-stream', disposition: 'attachment' });
    }
    if (attachments.length) rows.push(['Attachments', attachments.map((a) => a.filename).join(', ')]);
    if (skipped.length) rows.push(['Not attached (too large)', `${skipped.join(', ')}. Ask the client to send these by email.`]);
    subject = `New project brief · ${name} · ${build}`;
    intro = `${name} sent a project brief from quixt.dev.`;
  } else {
    const date = str('date', 20), time = str('time', 10);
    const when = date ? `${new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${time} IST` : '—';
    message = str('note', 1000);
    rows = [['Name', name], ['Email', email], ['Requested slot', when], ['Visitor timezone', str('tz', 60)]];
    subject = `Call request · ${name} · ${date ? `${date} ${time} IST` : 'time TBD'}`;
    intro = `${name} asked for a free 30-minute discovery call.`;
  }

  await env.EMAIL.send({
    to: env.INBOX,
    from: { email: env.SENDER, name: 'Quixt Website' },
    replyTo: { email, name },
    subject,
    html: renderHtml(intro, rows.filter(([, v]) => v), message, meta.filter(([, v]) => v)),
    text: renderText(intro, rows.filter(([, v]) => v), message, meta.filter(([, v]) => v)),
    ...(attachments.length ? { attachments } : {}),
  });

  return reply(request, true);
}

type Row = [string, string];

function reply(request: Request, ok: boolean, error?: string, status = ok ? 200 : 400): Response {
  if ((request.headers.get('Accept') ?? '').includes('application/json')) return json(ok ? { ok } : { ok, error }, status);
  if (ok) return Response.redirect(new URL('/contact/thanks/', request.url).toString(), 303);
  return new Response(page(error ?? 'Something went wrong.'), { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function renderHtml(intro: string, rows: Row[], message: string, meta: Row[]): string {
  const tr = (r: Row[]) => r.map(([k, v]) => `<tr><td style="padding:10px 16px 10px 0;color:#a0502a;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:10px 0;color:#1e0d04">${esc(v)}</td></tr>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#fdf4ef;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;line-height:1.55">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #f1dccd">
<tr><td style="background:#ab4200;color:#fff;padding:20px 28px;font-size:18px;letter-spacing:-.02em">quixt <span style="opacity:.75;font-size:13px">· website</span></td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 20px;font-size:16px;color:#1e0d04">${esc(intro)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;border-top:1px solid #f1dccd">${tr(rows)}</table>
${message ? `<p style="margin:24px 0 8px;color:#a0502a">In their words</p><div style="background:#fdf4ef;padding:16px 18px;color:#1e0d04;white-space:pre-wrap">${esc(message)}</div>` : ''}
<p style="margin:24px 0 0;color:#1e0d04">Reply to this email to answer them directly.</p>
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #f1dccd;font-size:12px;color:#a0502a"><table role="presentation" cellpadding="0" cellspacing="0">${tr(meta)}</table></td></tr>
</table></td></tr></table></body></html>`;
}

function renderText(intro: string, rows: Row[], message: string, meta: Row[]): string {
  const lines = (r: Row[]) => r.map(([k, v]) => `${k}: ${v}`).join('\n');
  return `${intro}\n\n${lines(rows)}\n${message ? `\nIn their words:\n${message}\n` : ''}\nReply to this email to answer them directly.\n\n—\n${lines(meta)}\n`;
}

function page(error: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Couldn’t send · Quixt</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fdf4ef;color:#ab4200;font:15px/1.6 ui-monospace,Menlo,monospace;padding:24px}main{max-width:520px}a{color:#ab4200}</style></head>
<body><main><h1 style="font-weight:400">We couldn’t send that.</h1><p>${esc(error)}</p><p><a href="/contact/#brief">← Back to the form</a> · <a href="mailto:build@quixt.dev">build@quixt.dev</a></p></main></body></html>`;
}
