export interface YahooEntryDiagnosticStatus {
  storageAvailable: boolean;
  enabled: boolean;
  expiresAt: number | null;
  events: number;
  documents: number;
  bytes: number;
  report: string;
}

export interface YahooEntryDiagnosticManager {
  read: () => YahooEntryDiagnosticStatus;
  enable: () => YahooEntryDiagnosticStatus;
  stop: () => YahooEntryDiagnosticStatus;
  clear: () => YahooEntryDiagnosticStatus;
}

declare global {
  interface Window {
    __sukoyakaEntryManager?: YahooEntryDiagnosticManager;
    __sukoyakaEntryDiagnostic?: {
      capture: (event: "route-layout-effect:before" | "route-layout-effect:after") => void;
    };
  }
}

/** Temporary observation only. The inactive path ends before any instrumentation. */
export const yahooEntryDiagnostics = String.raw`
(() => {
  if (location.pathname !== '/') return;
  const flagKey = 'sukoyaka:entry-diagnostic:consent:v1';
  const logKey = 'sukoyaka:entry-diagnostic:log:v1';
  const ttl = 30 * 60 * 1000;
  const valid = c => c && c.version === 1 && Number.isSafeInteger(c.enabledAt)
    && Number.isSafeInteger(c.expiresAt) && c.expiresAt - c.enabledAt === ttl
    && c.enabledAt <= Date.now() && Date.now() < c.expiresAt;
  let management = false, storage, consent = null;
  try {
    management = new URLSearchParams(location.search).get('entry-diagnostics') === 'manage';
    if (!management) {
      storage = window.localStorage;
      consent = JSON.parse(storage.getItem(flagKey) || 'null');
      if (!valid(consent)) return;
    }
  } catch { return; }
  if (!management && window.__sukoyakaEntryDiagnostic) return;

  // Everything below is limited to explicit management or a valid, local opt-in.
  const maxEvents = 160, maxBytes = 160 * 1024;
  let encoder;
  try { encoder = new TextEncoder(); } catch { return; }
  let storageAvailable = true;
  const number = v => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) < 1e12
    ? Math.round(v * 1000) / 1000 : null;
  const integer = v => Number.isSafeInteger(v) && v >= 0 && v < 1e9 ? v : null;
  const timestamp = v => Number.isFinite(v) && v >= 0 && v < 1e13 ? Math.round(v) : null;
  const choice = (v, values) => values.includes(v) ? v : null;
  const pickNumbers = (source, keys) => Object.fromEntries(keys.map(k => [k, number(source?.[k])]));
  const rectKeys = ['top', 'left', 'width', 'height', 'bottom', 'right'];
  const viewportKeys = ['offsetTop', 'offsetLeft', 'pageTop', 'pageLeft', 'width', 'height', 'scale'];
  const selectors = { html: 'html', body: 'body', root: '[data-home-root]',
    header: '[data-home-header]', main: 'main#main', hero: '[data-home-hero]' };
  const hitNames = ['header', 'hero', 'main', 'root', 'html', 'body', 'other', 'none'];
  const transform = value => {
    if (value === 'none') return value;
    if (typeof value !== 'string' || value.length > 512) return null;
    const match = /^(matrix|matrix3d)\(([-+.\deE,\s]+)\)$/.exec(value);
    if (!match) return null;
    const values = match[2].split(',').map(v => v.trim() ? number(Number(v)) : null);
    return values.length === (match[1] === 'matrix' ? 6 : 16) && values.every(v => v !== null)
      ? match[1] + '(' + values.join(',') + ')' : null;
  };
  const style = source => source ? {
    transform: transform(source.transform),
    position: choice(source.position, ['static', 'relative', 'absolute', 'fixed', 'sticky']),
    overflowX: choice(source.overflowX, ['visible', 'hidden', 'clip', 'scroll', 'auto', 'overlay']),
    overflowY: choice(source.overflowY, ['visible', 'hidden', 'clip', 'scroll', 'auto', 'overlay'])
  } : null;
  const navKeys = ['redirectCount', 'redirectStart', 'redirectEnd', 'activationStart',
    'fetchStart', 'responseStart', 'responseEnd', 'domInteractive',
    'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'loadEventStart', 'loadEventEnd'];
  const eventNames = ['head', 'DOMContentLoaded', 'load', 'pageshow', 'pagehide',
    'pageshow:rAF1', 'pageshow:rAF2', 'visibilitychange', 'resize', 'window:scroll',
    'visualViewport:resize', 'visualViewport:scroll', 'freeze', 'resume',
    'route-layout-effect:before', 'route-layout-effect:after', 'pointerdown:capture',
    'pointerup:after', 'pointerup:rAF1', 'pointerup:rAF2', 'pointercancel'];
  const referrers = ['Yahoo', 'same-origin', 'other', 'unknown'];
  const sanitize = r => {
    if (!r || !eventNames.includes(r.event) || integer(r.sequence) === null || integer(r.document) === null) return null;
    return { event: r.event, sequence: r.sequence, document: r.document, at: number(r.at),
      schema: r.schema === 2 ? 2 : null, wallTime: timestamp(r.wallTime), timeOrigin: timestamp(r.timeOrigin),
      ready: choice(r.ready, ['loading', 'interactive', 'complete']),
      visibility: choice(r.visibility, ['hidden', 'visible', 'prerender']),
      scrollY: number(r.scrollY), scrollTop: number(r.scrollTop), bodyScrollTop: number(r.bodyScrollTop),
      restoration: choice(r.restoration, ['auto', 'manual']),
      scrollBehavior: choice(r.scrollBehavior, ['auto', 'smooth']),
      devicePixelRatio: number(r.devicePixelRatio), fonts: choice(r.fonts, ['loading', 'loaded']),
      innerWidth: number(r.innerWidth), innerHeight: number(r.innerHeight),
      viewport: r.viewport ? pickNumbers(r.viewport, viewportKeys) : null,
      boxes: Object.fromEntries(Object.keys(selectors).map(k =>
        [k, r.boxes?.[k] ? pickNumbers(r.boxes[k], rectKeys) : null])),
      styles: Object.fromEntries(Object.keys(selectors).map(k => [k, style(r.styles?.[k])])),
      hits: Object.fromEntries(['top', 'top16', 'middle', 'bottom'].map(k => [k, choice(r.hits?.[k], hitNames)])),
      geometry: choice(r.geometry, ['sampled', 'not-sampled-in-head']),
      navigation: r.navigation ? { type: choice(r.navigation.type, ['navigate', 'reload', 'back_forward', 'prerender']),
        ...pickNumbers(r.navigation, navKeys) } : null,
      referrer: choice(r.referrer, referrers),
      arrival: { hasQuery: r.arrival?.hasQuery === true, hasFragment: r.arrival?.hasFragment === true },
      persisted: typeof r.persisted === 'boolean' ? r.persisted : null,
      tap: r.tap ? { id: integer(r.tap.id), kind: choice(r.tap.kind, ['page', 'control']),
        pointerType: choice(r.tap.pointerType, ['touch', 'mouse', 'pen', 'unknown']),
        lastObservedBeforeSequence: integer(r.tap.lastObservedBeforeSequence),
        downSequence: integer(r.tap.downSequence) } : null };
  };
  const envelope = (c, lastDocument, events) => ({ version: 1, enabledAt: c.enabledAt,
    expiresAt: c.expiresAt, lastDocument, events,
    limitations: ['Zero redirect timing does not exclude cross-origin redirects.',
      'Pointer capture may follow native-app updates; missing input does not prove no tap.',
      'Route markers identify useLayoutEffect only, not completion of React hydration.',
      'Geometry, computed-style and hit-test reads can change rendering timing.',
      'Web APIs cannot measure native View bounds, parent translation/clip, WindowInsets or compositor surface offsets.',
      'Hit tests report DOM ownership at fixed CSS viewport points, not visible pixels or native bounds.',
      'Only schema=2 entries contain the extended measurements; missing or older values are null.'] });
  const bytes = text => encoder.encode(text).byteLength;
  const trim = (c, lastDocument, events) => {
    while (events.length > maxEvents) events.shift();
    let text = JSON.stringify(envelope(c, lastDocument, events));
    while (bytes(text) > maxBytes && events.length) {
      events.shift(); text = JSON.stringify(envelope(c, lastDocument, events));
    }
    return text;
  };
  const getStorage = () => storage || (storage = window.localStorage);
  const getConsent = () => {
    const c = JSON.parse(getStorage().getItem(flagKey) || 'null');
    return valid(c) ? { version: 1, enabledAt: c.enabledAt, expiresAt: c.expiresAt } : null;
  };
  const readLog = () => {
    const raw = getStorage().getItem(logKey);
    if (!raw) return null;
    if (bytes(raw) > maxBytes) { getStorage().removeItem(logKey); return null; }
    let p;
    try { p = JSON.parse(raw); } catch { getStorage().removeItem(logKey); return null; }
    if (p?.version !== 1 || !valid(p) || integer(p.lastDocument) === null || !Array.isArray(p.events)) {
      getStorage().removeItem(logKey); return null;
    }
    return { version: 1, enabledAt: p.enabledAt, expiresAt: p.expiresAt, lastDocument: p.lastDocument,
      events: p.events.slice(-maxEvents).map(sanitize).filter(Boolean) };
  };

  if (management) {
    const unavailable = () => ({ storageAvailable: false, enabled: false, expiresAt: null,
      events: 0, documents: 0, bytes: 0, report: '' });
    const read = () => {
      try {
        const c = getConsent(), log = readLog();
        const report = log ? trim(log, log.lastDocument, log.events) : '';
        storageAvailable = true;
        return { storageAvailable, enabled: !!c, expiresAt: c?.expiresAt ?? log?.expiresAt ?? null,
          events: log?.events.length || 0, documents: log?.lastDocument || 0, bytes: bytes(report), report };
      } catch {
        storageAvailable = false;
        return { storageAvailable, enabled: false, expiresAt: null, events: 0, documents: 0, bytes: 0, report: '' };
      }
    };
    const stop = () => {
      try { getStorage().removeItem(flagKey); } catch { return unavailable(); }
      return read();
    };
    window.__sukoyakaEntryManager = { read,
      enable: () => {
        try {
          const enabledAt = Date.now();
          getStorage().removeItem(logKey);
          getStorage().setItem(flagKey, JSON.stringify({ version: 1, enabledAt, expiresAt: enabledAt + ttl }));
        } catch {
          try { getStorage().removeItem(flagKey); } catch {}
          return { storageAvailable: false, enabled: false, expiresAt: null, events: 0, documents: 0, bytes: 0, report: '' };
        }
        return read();
      }, stop,
      clear: () => {
        const state = stop();
        if (!state.storageAvailable) return state;
        try { getStorage().removeItem(logKey); } catch { return unavailable(); }
        return read();
      }
    };
    return; // Management visits never install measurement listeners or collect snapshots.
  }

  let active = true, expiryTimer = null, motionFrame = null;
  const removers = [], frames = new Set(), pointers = new Map();
  let events = [], lastDocument = 0, sequence = 0, tapId = 0;
  const stop = () => {
    if (!active) return;
    active = false;
    for (const remove of removers.splice(0)) { try { remove(); } catch {} }
    if (expiryTimer !== null) clearTimeout(expiryTimer);
    for (const id of frames) cancelAnimationFrame(id);
    frames.clear(); pointers.clear(); motionFrame = null;
    delete window.__sukoyakaEntryDiagnostic;
  };
  const expireOwnData = () => {
    try {
      const current = JSON.parse(getStorage().getItem(flagKey) || 'null');
      if (current?.enabledAt === consent.enabledAt && current?.expiresAt === consent.expiresAt) getStorage().removeItem(flagKey);
      const saved = JSON.parse(getStorage().getItem(logKey) || 'null');
      if (saved?.enabledAt === consent.enabledAt && saved?.expiresAt === consent.expiresAt) getStorage().removeItem(logKey);
    } catch {}
  };
  const allowed = () => {
    if (!active) return false;
    if (!valid(consent)) { stop(); expireOwnData(); return false; }
    try {
      const c = getConsent();
      if (!c || c.enabledAt !== consent.enabledAt || c.expiresAt !== consent.expiresAt) { stop(); return false; }
    } catch { stop(); return false; }
    return true;
  };
  const persist = () => {
    if (!allowed()) return;
    try { getStorage().setItem(logKey, trim(consent, lastDocument, events)); }
    catch { stop(); try { getStorage().removeItem(flagKey); } catch {} }
  };
  try {
    const saved = readLog();
    if (saved?.enabledAt === consent.enabledAt && saved?.expiresAt === consent.expiresAt) {
      events = saved.events; lastDocument = saved.lastDocument;
      sequence = events.reduce((n, r) => Math.max(n, r.sequence), 0);
    }
  } catch { return; }
  lastDocument += 1;
  const documentId = lastDocument;
  let referrer = 'unknown';
  try {
    if (document.referrer) {
      const u = new URL(document.referrer);
      referrer = u.origin === location.origin ? 'same-origin'
        : u.hostname === 'yahoo.co.jp' || u.hostname.endsWith('.yahoo.co.jp') ? 'Yahoo' : 'other';
    }
  } catch {}
  const box = element => {
    try { return element ? pickNumbers(element.getBoundingClientRect(), rectKeys) : null; }
    catch { return null; }
  };
  const computed = element => {
    try { return element ? style(getComputedStyle(element)) : null; } catch { return null; }
  };
  const hit = (x, y) => {
    if (typeof document.elementFromPoint !== 'function') return null;
    try {
      const element = document.elementFromPoint(x, y);
      if (!element) return 'none';
      for (const key of ['header', 'hero', 'main', 'root']) {
        if (element.closest?.(selectors[key])) return key;
      }
      return element === document.body ? 'body' : element === document.documentElement ? 'html' : 'other';
    } catch { return null; }
  };
  const capture = (event, detail = {}) => {
    if (location.pathname !== '/') { persist(); stop(); return null; }
    if (!allowed() || !eventNames.includes(event)) return null;
    try {
      // No geometry/style flush during HTML parsing. Later event snapshots include the actual boxes.
      const geometry = event !== 'head';
      const nav = performance.getEntriesByType?.('navigation')?.[0];
      const elements = geometry ? Object.fromEntries(Object.entries(selectors).map(([k, s]) => [k, document.querySelector(s)])) : {};
      const x = Math.max(0, (window.innerWidth - 1) / 2), bottom = Math.max(0, window.innerHeight - 1);
      const entry = sanitize({ event, sequence: ++sequence, document: documentId, at: performance.now(),
        schema: 2, wallTime: Date.now(), timeOrigin: performance.timeOrigin,
        ready: document.readyState, visibility: document.visibilityState,
        scrollY: window.scrollY, scrollTop: document.scrollingElement?.scrollTop, bodyScrollTop: document.body?.scrollTop,
        restoration: history.scrollRestoration,
        scrollBehavior: geometry ? getComputedStyle(document.documentElement).scrollBehavior : null,
        devicePixelRatio: window.devicePixelRatio, fonts: document.fonts?.status,
        innerWidth: window.innerWidth, innerHeight: window.innerHeight,
        viewport: window.visualViewport ? pickNumbers(window.visualViewport, viewportKeys) : null,
        boxes: geometry ? Object.fromEntries(Object.entries(elements).map(([k, e]) => [k, box(e)])) : {},
        styles: geometry ? Object.fromEntries(Object.entries(elements).map(([k, e]) => [k, computed(e)])) : {},
        hits: geometry ? { top: hit(x, 0), top16: hit(x, Math.min(16, bottom)),
          middle: hit(x, bottom / 2), bottom: hit(x, bottom) } : {},
        geometry: geometry ? 'sampled' : 'not-sampled-in-head',
        navigation: nav ? { type: nav.type, ...pickNumbers(nav, navKeys) } : null,
        referrer, arrival: { hasQuery: !!location.search, hasFragment: !!location.hash },
        persisted: detail.persisted, tap: detail.tap });
      events.push(entry); trim(consent, lastDocument, events);
      return entry;
    } catch { stop(); return null; }
  };
  const listen = (target, event, handler, options) => {
    if (!target?.addEventListener) return;
    target.addEventListener(event, handler, options);
    removers.push(() => target.removeEventListener(event, handler, options));
  };
  const frame = callback => {
    if (!active || typeof requestAnimationFrame !== 'function') return;
    const id = requestAnimationFrame(() => { frames.delete(id); if (allowed()) callback(); });
    frames.add(id);
  };
  const afterFrames = (prefix, detail) => frame(() => {
    capture(prefix + ':rAF1', detail);
    frame(() => { capture(prefix + ':rAF2', detail); persist(); });
  });
  const kind = target => target?.closest?.('a,button,input,textarea,select,summary,[role="button"],[contenteditable]') ? 'control' : 'page';
  window.__sukoyakaEntryDiagnostic = {
    capture: event => { if (event === 'route-layout-effect:before' || event === 'route-layout-effect:after') capture(event); }
  };
  try {
    listen(document, 'DOMContentLoaded', () => { capture('DOMContentLoaded'); persist(); }, { once: true });
    listen(window, 'load', () => { capture('load'); persist(); }, { once: true });
    listen(window, 'pageshow', e => { capture('pageshow', { persisted: e.persisted }); afterFrames('pageshow'); });
    listen(window, 'pagehide', e => { capture('pagehide', { persisted: e.persisted }); persist(); });
    listen(document, 'visibilitychange', () => { capture('visibilitychange'); if (document.visibilityState === 'hidden') persist(); });
    listen(window, 'resize', () => capture('resize'), { passive: true });
    listen(window.visualViewport, 'resize', () => capture('visualViewport:resize'), { passive: true });
    const motion = event => {
      if (!allowed() || motionFrame !== null) return;
      motionFrame = true;
      frame(() => { motionFrame = null; capture(event); });
    };
    listen(window, 'scroll', () => motion('window:scroll'), { passive: true });
    listen(window.visualViewport, 'scroll', () => motion('visualViewport:scroll'), { passive: true });
    listen(document, 'freeze', () => { capture('freeze'); persist(); });
    listen(document, 'resume', () => capture('resume'));
    listen(window, 'storage', e => { if (e.key === flagKey || e.key === null) allowed(); });
    listen(document, 'pointerdown', e => {
      if (!allowed() || location.pathname !== '/') return;
      const tap = { id: ++tapId, kind: kind(e.target),
        pointerType: choice(e.pointerType, ['touch', 'mouse', 'pen']) || 'unknown',
        lastObservedBeforeSequence: events.at(-1)?.sequence ?? null, downSequence: null };
      const down = capture('pointerdown:capture', { tap });
      if (down && pointers.size < 8) { tap.downSequence = down.sequence; pointers.set(e.pointerId, tap); }
    }, { capture: true, passive: true });
    listen(document, 'pointerup', e => {
      const tap = pointers.get(e.pointerId); pointers.delete(e.pointerId);
      if (!tap) return;
      capture('pointerup:after', { tap }); afterFrames('pointerup', { tap });
    }, { capture: true, passive: true });
    listen(document, 'pointercancel', e => {
      const tap = pointers.get(e.pointerId); pointers.delete(e.pointerId);
      if (tap) capture('pointercancel', { tap });
    }, { capture: true, passive: true });
    expiryTimer = setTimeout(() => { if (!valid(consent)) { stop(); expireOwnData(); } }, Math.max(0, consent.expiresAt - Date.now()));
    capture('head'); persist();
  } catch { stop(); }
})();
`;
