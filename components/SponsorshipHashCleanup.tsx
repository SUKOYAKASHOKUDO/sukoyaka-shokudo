"use client";

import { useEffect } from "react";

export function SponsorshipHashCleanup() {
  useEffect(() => {
    const clearLegacyHash = () => {
      if (window.location.hash === "#sponsorship") {
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }
    };

    clearLegacyHash();
    window.addEventListener("hashchange", clearLegacyHash);

    return () => window.removeEventListener("hashchange", clearLegacyHash);
  }, []);

  return null;
}
