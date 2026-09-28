"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * On mobile, browser/Next.js history restoration can reopen the home page just
 * below the header. Correct that restored position once, after navigation has
 * painted, without locking the page or interfering with normal touch scrolling.
 */
export function MobileHomeScrollTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname !== "/" ||
      !window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    let frame = 0;

    const scrollHomeToTop = () => {
      if (window.scrollY === 0) return;

      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      root.style.scrollBehavior = previousBehavior;
    };

    const restoreHeader = () => {
      scrollHomeToTop();
      frame = window.requestAnimationFrame(scrollHomeToTop);
    };

    restoreHeader();
    window.addEventListener("pageshow", restoreHeader);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", restoreHeader);
    };
  }, [pathname]);

  return null;
}
