"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { site } from "../content/siteContent";
import {
  getSkyHeaderArtwork,
  HEADER_ARTWORK_SOURCE,
  HEADER_SKY_COLOR,
} from "../lib/headerBackground";
import { SukoyakaBrandHomeLink } from "./SukoyakaBrandHomeLink";

type HeaderIconName = "home" | "about" | "mail";

function HeaderReferenceArt({
  artId,
  className,
  viewBox,
}: {
  artId: string;
  className: string;
  viewBox: string;
}) {
  return (
    <svg className={className} viewBox={viewBox} aria-hidden="true" focusable="false">
      <use href={`#${artId}`} />
    </svg>
  );
}

function HeaderNavIcon({ name }: { name: HeaderIconName }) {
  return (
    <svg
      className={`storybook-header-icon storybook-header-icon-${name}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      {name === "home" && (
        <>
          <path d="M7 30 32 8l25 22-6 1v24H38V40H26v15H13V31Z" />
          <path d="M22 28h20" />
        </>
      )}

      {name === "about" && (
        <>
          <path
            className="storybook-header-heart-outline"
            d="M32 56C25 49 9 39 9 23 9 13 16 7 25 7c4 0 7 2 9 5 3-3 6-5 10-5 9 0 16 6 16 16 0 16-17 27-28 33Z"
          />
          <circle cx="22" cy="27" r="5" />
          <circle cx="32" cy="24" r="5.5" />
          <circle cx="43" cy="27" r="5" />
          <path d="M15 45c1-8 4-12 8-12 3 0 5 2 6 5 1-6 4-9 8-9 4 0 7 3 8 9 1-3 3-5 6-5 4 0 7 4 8 12" />
          <path d="M29 38v11M45 38v9M22 38v9" />
        </>
      )}

      {name === "mail" && (
        <>
          <rect x="6" y="13" width="52" height="39" rx="7" />
          <path d="m10 18 22 18 22-18" />
        </>
      )}
    </svg>
  );
}

function HeaderNatureDecor() {
  return (
    <svg
      className="storybook-header-nature"
      viewBox="0 0 300 118"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="storybook-header-sun-dot" cx="212" cy="28" r="9" />
      <circle className="storybook-header-sun-wash" cx="244" cy="78" r="24" />
      <circle className="storybook-header-sun-dot" cx="278" cy="95" r="5" />

      <g className="storybook-header-bird" transform="translate(84 0)">
        <ellipse cx="62" cy="31" rx="25" ry="16" />
        <circle cx="40" cy="25" r="10" />
        <path d="m31 24-13-5 11 10Z" />
        <path d="M66 28c8-17 22-22 34-23-3 17-15 26-31 28Z" />
        <path d="m81 37 24 6-18 9-17-13Z" />
        <circle className="storybook-header-bird-eye" cx="38" cy="22" r="1.7" />
      </g>

      <path className="storybook-header-branch" d="M118 92c36-13 62-31 87-59" />
      <path className="storybook-header-twig" d="m151 75-11-19M171 63l5-24M190 48l20-9" />
      <ellipse className="storybook-header-leaf" cx="139" cy="51" rx="7" ry="17" transform="rotate(-42 139 51)" />
      <ellipse className="storybook-header-leaf" cx="176" cy="39" rx="7" ry="18" transform="rotate(24 176 39)" />
      <ellipse className="storybook-header-leaf" cx="210" cy="37" rx="7" ry="17" transform="rotate(66 210 37)" />
      <circle className="storybook-header-flower" cx="157" cy="68" r="4" />
      <circle className="storybook-header-flower" cx="198" cy="47" r="3.5" />
    </svg>
  );
}

function HeaderPlantDecor() {
  return (
    <svg
      className="storybook-header-plant"
      viewBox="0 0 80 96"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M29 94C30 66 27 41 19 15" />
      <path d="M30 72c13-15 23-25 39-33M27 57C18 47 12 39 7 29" />
      <ellipse cx="18" cy="15" rx="7" ry="13" transform="rotate(-18 18 15)" />
      <ellipse cx="9" cy="29" rx="7" ry="12" transform="rotate(-43 9 29)" />
      <ellipse cx="51" cy="54" rx="7" ry="15" transform="rotate(44 51 54)" />
      <circle cx="67" cy="38" r="5" />
      <circle cx="27" cy="80" r="5" />
    </svg>
  );
}

export function SiteHeader() {
  const [headerArtwork, setHeaderArtwork] = useState(HEADER_ARTWORK_SOURCE);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const navigationArtClipId = useId();
  const mobileArtImageId = useId();
  const birdRemovalClipId = useId();
  const navigationSourceArtId = useId();
  const navigationFragmentClipId = useId();

  useEffect(() => {
    let active = true;
    getSkyHeaderArtwork()
      .then((artwork) => {
        if (active) setHeaderArtwork(artwork);
      })
      .catch(() => {
        // Keep the original artwork if local canvas rendering is unavailable.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header storybook-site-header">
      <div className="storybook-header-panel">
        <svg
          className="storybook-pc-reference-art"
          viewBox="0 0 2172 724"
          width="2172"
          height="724"
          aria-hidden="true"
          focusable="false"
        >
          <use href={`#${mobileArtImageId}`} />
        </svg>
        <svg
          className="storybook-pc-navigation-art"
          viewBox="0 0 2172 280"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* Hide only the source bird and dotted flight trail. All other
                source artwork remains unchanged in both responsive layouts. */}
            <clipPath id={birdRemovalClipId} clipPathUnits="userSpaceOnUse">
              <path
                clipRule="evenodd"
                d="M0 0H2172V724H0Z M1810 240H1915V287H2000V327H1898V310H1810Z"
              />
            </clipPath>
            <image
              id={mobileArtImageId}
              href={headerArtwork}
              width="2172"
              height="724"
              clipPath={`url(#${birdRemovalClipId})`}
            />
            {/* The navigation crop catches the top edge of the lower cloud.
                Remove that fragment only, retaining the complete background cloud. */}
            <clipPath id={navigationFragmentClipId} clipPathUnits="userSpaceOnUse">
              <path
                clipRule="evenodd"
                d="M0 0H2172V724H0Z M1740 400H1860V450H1740Z"
              />
            </clipPath>
            <g id={navigationSourceArtId} clipPath={`url(#${navigationFragmentClipId})`}>
              <use href={`#${mobileArtImageId}`} />
            </g>
            <clipPath id={navigationArtClipId}>
              <rect x="895" y="100" width="1020" height="110" />
            </clipPath>
          </defs>
          <rect x="895" y="100" width="1020" height="110" fill={HEADER_SKY_COLOR} />
          <g
            className="storybook-navigation-art-content"
            transform="translate(1405 155) scale(0.8) translate(-1405 -155)"
          >
            <g clipPath={`url(#${navigationArtClipId})`}>
              <use href={`#${navigationSourceArtId}`} transform="translate(0 -205)" />
            </g>
          </g>
        </svg>
        <div className="storybook-mobile-header-art" aria-hidden="true">
          <HeaderReferenceArt artId={mobileArtImageId} className="storybook-mobile-brand-art" viewBox="25 245 800 187" />
          <HeaderReferenceArt artId={mobileArtImageId} className="storybook-mobile-nature-art" viewBox="1780 240 380 185" />
          <HeaderReferenceArt artId={mobileArtImageId} className="storybook-mobile-plant-art" viewBox="10 365 80 113" />
          <HeaderReferenceArt artId={mobileArtImageId} className="storybook-mobile-cloud-art" viewBox="780 250 100 55" />
          <HeaderReferenceArt artId={mobileArtImageId} className="storybook-mobile-hills-art" viewBox="90 445 2010 33" />
        </div>
        <span className="storybook-header-hills" aria-hidden="true" />
        <HeaderPlantDecor />
        <HeaderNatureDecor />

        <SukoyakaBrandHomeLink className="storybook-full-logo" priority />

        <button
          className="storybook-menu-toggle"
          type="button"
          aria-label={menuOpen ? "補助メニューを閉じる" : "補助メニューを開く"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className="storybook-main-nav"
          aria-label="メインメニュー"
          onDragStart={(event) => {
            if (window.matchMedia("(min-width: 768px)").matches) {
              event.preventDefault();
            }
          }}
        >
          <Link href="/" aria-label="HOME">
            <HeaderNavIcon name="home" />
            <span>HOME</span>
            <HeaderReferenceArt artId={mobileArtImageId} className="storybook-mobile-nav-art" viewBox="920 305 185 110" />
          </Link>
          <Link href="/operator" aria-label="私たちについて">
            <HeaderNavIcon name="about" />
            <span>私たちについて</span>
            <HeaderReferenceArt artId={mobileArtImageId} className="storybook-mobile-nav-art" viewBox="1180 305 340 110" />
          </Link>
          <a href={`mailto:${site.email}`} aria-label="お問い合わせ">
            <HeaderNavIcon name="mail" />
            <span>お問い合わせ</span>
            <HeaderReferenceArt artId={navigationSourceArtId} className="storybook-mobile-nav-art" viewBox="1600 305 295 110" />
          </a>
        </nav>

        <nav
          id={menuId}
          className="storybook-aux-nav"
          aria-label="補助メニュー"
          hidden={!menuOpen}
        >
          <Link href="/schedule" onClick={() => setMenuOpen(false)}>
            日程とメニュー
          </Link>
          <Link href="/recipes" onClick={() => setMenuOpen(false)}>
            レシピとコラム
          </Link>
          <Link href="/support" onClick={() => setMenuOpen(false)}>
            すこやか食堂を応援する
          </Link>
        </nav>
      </div>
    </header>
  );
}
