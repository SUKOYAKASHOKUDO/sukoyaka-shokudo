"use client";

import { useEffect, useState } from "react";
import type { InstagramCalendarData } from "../lib/instagramCalendar";

type InstagramCalendarFrameProps = {
  initialCalendar: InstagramCalendarData;
};

function CalendarPlaceholder() {
  return (
    <div className="schedule-calendar-placeholder" aria-hidden="true">
      <div className="schedule-calendar-placeholder-head">
        <span />
        <span>開催カレンダー</span>
        <span />
      </div>
      <div className="schedule-calendar-weekdays">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="schedule-calendar-days">
        {Array.from({ length: 28 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <p>最新画像は公式Instagramでご確認ください</p>
    </div>
  );
}

export function InstagramCalendarFrame({
  initialCalendar,
}: InstagramCalendarFrameProps) {
  const [calendar, setCalendar] = useState(initialCalendar);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/instagram/calendar", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Calendar request failed");
        return response.json() as Promise<InstagramCalendarData>;
      })
      .then(setCalendar)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="schedule-calendar-media">
      <div className="schedule-calendar-media-bar">
        <span className="schedule-calendar-live-dot" aria-hidden="true" />
        <strong>開催カレンダー</strong>
        <small>
          {calendar.status === "ready" ? "最新画像" : "Instagramで更新"}
        </small>
      </div>

      <div className="schedule-calendar-image-frame">
        {calendar.imageUrl ? (
          // A normal img keeps future Instagram CDN URLs independent of Next image host settings.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={calendar.imageUrl} alt={calendar.alt} loading="eager" />
        ) : (
          <CalendarPlaceholder />
        )}
      </div>

      {calendar.updatedAt ? (
        <p className="schedule-calendar-updated">更新：{calendar.updatedAt}</p>
      ) : null}
    </div>
  );
}
