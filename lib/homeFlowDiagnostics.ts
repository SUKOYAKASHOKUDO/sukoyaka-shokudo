export type HomeFlowExperiment = "baseline" | "manual" | "instant";
export interface HomeFlowController {
  experiment: HomeFlowExperiment;
  entries: Record<string, unknown>[];
  capture: (event: string, detail?: Record<string, unknown>) => void;
  report: () => Record<string, unknown>;
  persist: () => void;
  clear: () => void;
  pause: () => void;
  resume: () => void;
}
declare global { interface Window { __sukoyakaHomeFlow?: HomeFlowController; } }

/** Opt-in Preview instrumentation. No network, scroll commands, or prototype patches. */
export const homeFlowDiagnostics = String.raw`
(() => {
  const params = new URLSearchParams(location.search);
  if (location.pathname !== '/' || params.get('home-debug') !== '1' || window.__sukoyakaHomeFlow) return;
  const experiment = ['manual', 'instant'].includes(params.get('home-test')) ? params.get('home-test') : 'baseline';
  const key = 'sukoyaka:home-reentry:v2:' + experiment;
  const limit = 400, pairLimit = 40, ttl = 60 * 60 * 1000;
  let storage = 'available', prior = null, paused = false, motionPending = false;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw && raw.length < 1200000) {
      const p = JSON.parse(raw);
      if (p.schema === 2 && p.experiment === experiment && Date.now() - p.savedAt < ttl
          && p.savedAt <= Date.now() && Array.isArray(p.entries) && Array.isArray(p.tapComparisons)
          && Number.isSafeInteger(p.documentCounter) && Number.isSafeInteger(p.sequence)) prior = p;
      else window.sessionStorage.removeItem(key);
    }
  } catch { storage = 'unavailable'; }
  const entries = prior ? prior.entries.slice(-limit) : [];
  const tapComparisons = prior ? prior.tapComparisons.slice(-pairLimit) : [];
  const documentId = (prior?.documentCounter || 0) + 1;
  let sequence = prior?.sequence || 0, tapId = 0, latestResumeSeq = sequence;
  const pointers = new Map(), motionSources = new Set();
  const isHome = () => location.pathname === '/';
  const box = selector => {
    const e = document.querySelector(selector);
    if (!e) return null;
    const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return { top: r.top, bottom: r.bottom, left: r.left, width: r.width, height: r.height,
      scrollTop: e.scrollTop, scrollLeft: e.scrollLeft, scrollHeight: e.scrollHeight, clientHeight: e.clientHeight,
      position: s.position, transform: s.transform, overflowX: s.overflowX, overflowY: s.overflowY };
  };
  const capture = (event, detail, motion = false) => {
    if (paused || !isHome()) return null;
    const v = window.visualViewport, nav = performance.getEntriesByType?.('navigation')?.[0];
    const entry = { sequence: ++sequence, documentId, event, detail, motion, at: performance.now(),
      ready: document.readyState, visibility: document.visibilityState,
      navigationType: nav?.type || 'unknown', wasDiscarded: document.wasDiscarded === true,
      scrollY: window.scrollY, scrollTop: document.scrollingElement?.scrollTop, bodyScrollTop: document.body?.scrollTop,
      scrollingElement: document.scrollingElement?.tagName, restoration: history.scrollRestoration,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      innerWidth, innerHeight, outerHeight: window.outerHeight,
      visualViewport: v ? { offsetTop: v.offsetTop, offsetLeft: v.offsetLeft,
        pageTop: v.pageTop, width: v.width, height: v.height, scale: v.scale } : null,
      html: box('html'), body: box('body'), root: box('[data-home-root]'),
      header: box('[data-home-header]'), hero: box('[data-home-hero]') };
    entries.push(entry);
    while (entries.length > limit) { const i = entries.findIndex(e => e.motion); entries.splice(i < 0 ? 0 : i, 1); }
    return entry;
  };
  const persist = () => {
    if (storage !== 'available') return;
    try { window.sessionStorage.setItem(key, JSON.stringify({ schema: 2, experiment, savedAt: Date.now(),
      documentCounter: documentId, sequence, entries, tapComparisons })); }
    catch { storage = 'unavailable'; }
  };
  const compare = (before, after, id) => {
    if (!before || !after) return;
    const value = (e, path) => path.split('.').reduce((v, k) => v?.[k], e);
    const paths = ['scrollY', 'scrollTop', 'bodyScrollTop', 'visualViewport.offsetTop', 'visualViewport.pageTop',
      'visualViewport.height', 'visualViewport.scale', 'html.top', 'body.top', 'root.top', 'header.top', 'hero.top'];
    const delta = Object.fromEntries(paths.map(path => { const a = value(before, path), b = value(after, path);
      return [path, typeof a === 'number' && typeof b === 'number' ? b - a : null]; }));
    tapComparisons.push({ documentId, tapId: id, beforeSequence: before.sequence, afterSequence: after.sequence, delta });
    if (tapComparisons.length > pairLimit) tapComparisons.shift();
  };
  const frames = (reason, done) => requestAnimationFrame(() => {
    capture('requestAnimationFrame:1', { reason });
    requestAnimationFrame(() => { const e = capture('requestAnimationFrame:2', { reason }); done?.(e); });
  });
  const report = () => {
    const recent = entries.filter(e => e.documentId === documentId && e.sequence >= latestResumeSeq);
    const count = (event, kind) => recent.filter(e => e.event === event && (!kind || e.detail?.targetKind === kind)).length;
    return { schema: 2, experiment, documentId, storage, retainedEntries: entries.length, limit,
      inputCoverage: { sinceSequence: latestResumeSeq, pagePointerDown: count('pointerdown:capture', 'page'),
        pagePointerUp: count('pointerup:capture', 'page'), pointerCancel: count('pointercancel:capture'),
        status: count('pointerdown:capture', 'page') ? 'page-pointer-observed' : 'no-page-pointer-observed',
        limitation: 'No observed page event does not prove no tap; compare with the user-reported native-app tap.' },
      entries: entries.slice(), tapComparisons: tapComparisons.slice() };
  };
  window.__sukoyakaHomeFlow = { experiment, entries, capture, persist, report,
    clear: () => { entries.length = 0; tapComparisons.length = 0; pointers.clear();
      try { window.sessionStorage.removeItem(key); } catch {} },
    pause: () => { paused = true; }, resume: () => { if (!paused) return; paused = false; capture('export-closed'); } };
  // Exactly one variable per experiment; baseline never writes scroll or layout state.
  if (experiment === 'manual') history.scrollRestoration = 'manual';
  if (experiment === 'instant') {
    const style = document.createElement('style');
    style.textContent = 'html:has([data-home-root]) { scroll-behavior: auto !important; }';
    document.head.appendChild(style);
  }
  capture('head');
  document.addEventListener('DOMContentLoaded', () => capture('DOMContentLoaded'), { once: true });
  window.addEventListener('load', () => capture('load'), { once: true });
  window.addEventListener('pageshow', e => {
    const entry = capture('pageshow', { persisted: e.persisted });
    if (entry) latestResumeSeq = entry.sequence;
    frames('pageshow');
  });
  window.addEventListener('pagehide', e => { capture('pagehide', { persisted: e.persisted }); persist(); });
  document.addEventListener('visibilitychange', () => {
    const entry = capture('visibilitychange', { state: document.visibilityState });
    if (document.visibilityState === 'hidden') persist();
    if (entry && document.visibilityState === 'visible') { latestResumeSeq = entry.sequence; frames('visible'); }
  });
  window.addEventListener('focus', () => { capture('focus'); frames('focus'); });
  window.addEventListener('resize', () => capture('resize'), { passive: true });
  document.addEventListener('freeze', () => { capture('freeze'); persist(); });
  document.addEventListener('resume', () => { capture('resume'); frames('resume'); });
  const motion = source => {
    if (!isHome() || paused) return;
    motionSources.add(source);
    if (motionPending) return;
    motionPending = true;
    requestAnimationFrame(() => { motionPending = false; capture('scroll', { sources: [...motionSources] }, true); motionSources.clear(); });
  };
  window.addEventListener('scroll', () => motion('window'), { passive: true });
  const v = window.visualViewport;
  v?.addEventListener('resize', () => capture('visualViewport:resize'), { passive: true });
  v?.addEventListener('scroll', () => motion('visualViewport'), { passive: true });
  const kind = target => target?.closest?.('a,button,input,select,textarea,summary,[role="button"],[contenteditable]') ? 'control' : 'page';
  document.addEventListener('pointerdown', e => {
    if (!isHome() || paused) return;
    const id = ++tapId, targetKind = kind(e.target);
    const before = capture('pointerdown:capture', { tapId: id, targetKind, pointerType: e.pointerType });
    pointers.set(e.pointerId, { id, before, targetKind });
  }, { capture: true, passive: true });
  document.addEventListener('pointerup', e => {
    const p = pointers.get(e.pointerId); pointers.delete(e.pointerId);
    if (!p || !isHome() || paused) return;
    capture('pointerup:capture', { tapId: p.id, targetKind: p.targetKind });
    frames('pointerup:' + p.id, after => { compare(p.before, after, p.id); persist(); });
  }, { capture: true, passive: true });
  document.addEventListener('pointercancel', e => { const p = pointers.get(e.pointerId); pointers.delete(e.pointerId);
    if (p) capture('pointercancel:capture', { tapId: p.id, targetKind: p.targetKind });
  }, { capture: true, passive: true });
})();
`;
