"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const standardImage = "/images/press/mashiro-interview/mashiro-interview.webp";
const largeImage =
  "/images/press/mashiro-interview/mashiro-interview-large.webp";
const imageAlt = "すこやか食堂代表 南真白の取材掲載記事";

export function MashiroInterviewFeature() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const openDialog = () => {
    setZoom(1);
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleClosed = () => {
    setIsOpen(false);
    setZoom(1);
    triggerRef.current?.focus();
  };

  return (
    <section
      className="mashiro-interview-section"
      aria-labelledby="mashiro-interview-title"
    >
      <div className="shell">
        <header className="mashiro-interview__header">
          <p className="mashiro-interview__eyebrow">メディア掲載記事</p>
          <h2 id="mashiro-interview-title">代表 南真白 取材記事</h2>
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
              onClick={() => setZoom((value) => Math.max(1, value - 0.25))}
              disabled={zoom <= 1}
              aria-label="誌面を縮小"
            >
              −
            </button>
            <span aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(2.5, value + 0.25))}
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

        <div className="mashiro-interview-dialog__viewport">
          {isOpen ? (
            <img
              src={largeImage}
              alt={imageAlt}
              width={3200}
              height={4519}
              className="mashiro-interview-dialog__image"
              style={{ width: `${zoom * 100}%` }}
              draggable={false}
            />
          ) : null}
        </div>
      </dialog>
    </section>
  );
}
