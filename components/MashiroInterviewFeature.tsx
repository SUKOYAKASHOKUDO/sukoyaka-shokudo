"use client";

import Image from "next/image";
import { type PointerEvent as ReactPointerEvent, useRef, useState } from "react";

const standardImage = "/images/press/mashiro-interview/mashiro-interview.webp";
const largeImage =
  "/images/press/mashiro-interview/mashiro-interview-large.webp";
const imageAlt = "すこやか食堂代表 南真白の取材掲載記事";
const imageAspectRatio = 4519 / 3200;

type Point = { x: number; y: number };

type Gesture = {
  mode: "pan" | "pinch";
  startX: number;
  startY: number;
  startPan: Point;
  startDistance: number;
  startZoom: number;
};

export function MashiroInterviewFeature() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<Gesture | null>(null);
  const zoomRef = useRef(1);
  const panRef = useRef<Point>({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });

  const clampPan = (nextZoom: number, nextPan: Point): Point => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return nextPan;
    }

    const styles = getComputedStyle(viewport);
    const contentWidth = Math.max(
      0,
      viewport.clientWidth -
        parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight),
    );
    const contentHeight = Math.max(
      0,
      viewport.clientHeight -
        parseFloat(styles.paddingTop) -
        parseFloat(styles.paddingBottom),
    );
    const imageWidth = contentWidth * nextZoom;
    const imageHeight = imageWidth * imageAspectRatio;
    const maxX = Math.max(0, imageWidth - contentWidth);
    const maxY = Math.max(0, imageHeight - contentHeight);

    return {
      x: Math.min(0, Math.max(-maxX, nextPan.x)),
      y: Math.min(0, Math.max(-maxY, nextPan.y)),
    };
  };

  const applyView = (nextZoom: number, nextPan: Point) => {
    const safeZoom = Math.min(2.5, Math.max(1, nextZoom));
    const safePan = clampPan(safeZoom, nextPan);
    zoomRef.current = safeZoom;
    panRef.current = safePan;
    setZoom(safeZoom);
    setPan(safePan);
  };

  const distanceBetween = (first: Point, second: Point) =>
    Math.hypot(second.x - first.x, second.y - first.y);

  const openDialog = () => {
    applyView(1, { x: 0, y: 0 });
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleClosed = () => {
    setIsOpen(false);
    pointersRef.current.clear();
    gestureRef.current = null;
    applyView(1, { x: 0, y: 0 });
    triggerRef.current?.focus();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    viewport.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const points = [...pointersRef.current.values()];
    if (points.length >= 2) {
      gestureRef.current = {
        mode: "pinch",
        startX: 0,
        startY: 0,
        startPan: panRef.current,
        startDistance: distanceBetween(points[0], points[1]),
        startZoom: zoomRef.current,
      };
      return;
    }

    gestureRef.current = {
      mode: "pan",
      startX: event.clientX,
      startY: event.clientY,
      startPan: panRef.current,
      startDistance: 0,
      startZoom: zoomRef.current,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    event.preventDefault();
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const gesture = gestureRef.current;
    const points = [...pointersRef.current.values()];
    if (!gesture) {
      return;
    }

    if (gesture.mode === "pinch" && points.length >= 2) {
      const nextDistance = distanceBetween(points[0], points[1]);
      const scale = gesture.startDistance
        ? nextDistance / gesture.startDistance
        : 1;
      applyView(gesture.startZoom * scale, gesture.startPan);
      return;
    }

    if (gesture.mode === "pan" && points.length === 1) {
      applyView(zoomRef.current, {
        x: gesture.startPan.x + event.clientX - gesture.startX,
        y: gesture.startPan.y + event.clientY - gesture.startY,
      });
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    pointersRef.current.delete(event.pointerId);

    const points = [...pointersRef.current.values()];
    if (points.length === 1) {
      gestureRef.current = {
        mode: "pan",
        startX: points[0].x,
        startY: points[0].y,
        startPan: panRef.current,
        startDistance: 0,
        startZoom: zoomRef.current,
      };
    } else {
      gestureRef.current = null;
    }
  };

  return (
    <section
      className="mashiro-interview-section"
      aria-labelledby="mashiro-interview-title"
    >
      <div className="shell">
        <header className="mashiro-interview__header">
          <p className="mashiro-interview__eyebrow">メディア掲載記事</p>
          <h2 id="mashiro-interview-title">代表 南 真白 取材記事</h2>
          <p>
            すこやか食堂代表・南真白が、活動への思いや子ども食堂の役割について取材を受けました。
            <br />
            掲載記事を誌面そのままの形でご覧いただけます。
          </p>
        </header>

        <p className="mashiro-interview__hint">
          画像をタップすると拡大してご覧いただけます。
        </p>

        <figure className="mashiro-interview__paper">
          <button
            ref={triggerRef}
            type="button"
            className="mashiro-interview__open"
            onClick={openDialog}
            aria-haspopup="dialog"
            aria-label="代表 南真白の取材掲載記事を拡大して読む"
          >
            <Image
              src={standardImage}
              alt={imageAlt}
              width={1800}
              height={2542}
              sizes="(max-width: 1100px) calc(100vw - 28px), 1060px"
              loading="lazy"
              unoptimized
            />
            <span className="mashiro-interview__open-label">拡大して読む</span>
          </button>
        </figure>
      </div>

      <dialog
        ref={dialogRef}
        className="mashiro-interview-dialog"
        aria-label="代表 南真白の取材掲載記事 拡大表示"
        onCancel={() => setIsOpen(false)}
        onClose={handleClosed}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeDialog();
          }
        }}
      >
        <div className="mashiro-interview-dialog__toolbar">
          <p>ピンチ操作またはボタンで拡大できます</p>
          <div className="mashiro-interview-dialog__actions">
            <button
              type="button"
              onClick={() =>
                applyView(zoomRef.current - 0.25, panRef.current)
              }
              disabled={zoom <= 1}
              aria-label="誌面を縮小"
            >
              −
            </button>
            <span aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() =>
                applyView(zoomRef.current + 0.25, panRef.current)
              }
              disabled={zoom >= 2.5}
              aria-label="誌面を拡大"
            >
              ＋
            </button>
            <button
              type="button"
              className="mashiro-interview-dialog__close"
              onClick={closeDialog}
            >
              閉じる
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="mashiro-interview-dialog__viewport"
          role="group"
          aria-label="取材記事の拡大表示。指一本で移動できます。"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          {isOpen ? (
            <img
              src={largeImage}
              alt={imageAlt}
              width={3200}
              height={4519}
              className="mashiro-interview-dialog__image"
              style={{
                width: `${zoom * 100}%`,
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`,
              }}
              draggable={false}
            />
          ) : null}
        </div>
      </dialog>
    </section>
  );
}
