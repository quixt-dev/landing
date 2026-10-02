/**
 * Theatre video player for VideoTheatre.astro (Mux public playback ID → HLS).
 * Loaded on intent; hls.js is imported only on browsers that need it (everything with MSE/ManagedMediaSource;
 * older iOS falls back to native HLS). Opening morphs the trigger photo into the stage with GSAP.
 */
import { gsap } from 'gsap';
import type HlsType from 'hls.js';

type Cue = { s: number; e: number; x: number; y: number; w: number; h: number };
type Theatre = { open(from?: Element | null): void; warm(): void };

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const IDLE_MS = 2600;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (t: number) => {
  const s = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const ICON = {
  play: '<svg viewBox="0 0 20 20"><path d="M5 3l12 7-12 7z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 20 20"><path d="M5 3h3.5v14H5zM11.5 3H15v14h-3.5z" fill="currentColor"/></svg>',
};

export function createTheatre(dlg: HTMLDialogElement): Theatre {
  const q = <T extends Element = HTMLElement>(s: string) => dlg.querySelector<T>(s)!;
  // Two cuts of the same film: 16:9 everywhere, 9:16 for phones held upright (no rotating needed).
  const ids = { landscape: dlg.dataset.playbackId!, portrait: dlg.dataset.portraitId || '' };
  const phonePortrait = window.matchMedia('(orientation: portrait) and (max-width: 767px)');
  type Variant = keyof typeof ids;
  const pick = (): Variant => (ids.portrait && phonePortrait.matches ? 'portrait' : 'landscape');
  let variant: Variant = pick();
  const srcOf = (v: Variant) => `https://stream.mux.com/${ids[v]}.m3u8`;
  const posterOf = (v: Variant) => `https://image.mux.com/${ids[v]}/thumbnail.webp?width=${v === 'portrait' ? 1080 : 1920}&time=0`;
  const video = q<HTMLVideoElement>('[data-video]');
  const stage = q('[data-stage]'), ui = q('[data-ui]'), bg = q('[data-bg]');
  const chrome = [...dlg.querySelectorAll<HTMLElement>('[data-chrome]')];
  const scrub = q('[data-scrub]'), buf = q('[data-buf]'), fill = q('[data-fill-bar]'), hoverBar = q('[data-hoverbar]'), head = q('[data-head]');
  const tip = q('[data-tip]'), thumb = q('[data-thumb]'), tipTime = q('[data-tiptime]');
  const cur = q('[data-cur]'), dur = q('[data-dur]');
  const toggleBtn = q<HTMLButtonElement>('[data-toggle]'), muteBtn = q<HTMLButtonElement>('[data-mute]'), vol = q<HTMLInputElement>('[data-volume]');
  const fsBtn = q<HTMLButtonElement>('[data-fs]'), pipBtn = q<HTMLButtonElement>('[data-pip]'), ccBtn = q<HTMLButtonElement>('[data-cc]');
  const pulse = q('[data-pulse]'), flash = q('[data-flash]'), end = q('[data-end]'), unmute = q<HTMLButtonElement>('[data-unmute]'), live = q('[data-live]');
  const qualityWrap = q('[data-quality-wrap]'), qualityLabel = q('[data-quality-label]'), speedLabel = q('[data-speed-label]');

  let hls: HlsType | null = null;
  let loading: Promise<void> | null = null;
  let cues: Cue[] = [];
  let sheet = '';
  const boards: Partial<Record<Variant, { cues: Cue[]; sheet: string }>> = {};
  let source: Element | null = null;
  let sheetW = 0;
  let idleT = 0, raf = 0, spinT = 0;
  let dragging = false, wasPlaying = false;
  let lastFocus: HTMLElement | null = null;

  /* ------------------------------------------------------------ loading */
  const useMse = () => 'MediaSource' in window || 'ManagedMediaSource' in window;

  function warm() {
    if (useMse()) import('hls.js');
    loadStoryboard(pick());
  }

  // Applies a cut to the stage: shape, poster and storyboard. The stream itself is swapped in load()/swap().
  function applyVariant(v: Variant) {
    variant = v;
    stage.classList.toggle('is-portrait', v === 'portrait');
    video.poster = posterOf(v);
    const b = boards[v];
    cues = b?.cues ?? []; sheet = b?.sheet ?? ''; sheetW = 0;
    thumb.classList.remove('has-img');
    if (!b) loadStoryboard(v);
  }

  // Rotating the phone mid-play swaps to the other cut at the same timestamp.
  async function swap(v: Variant) {
    if (v === variant || !loading) { applyVariant(v); return; }
    const t = video.currentTime, playing = !video.paused && !video.ended;
    applyVariant(v);
    await loading;
    const resume = () => { video.currentTime = Math.min(t, (video.duration || t) - 0.1); if (playing) play(); };
    video.addEventListener('loadedmetadata', resume, { once: true });
    if (hls) hls.loadSource(srcOf(v)); else video.src = srcOf(v);
  }
  phonePortrait.addEventListener('change', () => { if (dlg.open) swap(pick()); });

  function load(): Promise<void> {
    return (loading ??= (async () => {
      if (useMse()) {
        const { default: Hls } = await import('hls.js');
        if (Hls.isSupported()) {
          hls = new Hls({ capLevelToPlayerSize: true, startLevel: -1, maxBufferLength: 30 });
          hls.on(Hls.Events.MANIFEST_PARSED, buildQuality);
          hls.on(Hls.Events.LEVEL_SWITCHED, syncQualityLabel);
          hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, syncCaptions);
          hls.on(Hls.Events.ERROR, (_e, d) => {
            if (!d.fatal || !hls) return;
            if (d.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
            else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          });
          hls.loadSource(srcOf(variant));
          hls.attachMedia(video);
          return;
        }
      }
      video.src = srcOf(variant); // native HLS (Safari / iOS)
      video.textTracks.addEventListener?.('addtrack', syncCaptions);
    })());
  }

  const fetching = new Set<Variant>();
  async function loadStoryboard(v: Variant) {
    if (boards[v] || fetching.has(v)) return;
    fetching.add(v);
    try {
      const vtt = await (await fetch(`https://image.mux.com/${ids[v]}/storyboard.vtt`)).text();
      const ts = (t: string) => t.split(':').reduce((a, n) => a * 60 + parseFloat(n), 0);
      const lines = vtt.split(/\r?\n/);
      const out: Cue[] = [];
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/([\d:.]+)\s*-->\s*([\d:.]+)/);
        if (!m) continue;
        const [url, xywh] = (lines[i + 1] ?? '').split('#xywh=');
        if (!xywh) continue;
        const [x, y, w, h] = xywh.split(',').map(Number);
        url && (boards[v] ??= { cues: out, sheet: url });
        out.push({ s: ts(m[1]), e: ts(m[2]), x, y, w, h });
      }
      const b = boards[v];
      if (b?.sheet) new Image().src = b.sheet;
      if (b && v === variant) { cues = b.cues; sheet = b.sheet; }
    } catch { /* thumbnails are optional */ } finally { fetching.delete(v); }
  }

  /* ------------------------------------------------------------ open / close */
  function lock(on: boolean) {
    window.dispatchEvent(new Event(on ? 'quixt:lock' : 'quixt:unlock'));
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }

  function ghostFrom(el: Element) {
    const img = el.querySelector('img');
    const g = document.createElement('div');
    g.className = 'vt__ghost duotone';
    if (img) { const c = document.createElement('img'); c.src = img.currentSrc || img.src; c.alt = ''; g.append(c); }
    dlg.append(g);
    return g;
  }
  const rect = (r: DOMRect) => ({ left: r.left, top: r.top, width: r.width, height: r.height });

  function open(from?: Element | null) {
    if (dlg.open) return;
    source = from ?? null;
    lastFocus = document.activeElement as HTMLElement | null;
    lock(true);
    // choose the cut before showModal so the stage is measured in its final shape for the morph
    const want = pick();
    if (!loading) applyVariant(want); else if (want !== variant) void swap(want);
    dlg.showModal();
    resetUi();
    const start = load().then(() => play(true));
    warm();

    if (reduceMotion() || !source) {
      gsap.fromTo([bg, stage, ...chrome], { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      const from = rect(source.getBoundingClientRect()), to = rect(stage.getBoundingClientRect());
      const g = ghostFrom(source);
      gsap.set(g, from);
      gsap.set(stage, { opacity: 0 });
      gsap.set(chrome, { opacity: 0, y: 10 });
      gsap.timeline()
        .fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to(g, { ...to, duration: 0.95, ease: 'expo.inOut' }, 0)
        .to(stage, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.7)
        .to(g, { opacity: 0, duration: 0.45, ease: 'power2.out', onComplete: () => g.remove() }, 0.75)
        .to(chrome, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, 0.55);
    }
    q<HTMLButtonElement>('[data-close]').focus({ preventScroll: true });
    void start;
  }

  function close() {
    if (!dlg.open || dlg.dataset.closing) return;
    dlg.dataset.closing = '1';
    video.pause();
    closeMenus();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    const done = () => {
      gsap.set([bg, stage, ...chrome], { clearProps: 'opacity,transform' });
      dlg.close(); delete dlg.dataset.closing; lock(false);
      lastFocus?.focus({ preventScroll: true });
    };
    if (reduceMotion() || !source) { gsap.to([bg, stage, ...chrome], { opacity: 0, duration: 0.25, onComplete: done }); return; }
    const to = rect(source.getBoundingClientRect()), from = rect(stage.getBoundingClientRect());
    const g = ghostFrom(source);
    gsap.set(g, { ...from, opacity: 0 });
    gsap.timeline({ onComplete: () => { g.remove(); done(); } })
      .to(chrome, { opacity: 0, duration: 0.25 }, 0)
      .to(g, { opacity: 1, duration: 0.25 }, 0)
      .to(stage, { opacity: 0, duration: 0.25 }, 0.1)
      .to(g, { ...to, duration: 0.85, ease: 'expo.inOut' }, 0.15)
      .to(bg, { opacity: 0, duration: 0.55, ease: 'power2.in' }, 0.35);
  }

  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  q('[data-close]').addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target === bg) close(); });

  /* ------------------------------------------------------------ playback */
  async function play(fromOpen = false) {
    try { await video.play(); }
    catch (err) {
      // Autoplay with sound can be refused if the click's activation expired while hls.js loaded: retry muted.
      if (fromOpen && (err as DOMException).name === 'NotAllowedError') {
        video.muted = true;
        try { await video.play(); unmute.hidden = false; } catch { /* stays paused: big play button shows */ }
      }
    }
  }
  const toggle = () => (video.paused || video.ended ? play() : video.pause());
  const seekBy = (d: number) => { video.currentTime = Math.min(Math.max(0, video.currentTime + d), video.duration || 0); say(`${d > 0 ? '+' : '−'}${Math.abs(d)}s`); };
  const setVolume = (v: number) => { video.volume = Math.min(1, Math.max(0, v)); video.muted = video.volume === 0; say(`Volume ${Math.round(video.volume * 100)}%`); };

  function say(text: string) {
    flash.textContent = text;
    flash.classList.remove('is-on'); void flash.offsetWidth; flash.classList.add('is-on');
    live.textContent = text;
  }
  function pulseIcon(kind: 'play' | 'pause') {
    pulse.innerHTML = ICON[kind];
    pulse.classList.remove('is-on'); void pulse.offsetWidth; pulse.classList.add('is-on');
  }

  video.addEventListener('play', () => { stage.classList.add('is-playing'); stage.classList.remove('is-ended'); end.hidden = true; toggleBtn.ariaLabel = 'Pause'; tick(); wake(); });
  video.addEventListener('pause', () => { stage.classList.remove('is-playing'); toggleBtn.ariaLabel = 'Play'; cancelAnimationFrame(raf); wake(true); });
  video.addEventListener('ended', () => { stage.classList.add('is-ended'); end.hidden = false; q<HTMLElement>('[data-end] .vt__cta').focus({ preventScroll: true }); });
  video.addEventListener('waiting', () => { clearTimeout(spinT); spinT = window.setTimeout(() => stage.classList.add('is-buffering'), 250); });
  ['playing', 'canplay', 'seeked', 'pause'].forEach((ev) => video.addEventListener(ev, () => { clearTimeout(spinT); stage.classList.remove('is-buffering'); }));
  video.addEventListener('loadedmetadata', () => { dur.textContent = fmt(video.duration); render(); });
  video.addEventListener('durationchange', () => { dur.textContent = fmt(video.duration); });
  video.addEventListener('timeupdate', () => { if (video.paused) render(); });
  video.addEventListener('progress', renderBuffer);
  video.addEventListener('volumechange', () => {
    stage.classList.toggle('is-muted', video.muted || video.volume === 0);
    stage.classList.toggle('is-quiet', video.volume < 0.5);
    muteBtn.ariaLabel = video.muted ? 'Unmute' : 'Mute';
    vol.value = String(video.muted ? 0 : video.volume);
    vol.style.setProperty('--v', `${(video.muted ? 0 : video.volume) * 100}%`);
    if (!video.muted) { unmute.hidden = true; store.set('qx-vol', String(video.volume)); }
  });
  video.addEventListener('ratechange', () => { speedLabel.textContent = `${video.playbackRate}×`; });

  function tick() { render(); raf = requestAnimationFrame(tick); }
  function render() {
    const d = video.duration || 0, t = dragging ? Number(scrub.dataset.t ?? 0) : video.currentTime;
    const p = d ? t / d : 0;
    fill.style.width = `${p * 100}%`;
    head.style.left = `${p * 100}%`;
    cur.textContent = fmt(t);
    scrub.ariaValueNow = String(Math.round(p * 100));
    scrub.ariaValueText = `${fmt(t)} of ${fmt(d)}`;
  }
  function renderBuffer() {
    const d = video.duration || 0;
    if (!d) return;
    for (let i = 0; i < video.buffered.length; i++) {
      if (video.buffered.start(i) <= video.currentTime + 0.5) buf.style.width = `${(video.buffered.end(i) / d) * 100}%`;
    }
  }

  /* ------------------------------------------------------------ scrubbing + storyboard */
  const pctAt = (x: number) => { const r = scrub.getBoundingClientRect(); return Math.min(1, Math.max(0, (x - r.left) / r.width)); };
  function preview(p: number) {
    const d = video.duration || 0, t = p * d;
    hoverBar.style.width = `${p * 100}%`;
    tipTime.textContent = fmt(t);
    const r = scrub.getBoundingClientRect(), half = Math.max(thumb.offsetWidth, tipTime.offsetWidth) / 2 + 2;
    tip.style.left = `${Math.min(r.width - half, Math.max(half, p * r.width))}px`;
    const c = cues.find((k) => t >= k.s && t < k.e) ?? cues[cues.length - 1];
    if (c && sheet) {
      const scale = thumb.clientWidth / c.w || 1;
      thumb.classList.add('has-img');
      thumb.style.backgroundImage = `url(${sheet})`;
      thumb.style.backgroundPosition = `${-c.x * scale}px ${-c.y * scale}px`;
      sizeSheet(scale);
    }
    return t;
  }
  // background-size needs the sprite's natural width; measured once per sprite (sheetW is reset in applyVariant)
  function sizeSheet(scale: number) {
    if (sheetW) { thumb.style.backgroundSize = `${sheetW * scale}px auto`; return; }
    const im = new Image(); im.onload = () => { sheetW = im.naturalWidth; thumb.style.backgroundSize = `${sheetW * scale}px auto`; }; im.src = sheet;
  }

  scrub.addEventListener('pointermove', (e) => {
    const t = preview(pctAt(e.clientX));
    if (dragging) { scrub.dataset.t = String(t); render(); seekTo(t); }
  });
  scrub.addEventListener('pointerdown', (e) => {
    dragging = true; wasPlaying = !video.paused;
    scrub.setPointerCapture(e.pointerId); scrub.classList.add('is-drag');
    const t = preview(pctAt(e.clientX)); scrub.dataset.t = String(t); seekTo(t); render();
    video.pause();
  });
  const endDrag = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false; scrub.classList.remove('is-drag');
    scrub.releasePointerCapture?.(e.pointerId);
    video.currentTime = Number(scrub.dataset.t ?? video.currentTime);
    if (wasPlaying) play();
  };
  scrub.addEventListener('pointerup', endDrag);
  scrub.addEventListener('pointercancel', endDrag);
  let seekRaf = 0;
  function seekTo(t: number) {
    cancelAnimationFrame(seekRaf);
    seekRaf = requestAnimationFrame(() => { (video as HTMLVideoElement & { fastSeek?: (t: number) => void }).fastSeek?.(t) ?? (video.currentTime = t); });
  }
  scrub.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); seekBy(-5); }
    else if (k === 'ArrowRight' || k === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); seekBy(5); }
    else if (k === 'Home') { e.preventDefault(); video.currentTime = 0; }
    else if (k === 'End') { e.preventDefault(); video.currentTime = Math.max(0, (video.duration || 0) - 0.1); }
  });

  /* ------------------------------------------------------------ controls */
  toggleBtn.addEventListener('click', toggle);
  q('[data-big]').addEventListener('click', () => play());
  q('[data-back]').addEventListener('click', () => seekBy(-10));
  q('[data-fwd]').addEventListener('click', () => seekBy(10));
  q('[data-replay]').addEventListener('click', () => { video.currentTime = 0; play(); });
  unmute.addEventListener('click', () => { video.muted = false; if (video.volume === 0) video.volume = 1; });
  muteBtn.addEventListener('click', () => { video.muted = !video.muted; if (!video.muted && video.volume === 0) video.volume = 0.6; });
  vol.addEventListener('input', () => { video.volume = Number(vol.value); video.muted = video.volume === 0; });
  const savedVol = Number(store.get('qx-vol'));
  if (savedVol > 0 && savedVol <= 1) video.volume = savedVol;

  // tap/click on the picture: desktop toggles play; touch first reveals the controls, double-tap the sides seeks ±10 s
  let lastTap = 0, tapT = 0;
  q('[data-hit]').addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse') { toggle(); pulseIcon(video.paused ? 'play' : 'pause'); return; }
    const now = Date.now(), r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
    if (now - lastTap < 300 && (x < 0.35 || x > 0.65)) { clearTimeout(tapT); seekBy(x < 0.5 ? -10 : 10); lastTap = 0; return; }
    lastTap = now;
    tapT = window.setTimeout(() => {
      if (!stage.classList.contains('is-ui')) wake();
      else { toggle(); pulseIcon(video.paused ? 'play' : 'pause'); }
    }, 220);
  });

  // fullscreen on the stage keeps our UI; iPhone only supports native video fullscreen
  const vfs = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
  fsBtn.addEventListener('click', toggleFs);
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (stage.requestFullscreen) stage.requestFullscreen().catch(() => vfs.webkitEnterFullscreen?.());
    else vfs.webkitEnterFullscreen?.();
  }
  document.addEventListener('fullscreenchange', () => {
    const on = document.fullscreenElement === stage;
    stage.classList.toggle('is-fs', on);
    fsBtn.ariaLabel = on ? 'Exit fullscreen' : 'Fullscreen';
  });

  if (document.pictureInPictureEnabled) {
    pipBtn.hidden = false;
    pipBtn.addEventListener('click', () => (document.pictureInPictureElement ? document.exitPictureInPicture() : video.requestPictureInPicture()).catch(() => {}));
  }

  /* ------------------------------------------------------------ menus: speed + quality */
  const menus = [...dlg.querySelectorAll<HTMLElement>('[data-menu]')];
  const menuBtn = (name: string) => q<HTMLButtonElement>(`[data-menu-btn="${name}"]`);
  function closeMenus() { menus.forEach((m) => { m.hidden = true; menuBtn(m.dataset.menu!).ariaExpanded = 'false'; }); }
  function fillMenu(name: string, title: string, items: { label: string; sub?: string; checked: boolean; pick: () => void }[]) {
    const m = q(`[data-menu="${name}"]`);
    m.innerHTML = `<p class="vt__mh">${title}</p>`;
    items.forEach((it) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'menuitemradio'); b.setAttribute('aria-checked', String(it.checked));
      b.innerHTML = `<span>${it.label}${it.sub ? `<small>${it.sub}</small>` : ''}</span>`;
      b.addEventListener('click', () => { it.pick(); closeMenus(); menuBtn(name).focus(); });
      m.append(b);
    });
  }
  function renderSpeed() {
    fillMenu('speed', 'Speed', SPEEDS.map((s) => ({ label: s === 1 ? 'Normal' : `${s}×`, checked: video.playbackRate === s, pick: () => { video.playbackRate = s; say(`Speed ${s}×`); } })));
  }
  const qualityName = (h: number) => (h >= 2160 ? '4K' : h >= 1440 ? '2K' : h >= 1080 ? 'HD' : '');
  function buildQuality() {
    if (!hls || hls.levels.length < 2) return;
    qualityWrap.hidden = false;
    syncQualityLabel();
  }
  function renderQuality() {
    if (!hls) return;
    const h = hls;
    const levels = h.levels.map((l, i) => ({ i, height: l.height })).sort((a, b) => b.height - a.height);
    fillMenu('quality', 'Quality', [
      { label: 'Auto', sub: h.autoLevelEnabled && h.levels[h.currentLevel] ? `${h.levels[h.currentLevel].height}p` : undefined, checked: h.autoLevelEnabled, pick: () => { h.currentLevel = -1; say('Quality Auto'); } },
      ...levels.map((l) => ({ label: `${l.height}p`, sub: qualityName(l.height), checked: !h.autoLevelEnabled && h.currentLevel === l.i, pick: () => { h.currentLevel = l.i; say(`Quality ${l.height}p`); } })),
    ]);
  }
  function syncQualityLabel() {
    if (!hls) return;
    const l = hls.levels[hls.currentLevel];
    qualityLabel.textContent = hls.autoLevelEnabled ? `Auto${l ? ` · ${l.height}p` : ''}` : `${l?.height ?? ''}p`;
  }
  menus.forEach((m) => {
    const name = m.dataset.menu!, btn = menuBtn(name);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const opening = m.hidden;
      closeMenus();
      if (!opening) return;
      if (name === 'speed') renderSpeed(); else renderQuality();
      m.hidden = false; btn.ariaExpanded = 'true';
      (m.querySelector<HTMLElement>('[aria-checked="true"]') ?? m.querySelector<HTMLElement>('button'))?.focus();
      wake();
    });
    m.addEventListener('keydown', (e) => {
      const items = [...m.querySelectorAll<HTMLElement>('button')], i = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); items[(i + 1) % items.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); items[(i - 1 + items.length) % items.length].focus(); }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeMenus(); btn.focus(); }
    });
  });
  dlg.addEventListener('click', (e) => { if (!(e.target as Element).closest('.vt__menu-wrap')) closeMenus(); });

  /* ------------------------------------------------------------ captions (shown only if the asset has them) */
  let ccOn = false;
  function syncCaptions() {
    const has = hls ? hls.subtitleTracks.length > 0 : [...video.textTracks].some((t) => t.kind === 'subtitles' || t.kind === 'captions');
    ccBtn.hidden = !has;
  }
  ccBtn.addEventListener('click', toggleCaptions);
  function toggleCaptions() {
    if (ccBtn.hidden) return;
    ccOn = !ccOn;
    if (hls) { hls.subtitleDisplay = ccOn; hls.subtitleTrack = ccOn ? 0 : -1; }
    else [...video.textTracks].forEach((t, i) => { if (t.kind === 'subtitles' || t.kind === 'captions') t.mode = ccOn && i === 0 ? 'showing' : 'hidden'; });
    ccBtn.ariaPressed = String(ccOn);
    say(ccOn ? 'Captions On' : 'Captions Off');
  }

  /* ------------------------------------------------------------ idle + keyboard */
  function wake(stay = false) {
    stage.classList.add('is-ui'); stage.classList.remove('is-idle');
    clearTimeout(idleT);
    if (!stay && !video.paused) idleT = window.setTimeout(() => {
      if (video.paused || dragging || menus.some((m) => !m.hidden) || ui.matches(':hover') || ui.contains(document.activeElement) && document.activeElement !== toggleBtn) return;
      stage.classList.remove('is-ui'); stage.classList.add('is-idle');
    }, IDLE_MS);
  }
  stage.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') wake(); });
  stage.addEventListener('pointerleave', () => { if (!video.paused) { clearTimeout(idleT); idleT = window.setTimeout(() => { stage.classList.remove('is-ui'); }, 600); } });
  ui.addEventListener('focusin', () => wake());

  dlg.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement;
    const onControl = t.matches('button, a, input');
    const k = e.key.toLowerCase();
    if ((k === ' ' || k === 'enter') && onControl) return; // let buttons and links do their thing
    let handled = true;
    switch (k) {
      case ' ': case 'k': toggle(); pulseIcon(video.paused ? 'play' : 'pause'); break;
      case 'arrowleft': if (t === vol) return; seekBy(-5); break;
      case 'arrowright': if (t === vol) return; seekBy(5); break;
      case 'j': seekBy(-10); break;
      case 'l': seekBy(10); break;
      case 'arrowup': if (t === vol) return; setVolume(video.volume + 0.1); break;
      case 'arrowdown': if (t === vol) return; setVolume(video.volume - 0.1); break;
      case 'm': video.muted = !video.muted; say(video.muted ? 'Muted' : 'Sound On'); break;
      case 'f': toggleFs(); break;
      case 'c': toggleCaptions(); break;
      default:
        if (/^[0-9]$/.test(k) && video.duration) { video.currentTime = (Number(k) / 10) * video.duration; break; }
        handled = false;
    }
    if (handled) { e.preventDefault(); wake(); }
  });

  function resetUi() {
    end.hidden = true; stage.classList.remove('is-ended');
    if (video.ended) video.currentTime = 0;
    wake(true);
  }

  return { open, warm };
}
