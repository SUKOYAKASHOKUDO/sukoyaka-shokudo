"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Mobile browsers restore the previous scroll offset during back/forward
 * navigation. Keep that restoration manual and reveal the home header only
 * when history navigation returns to the home page. Initial page loads and
 * ordinary taps/scrolling are intentionally untouched.
 */
export function MobileHomeHistoryPosition() {
  const pathname = usePathname();
  const returningHome = useRef(false);
  const frames = useRef<number[]>([]);
  const timers = useRef<number[]>([]);

  const clearScheduledRestores = useCallback(() => {
    frames.current.forEach((frame) => window.cancelAnimationFrame(frame));
    timers.current.forEach((timer) => window.clearTimeout(timer));
    frames.current = [];
    timers.current = [];
  }, []);

  const revealHomeHeader = useCallback(() => {
    if (window.location.pathname !== "/") return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    root.scrollTop = 0;
    document.body.scrollTop = 0;
    root.style.scrollBehavior = previousBehavior;
  }, []);

  const finishHomeReturn = useCallback(() => {
    if (!returningHome.current || window.location.pathname !== "/") return;

    clearScheduledRestores();
    revealHomeHeader();

    const firstFrame = window.requestAnimationFrame(() => {
      revealHomeHeader();
      const secondFrame = window.requestAnimationFrame(revealHomeHeader);
      frames.current.push(secondFrame);
    });
    frames.current.push(firstFrame);

    [80, 280, 800].forEach((delay) => {
      timers.current.push(window.setTimeout(revealHomeHeader, delay));
    });
  }, [clearScheduledRestores, revealHomeHeader]);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const markHistoryReturn = () => {
      if (window.location.pathname !== "/") return;

      returningHome.current = true;
      finishHomeReturn();
    };

    const markHomeLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin === window.location.origin &&
        destination.pathname === "/" &&
        window.location.pathname !== "/"
      ) {
        returningHome.current = true;
      }
    };

    const finishRestoredPage = (event: PageTransitionEvent) => {
      if (!event.persisted || window.location.pathname !== "/") return;

      returningHome.current = true;
      finishHomeReturn();
    };

    document.addEventListener("click", markHomeLink, true);
    window.addEventListener("popstate", markHistoryReturn);
    window.addEventListener("pageshow", finishRestoredPage);

    return () => {
      clearScheduledRestores();
      document.removeEventListener("click", markHomeLink, true);
      window.removeEventListener("popstate", markHistoryReturn);
      window.removeEventListener("pageshow", finishRestoredPage);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [clearScheduledRestores, finishHomeReturn]);

  useLayoutEffect(() => {
    if (pathname !== "/" || !returningHome.current) return;

    finishHomeReturn();
    returningHome.current = false;
  }, [finishHomeReturn, pathname]);

  return null;
}
