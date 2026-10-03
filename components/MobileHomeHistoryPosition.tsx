"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * On mobile, prevent Next.js/browser scroll restoration from reopening the
 * home page below its header. HOME-link navigation is performed without
 * automatic scrolling, then the completed route transition is placed at the
 * document top. Desktop behavior and ordinary mobile scrolling are untouched.
 */
export function MobileHomeHistoryPosition() {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathname = useRef(pathname);
  const frames = useRef<number[]>([]);
  const timers = useRef<number[]>([]);

  const clearScheduledRestores = useCallback(() => {
    frames.current.forEach((frame) => window.cancelAnimationFrame(frame));
    timers.current.forEach((timer) => window.clearTimeout(timer));
    frames.current = [];
    timers.current = [];
  }, []);

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
    document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.scrollTop = 0;
    document.body.scrollTop = 0;

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

  const finishHomeReturn = useCallback(() => {
    if (window.location.pathname !== "/") return;

    clearScheduledRestores();
    revealHomeHeader();

    const firstFrame = window.requestAnimationFrame(() => {
      revealHomeHeader();
      const secondFrame = window.requestAnimationFrame(revealHomeHeader);
      frames.current.push(secondFrame);
    });
    frames.current.push(firstFrame);

    [0, 100, 300].forEach((delay) => {
      timers.current.push(window.setTimeout(revealHomeHeader, delay));
    });
  }, [clearScheduledRestores, revealHomeHeader]);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const navigateHomeWithoutFrameworkScroll = (event: MouseEvent) => {
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
        destination.origin !== window.location.origin ||
        destination.pathname !== "/" ||
        destination.hash ||
        window.location.pathname === "/"
      ) {
        return;
      }

      event.preventDefault();
      router.push(`${destination.pathname}${destination.search}`, {
        scroll: false,
      });
    };

    const restoreHistoryHome = () => {
      if (window.location.pathname === "/") {
        finishHomeReturn();
      }
    };

    const finishRestoredPage = (event: PageTransitionEvent) => {
      if (event.persisted && window.location.pathname === "/") {
        finishHomeReturn();
      }
    };

    document.addEventListener("click", navigateHomeWithoutFrameworkScroll, true);
    window.addEventListener("popstate", restoreHistoryHome);
    window.addEventListener("pageshow", finishRestoredPage);
    window.addEventListener("touchstart", clearScheduledRestores, {
      passive: true,
    });

    return () => {
      clearScheduledRestores();
      document.removeEventListener(
        "click",
        navigateHomeWithoutFrameworkScroll,
        true,
      );
      window.removeEventListener("popstate", restoreHistoryHome);
      window.removeEventListener("pageshow", finishRestoredPage);
      window.removeEventListener("touchstart", clearScheduledRestores);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [clearScheduledRestores, finishHomeReturn, router]);

  useLayoutEffect(() => {
    const previous = previousPathname.current;
    previousPathname.current = pathname;

    if (
      pathname !== "/" ||
      previous === "/" ||
      !window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    finishHomeReturn();
  }, [finishHomeReturn, pathname]);

  return null;
}
