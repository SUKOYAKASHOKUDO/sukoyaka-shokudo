"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 420;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > SHOW_AFTER_PX);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className="back-to-top-button"
      data-visible={isVisible}
      aria-label="ページの上部へ戻る"
      title="ページの上部へ戻る"
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
    >
      <span className="back-to-top-star" aria-hidden="true">
        ★
      </span>
      <span className="back-to-top-arrow" aria-hidden="true">
        ↑
      </span>
      <span className="back-to-top-label" aria-hidden="true">
        TOP
      </span>
    </button>
  );
}
