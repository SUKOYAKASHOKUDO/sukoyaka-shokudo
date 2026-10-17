export type HomePreviewMode = "baseline" | "manual" | "instant";

/** Called only behind the Preview environment gate. Unknown values are inert. */
export function getHomePreviewMode(pathname: string, search: string): HomePreviewMode {
  if (pathname !== "/") return "baseline";
  const mode = new URLSearchParams(search).get("home-test");
  return mode === "manual" || mode === "instant" ? mode : "baseline";
}

/** Preview-only, one variable at a time. No scrolling, reloads, or repaint hacks. */
export const homePreviewPolicy = String.raw`
(() => {
  if (location.pathname !== '/') return;
  const mode = new URLSearchParams(location.search).get('home-test');
  if (mode === 'manual' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (mode === 'instant') {
    const style = document.createElement('style');
    style.textContent = 'html:has([data-home-root]) { scroll-behavior: auto !important; }';
    document.head.appendChild(style);
  }
})();
`;
