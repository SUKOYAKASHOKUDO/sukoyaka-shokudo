"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

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

  return null;
}
