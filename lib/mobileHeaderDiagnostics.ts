/** Temporary, opt-in diagnostics for the affected device. Never sends data. */
export const mobileHeaderDiagnostics = String.raw`
(() => {
  if (new URLSearchParams(location.search).get('header-debug') !== '1') return;
  const entries = [];
  const round = value => Math.round(value * 100) / 100;
  const rect = selector => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return { top: round(box.top), bottom: round(box.bottom), height: round(box.height),
      width: round(box.width), position: style.position, topStyle: style.top,
      transform: style.transform, marginTop: style.marginTop, paddingTop: style.paddingTop,
      overflowX: style.overflowX, overflowY: style.overflowY };
  };
  const capture = (event, detail) => {
    const viewport = window.visualViewport;
    entries.push({ event, at: round(performance.now()), detail,
      path: location.pathname, hash: location.hash, ready: document.readyState,
      scrollY: window.scrollY, htmlScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body?.scrollTop, scroller: document.scrollingElement?.tagName,
      innerWidth: window.innerWidth, innerHeight: window.innerHeight,
      visualViewport: viewport ? { offsetTop: viewport.offsetTop, pageTop: viewport.pageTop,
        height: viewport.height, width: viewport.width, scale: viewport.scale } : null,
      html: rect('html'), body: rect('body'), header: rect('.site-header'),
      panel: rect('.storybook-header-panel'), logo: rect('.storybook-mobile-brand-art'),
      nav: rect('.storybook-main-nav'), main: rect('main'),
      activeElement: document.activeElement?.tagName,
      overflow: document.documentElement.scrollWidth > window.innerWidth });
    if (entries.length > 100) entries.shift();
  };
  window.__sukoyakaHeaderDebug = { entries, capture, userAgent: navigator.userAgent };
  const trace = (target, name) => {
    const original = target[name];
    if (typeof original !== 'function') return;
    target[name] = function(...args) {
      capture('call:' + name, { target: this === window ? 'window' : this.tagName,
        stack: new Error().stack?.split('\n').slice(2, 6).join('\n') });
      return original.apply(this, args);
    };
  };
  trace(window, 'scrollTo');
  trace(Element.prototype, 'scrollTo');
  trace(Element.prototype, 'scrollIntoView');
  trace(HTMLElement.prototype, 'focus');
  capture('head');
  document.addEventListener('DOMContentLoaded', () => capture('DOMContentLoaded'), { once: true });
  window.addEventListener('load', () => capture('load'), { once: true });
  window.addEventListener('pageshow', event => {
    capture('pageshow', { persisted: event.persisted });
    requestAnimationFrame(() => {
      capture('pageshow:frame1');
      requestAnimationFrame(() => capture('pageshow:frame2'));
    });
  });
  window.addEventListener('scroll', () => capture('window:scroll'), { passive: true });
  document.addEventListener('scroll', event => {
    if (event.target !== document) capture('element:scroll', { target: event.target.tagName });
  }, { capture: true, passive: true });
  window.addEventListener('resize', () => capture('window:resize'), { passive: true });
  window.visualViewport?.addEventListener('scroll', () => capture('viewport:scroll'), { passive: true });
  window.visualViewport?.addEventListener('resize', () => capture('viewport:resize'), { passive: true });
})();
`;
