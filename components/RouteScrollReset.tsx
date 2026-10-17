"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { getHomePreviewMode } from "../lib/homePreviewPolicy";

/**
 * Next.js keeps the root scrolling element mounted between App Router pages.
 * Reset that actual scroller once, before paint, whenever the pathname changes.
 * This also covers back/forward navigation without timers or repeated scrollTo.
 */
export function RouteScrollReset({ preview = false }: { preview?: boolean }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    // The rebuilt homepage uses a normal document and native restoration.
    // Keep the existing route reset only for the unchanged interior pages.
    if (pathname === "/") {
      history.scrollRestoration = preview && getHomePreviewMode(pathname, window.location.search) === "manual"
        ? "manual" : "auto";
      return;
    }
    history.scrollRestoration = "manual";
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
  }, [pathname, preview]);

  return null;
}
