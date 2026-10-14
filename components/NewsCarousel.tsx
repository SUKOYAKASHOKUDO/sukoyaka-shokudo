"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { NewsCard, type NewsCardPost } from "./NewsCard";
import styles from "../app/news/news.module.css";

export function NewsCarousel({ posts }: { posts: NewsCardPost[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ page: 0, count: 1 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;
    const perPage = Number(getComputedStyle(track).getPropertyValue("--news-page-size")) || 1;
    const card = track.firstElementChild;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = ((card?.getBoundingClientRect().width ?? track.clientWidth) + gap) * perPage;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const count = max <= 2 ? 1 : Math.ceil(posts.length / perPage);
    const page = max <= 2 ? 0 : track.scrollLeft >= max - 2
      ? count - 1 : Math.min(count - 1, Math.round(track.scrollLeft / step));
    return { track, max, count, page, step };
  }, [posts.length]);

  const updatePosition = useCallback(() => {
    const next = measure();
    if (next) setPosition({ page: next.page, count: next.count });
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(track);
    const wheel = (event: WheelEvent) => {
      if (!event.shiftKey || event.deltaX !== 0 || track.scrollWidth <= track.clientWidth) return;
      event.preventDefault();
      track.scrollBy({ left: event.deltaY });
    };
    track.addEventListener("wheel", wheel, { passive: false });
    return () => {
      observer.disconnect();
      track.removeEventListener("wheel", wheel);
    };
  }, [updatePosition]);

  const move = (requested: number) => {
    const current = measure();
    if (!current) return;
    const page = Math.max(0, Math.min(requested, current.count - 1));
    current.track.scrollTo({
      left: Math.min(page * current.step, current.max),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const pages: Record<string, number> = {
      ArrowLeft: position.page - 1, ArrowRight: position.page + 1,
      Home: 0, End: position.count - 1,
    };
    if (!(event.key in pages)) return;
    event.preventDefault();
    move(pages[event.key]);
  };

  return (
    <div className={styles.carousel}>
      <div ref={trackRef} className={styles.track} role="region"
        aria-label="食堂からのお知らせ" aria-roledescription="カルーセル"
        tabIndex={0} onKeyDown={onKeyDown} onScroll={updatePosition}>
        {posts.map((post) => <NewsCard key={post.slug} post={post} />)}
      </div>
      {position.count > 1 && (
        <div className={styles.controls}>
          <button type="button" onClick={() => move(position.page - 1)}
            disabled={position.page === 0} aria-label="前のお知らせを見る">←</button>
          <div className={styles.indicators} aria-label="お知らせの表示位置">
            {Array.from({ length: position.count }, (_, index) => (
              <button key={index} type="button" onClick={() => move(index)}
                aria-label={`${index + 1}ページ目のお知らせを表示`}
                aria-current={position.page === index ? "page" : undefined} />
            ))}
          </div>
          <button type="button" onClick={() => move(position.page + 1)}
            disabled={position.page === position.count - 1} aria-label="次のお知らせを見る">→</button>
        </div>
      )}
    </div>
  );
}
