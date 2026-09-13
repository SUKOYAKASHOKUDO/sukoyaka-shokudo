"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Keep the mobile home header visible after navigation and history returns.
 * No markup, styles or desktop scroll behavior are changed.
 */
export function MobileHomeScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;

    const restoreHomeHeader = () => {
      if (
        window.location.pathname !== "/" ||
        !window.matchMedia("(max-width: 767px)").matches
      ) {
        return;
      }

      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      // Run after the router and browser finish their scroll restoration.
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          if (
            window.location.pathname === "/" &&
            window.matchMedia("(max-width: 767px)").matches
          ) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
        });
      });
    };

    restoreHomeHeader();
    window.addEventListener("popstate", restoreHomeHeader);
    window.addEventListener("pageshow", restoreHomeHeader);

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.removeEventListener("popstate", restoreHomeHeader);
      window.removeEventListener("pageshow", restoreHomeHeader);
    };
  }, [pathname]);

  return null;
}
