"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

/**
 * Next.js keeps the root scrolling element mounted between App Router pages.
 * Reset that actual scroller once, before paint, whenever the pathname changes.
 * This also covers back/forward navigation without timers or repeated scrollTo.
 */
export function RouteScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
  }, [pathname]);

  useEffect(() => {
    // A mobile browser can restore its initial offset after hydration, at
    // pageshow. Finish the initial home reset after that restoration step.
    // Client-side navigation and persisted back/forward pages keep their
    // existing behavior; never pull a visitor back after they start scrolling.
    if (
      window.location.pathname !== "/" ||
      window.location.hash ||
      !window.matchMedia("(max-width: 767px)").matches
    ) return;

    let frame = 0;
    const cancel = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("keydown", cancel);
    };
    const finishInitialReset = () => {
      frame = requestAnimationFrame(() => {
        if (
          window.location.pathname === "/" &&
          !window.location.hash &&
          window.matchMedia("(max-width: 767px)").matches
        ) {
          document.scrollingElement?.scrollTo({ top: 0, behavior: "instant" });
        }
        cancel();
      });
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) cancel();
      else finishInitialReset();
    };

    window.addEventListener("pointerdown", cancel, { passive: true });
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    if (document.readyState === "complete") finishInitialReset();
    else window.addEventListener("pageshow", onPageShow, { once: true });

    return cancel;
  }, []);

  return null;
}
