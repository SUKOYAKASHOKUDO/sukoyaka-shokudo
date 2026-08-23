"use client";

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Sponsor } from "../content/siteContent";

type SponsorCarouselProps = {
  sponsors: Sponsor[];
};

export function SponsorCarousel({ sponsors }: SponsorCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const nextPageCount = Math.max(1, Math.ceil(maxScroll / track.clientWidth) + 1);
    const nextPage =
      maxScroll === 0
        ? 0
        : Math.round((track.scrollLeft / maxScroll) * (nextPageCount - 1));

    setPageCount(nextPageCount);
    setCurrentPage(Math.min(nextPage, nextPageCount - 1));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [updatePosition]);

  const moveToPage = (pageIndex: number) => {
    const track = trackRef.current;
    if (!track) return;

    const nextPage = Math.max(0, Math.min(pageIndex, pageCount - 1));
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const left = pageCount === 1 ? 0 : (maxScroll * nextPage) / (pageCount - 1);

    track.scrollTo({ left, behavior: "smooth" });
    setCurrentPage(nextPage);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveToPage(currentPage - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveToPage(currentPage + 1);
    }
  };

  return (
    <div className="sponsor-carousel">
      <div
        className="sponsor-carousel-track"
        ref={trackRef}
        role="region"
        aria-label="協賛企業・ご支援者様の一覧"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={updatePosition}
      >
        {sponsors.map((sponsor, index) => (
          <article className="sponsor-carousel-card" key={sponsor.name}>
            <span className="sponsor-carousel-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>
              {sponsor.name.split("\n").map((line, lineIndex) => (
                <span key={`${sponsor.name}-${lineIndex}`}>
                  {lineIndex > 0 && <br />}
                  {line}
                </span>
              ))}
            </h3>
            <p>
              <span>ご支援：</span>
              {sponsor.support}
            </p>
          </article>
        ))}
      </div>

      <button
        className="sponsor-carousel-arrow is-prev"
        type="button"
        onClick={() => moveToPage(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="前の協賛企業・ご支援者様を見る"
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        className="sponsor-carousel-arrow is-next"
        type="button"
        onClick={() => moveToPage(currentPage + 1)}
        disabled={currentPage === pageCount - 1}
        aria-label="次の協賛企業・ご支援者様を見る"
      >
        <span aria-hidden="true">→</span>
      </button>

      <div className="sponsor-carousel-pagination" aria-label="協賛者一覧のページ">
        {Array.from({ length: pageCount }, (_, pageIndex) => (
          <button
            type="button"
            className={pageIndex === currentPage ? "is-current" : undefined}
            onClick={() => moveToPage(pageIndex)}
            aria-label={`${pageIndex + 1}ページ目を表示`}
            aria-current={pageIndex === currentPage ? "page" : undefined}
            key={`sponsor-page-${pageIndex + 1}`}
          />
        ))}
      </div>
      <p className="sponsor-carousel-status" aria-live="polite">
        {currentPage + 1} / {pageCount}
      </p>
    </div>
  );
}
