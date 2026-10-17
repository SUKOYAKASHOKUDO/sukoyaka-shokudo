/** Preview-only, explicitly requested, read-only observations. No telemetry. */
export const homeFlowDiagnostics = String.raw`
(() => {
  if (location.pathname !== '/' || new URLSearchParams(location.search).get('home-debug') !== '1') return;
  const entries = [];
  const box = selector => {
    const e = document.querySelector(selector);
    if (!e) return null;
    const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return { top: r.top, bottom: r.bottom, left: r.left, width: r.width, height: r.height,
      scrollTop: e.scrollTop, scrollLeft: e.scrollLeft, scrollHeight: e.scrollHeight, clientHeight: e.clientHeight,
      position: s.position, transform: s.transform, overflowX: s.overflowX, overflowY: s.overflowY };
  };
  const capture = (event, detail) => {
    const v = window.visualViewport;
    entries.push({ event, detail, at: performance.now(), ready: document.readyState,
      scrollY: window.scrollY, scrollTop: document.scrollingElement?.scrollTop,
      scrollingElement: document.scrollingElement?.tagName, restoration: history.scrollRestoration,
      innerWidth, innerHeight, visualViewport: v ? { offsetTop: v.offsetTop, offsetLeft: v.offsetLeft,
        pageTop: v.pageTop, width: v.width, height: v.height, scale: v.scale } : null,
      html: box('html'), body: box('body'), root: box('[data-home-root]'),
      header: box('[data-home-header]'), hero: box('[data-home-hero]'), main: box('main') });
    if (entries.length > 150) entries.shift();
  };
  window.__sukoyakaHomeFlow = { entries, capture, userAgent: navigator.userAgent };
  capture('head');
  document.addEventListener('DOMContentLoaded', () => capture('DOMContentLoaded'), { once: true });
  window.addEventListener('load', () => capture('load'), { once: true });
  window.addEventListener('pageshow', e => {
    capture('pageshow', { persisted: e.persisted });
    requestAnimationFrame(() => { capture('pageshow:frame1'); requestAnimationFrame(() => capture('pageshow:frame2')); });
  });
  window.addEventListener('resize', () => capture('resize'), { passive: true });
  window.addEventListener('scroll', () => capture('scroll'), { passive: true });
  const v = window.visualViewport;
  v?.addEventListener('resize', () => capture('visualViewport:resize'), { passive: true });
  v?.addEventListener('scroll', () => capture('visualViewport:scroll'), { passive: true });
})();
`;
