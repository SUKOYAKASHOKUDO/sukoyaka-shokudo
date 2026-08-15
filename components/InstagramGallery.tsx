"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const instagramPhotoSlots = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

function getCarouselMetrics(track: HTMLDivElement) {
  const cards = Array.from(
    track.querySelectorAll<HTMLElement>(".mashiro-instagram-slot"),
  );
  const firstCard = cards[0];
  const secondCard = cards[1];

  if (!firstCard) {
    return { pageCount: 1, step: track.clientWidth };
  }

  const cardStep = secondCard
    ? secondCard.offsetLeft - firstCard.offsetLeft
    : firstCard.offsetWidth;
  const gap = Math.max(0, cardStep - firstCard.offsetWidth);
  const visibleCards = Math.max(
    1,
    Math.floor((track.clientWidth + gap) / cardStep),
  );

  return {
    pageCount: Math.max(1, Math.ceil(cards.length / visibleCards)),
    step: cardStep * visibleCards,
  };
}

export function InstagramGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(3);

  const updateCarousel = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const metrics = getCarouselMetrics(track);
    setPageCount(metrics.pageCount);
    setCurrentPage((page) => Math.min(page, metrics.pageCount - 1));
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    updateCarousel();
    const resizeObserver = new ResizeObserver(updateCarousel);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [updateCarousel]);

  const showPage = (requestedPage: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const metrics = getCarouselMetrics(track);
    const nextPage = Math.max(
      0,
      Math.min(requestedPage, metrics.pageCount - 1),
    );

    track.scrollTo({
      left: nextPage * metrics.step,
      behavior: "smooth",
    });
    setCurrentPage(nextPage);
  };

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const metrics = getCarouselMetrics(track);
    const nextPage = Math.min(
      metrics.pageCount - 1,
      Math.max(0, Math.round(track.scrollLeft / metrics.step)),
    );
    setCurrentPage(nextPage);
  };

  return (
    <div
      className="mashiro-instagram-carousel"
      data-current-page={currentPage + 1}
    >
      <div className="mashiro-instagram-controls" aria-label="写真の表示切り替え">
        <button
          className="mashiro-instagram-arrow"
          type="button"
          onClick={() => showPage(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="前の写真を見る"
        >
          <span aria-hidden="true">←</span>
        </button>

        <div className="mashiro-instagram-dots" aria-label="写真グループ">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              className="mashiro-instagram-dot-button"
              type="button"
              onClick={() => showPage(index)}
              aria-current={index === currentPage ? "true" : undefined}
              aria-label={`写真グループ${index + 1}を表示`}
              key={index}
            />
          ))}
        </div>

        <button
          className="mashiro-instagram-arrow"
          type="button"
          onClick={() => showPage(currentPage + 1)}
          disabled={currentPage === pageCount - 1}
          aria-label="次の写真を見る"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div
        className="mashiro-instagram-grid"
        aria-label="Instagram写真掲載予定枠"
        onScroll={handleScroll}
        ref={trackRef}
        role="region"
        tabIndex={0}
      >
        {instagramPhotoSlots.map((slot) => (
          <div className="mashiro-instagram-slot" key={slot} aria-hidden="true">
            <span className="mashiro-instagram-slot-number">{slot}</span>
            <svg viewBox="0 0 48 48">
              <rect x="8" y="8" width="32" height="32" rx="9" />
              <circle cx="24" cy="24" r="7" />
              <circle cx="34" cy="14" r="2" className="mashiro-instagram-dot" />
            </svg>
            <span className="mashiro-instagram-slot-label">PHOTO</span>
          </div>
        ))}
      </div>

      <p className="mashiro-instagram-page-status" aria-live="polite">
        {currentPage + 1} / {pageCount}
      </p>
    </div>
  );
}
