"use client";

import { useEffect } from "react";

/**
 * Mobile browsers restore the previous scroll offset during back/forward
 * navigation. Keep that restoration manual and reveal the home header only
 * when history navigation returns to the home page. Initial page loads and
 * ordinary taps/scrolling are intentionally untouched.
 */
export function MobileHomeHistoryPosition() {
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const revealHomeHeader = () => {
      if (window.location.pathname !== "/") return;

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    window.addEventListener("popstate", revealHomeHeader);

    return () => {
      window.removeEventListener("popstate", revealHomeHeader);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return null;
}
