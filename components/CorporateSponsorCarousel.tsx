"use client";

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CorporateSponsor } from "../content/siteContent";
import { PartnerShowcaseCard } from "./PartnerShowcaseCard";

export function CorporateSponsorCarousel({
  sponsors,
}: {
  sponsors: CorporateSponsor[];
}) {
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
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
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
    <div className="corporate-sponsor-carousel">
      <div
        className="corporate-sponsor-carousel-track"
        ref={trackRef}
        role="region"
        aria-roledescription="カルーセル"
        aria-label="正式なスポンサー企業"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={updatePosition}
      >
        {sponsors.map((sponsor) => (
          <PartnerShowcaseCard
            key={sponsor.name}
            name={sponsor.name}
            summary={`${sponsor.summary} ${sponsor.message}`}
            url={sponsor.officialUrl}
            logo={sponsor.logo}
            supportLabel={sponsor.sponsorPeriod}
          />
        ))}
      </div>
      <button
        className="corporate-sponsor-carousel-arrow is-prev"
        type="button"
        onClick={() => moveToPage(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="前のスポンサー企業を見る"
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        className="corporate-sponsor-carousel-arrow is-next"
        type="button"
        onClick={() => moveToPage(currentPage + 1)}
        disabled={currentPage === pageCount - 1}
        aria-label="次のスポンサー企業を見る"
      >
        <span aria-hidden="true">→</span>
      </button>
      <div
        className="corporate-sponsor-carousel-pagination"
        aria-label="スポンサー企業一覧のページ"
      >
        {Array.from({ length: pageCount }, (_, pageIndex) => (
          <button
            type="button"
            className={pageIndex === currentPage ? "is-current" : undefined}
            onClick={() => moveToPage(pageIndex)}
            aria-label={`${pageIndex + 1}ページ目を表示`}
            aria-current={pageIndex === currentPage ? "page" : undefined}
            key={`corporate-sponsor-page-${pageIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
