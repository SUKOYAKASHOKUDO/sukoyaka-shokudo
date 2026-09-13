"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/** Keep the mobile header visible after every page navigation/history return.
 * No markup, styles or desktop scroll behavior are changed.
 */
export function MobileHomeScrollReset() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let settleTimer = 0;
    let guarding = false;
    let previousBehavior = "";
    let previousAnchor = "";
    const root = document.documentElement;
    const userEvents = ["touchstart", "pointerdown", "wheel", "keydown"] as const;

    const isMobilePage = () =>
      window.matchMedia("(max-width: 767px)").matches;

    const keepHeaderVisible = () => {
      if (guarding && isMobilePage() && window.scrollY !== 0) {
        // Explicit auto on the root also works on browsers without "instant".
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    const stopGuard = () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", keepHeaderVisible);
      userEvents.forEach((event) => window.removeEventListener(event, stopGuard));
      if (guarding) {
        root.style.scrollBehavior = previousBehavior;
        root.style.overflowAnchor = previousAnchor;
        guarding = false;
      }
    };

    const restoreHeader = () => {
      if (!isMobilePage()) return;
      stopGuard();
      previousBehavior = root.style.scrollBehavior;
      previousAnchor = root.style.overflowAnchor;
      guarding = true;
      root.style.scrollBehavior = "auto";
      root.style.overflowAnchor = "none";
      window.addEventListener("scroll", keepHeaderVisible, { passive: true });
      userEvents.forEach((event) =>
        window.addEventListener(event, stopGuard, { passive: true }),
      );
      keepHeaderVisible();
      // Cover router focus, delayed history restoration and image anchoring,
      // but never hold the reader at the top once they interact.
      firstFrame = requestAnimationFrame(() => {
        keepHeaderVisible();
        secondFrame = requestAnimationFrame(keepHeaderVisible);
      });
      settleTimer = window.setTimeout(stopGuard, 1500);
    };

    const navigateWithoutScroll = (event: MouseEvent) => {
      if (
        event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        !window.matchMedia("(max-width: 767px)").matches ||
        !(event.target instanceof Element)
      ) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") ||
        (link.target && link.target !== "_self")) return;
      const target = new URL(link.href, window.location.href);
      if (target.origin !== window.location.origin || target.hash) return;

      // Capture before Next Link can scroll to the first page content node.
      event.preventDefault();
      router.push(`${target.pathname}${target.search}`, { scroll: false });
      restoreHeader();
    };

    restoreHeader();
    document.addEventListener("click", navigateWithoutScroll, true);
    window.addEventListener("popstate", restoreHeader);
    window.addEventListener("pageshow", restoreHeader);

    return () => {
      stopGuard();
      document.removeEventListener("click", navigateWithoutScroll, true);
      window.removeEventListener("popstate", restoreHeader);
      window.removeEventListener("pageshow", restoreHeader);
    };
  }, [pathname, router]);

  return null;
}
