"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Keep mobile returns to the home page at the document top. Link navigation is
 * left to Next.js; history navigation is corrected after the browser has had a
 * chance to restore its persisted scroll position.
 */
export function MobileHomeHistoryPosition() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const historyReturnPending = useRef(false);
  const historyRestoreTimer = useRef<number | null>(null);

  const revealHomeHeader = useCallback(() => {
    if (
      window.location.pathname !== "/" ||
      !window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    const root = document.documentElement;
    const previousBehavior = root.style.getPropertyValue("scroll-behavior");
    const previousPriority = root.style.getPropertyPriority("scroll-behavior");

    root.style.setProperty("scroll-behavior", "auto", "important");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (previousBehavior) {
      root.style.setProperty(
        "scroll-behavior",
        previousBehavior,
        previousPriority,
      );
    } else {
      root.style.removeProperty("scroll-behavior");
    }
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const restoreHistoryHome = () => {
      if (window.location.pathname !== "/") return;

      historyReturnPending.current = true;
      if (historyRestoreTimer.current !== null) {
        window.clearTimeout(historyRestoreTimer.current);
      }

      // `popstate` runs before persisted scroll state is restored. Defer this
      // single correction until that history-traversal step has completed.
      historyRestoreTimer.current = window.setTimeout(() => {
        revealHomeHeader();
        historyReturnPending.current = false;
        historyRestoreTimer.current = null;
      }, 0);
    };

    const restoreCachedHome = (event: PageTransitionEvent) => {
      if (event.persisted) restoreHistoryHome();
    };

    window.addEventListener("popstate", restoreHistoryHome);
    window.addEventListener("pageshow", restoreCachedHome);

    return () => {
      if (historyRestoreTimer.current !== null) {
        window.clearTimeout(historyRestoreTimer.current);
      }
      window.removeEventListener("popstate", restoreHistoryHome);
      window.removeEventListener("pageshow", restoreCachedHome);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [revealHomeHeader]);

  useLayoutEffect(() => {
    const previous = previousPathname.current;
    previousPathname.current = pathname;

    if (
      pathname !== "/" ||
      previous === "/" ||
      historyReturnPending.current ||
      !window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    revealHomeHeader();
  }, [pathname, revealHomeHeader]);

  return null;
}
