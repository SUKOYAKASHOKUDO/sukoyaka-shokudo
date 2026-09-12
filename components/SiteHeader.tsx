"use client";

import Link from "next/link";
import { site } from "../content/siteContent";
import { SukoyakaBrandHomeLink } from "./SukoyakaBrandHomeLink";

const headerNavigation = [
  { href: "/", label: "HOME", accent: "sky" },
  { href: "/operator", label: "私たちについて", accent: "coral" },
] as const;

function HeaderMeadow() {
  return (
    <svg
      className="storybook-header-meadow"
      viewBox="0 0 1600 78"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 58C118 35 216 70 350 53C503 33 593 68 748 50C910 31 1038 68 1182 48C1328 28 1457 59 1600 39V78H0Z"
        fill="#dcefcf"
      />
      <path
        d="M0 67C146 50 267 77 414 62C575 45 690 76 840 61C1013 43 1143 76 1289 59C1412 45 1512 57 1600 54V78H0Z"
        fill="#c9e5bd"
      />

      <g className="storybook-meadow-sprout" transform="translate(72 47)">
        <path d="M8 25V7" stroke="#579d71" strokeWidth="4" strokeLinecap="round" />
        <path d="M8 13C-1 12-5 5 0 0C8 1 12 6 8 13Z" fill="#70b98a" />
        <path d="M8 16C18 15 23 8 19 3C11 4 7 9 8 16Z" fill="#4fa277" />
      </g>

      <g className="storybook-meadow-flower" transform="translate(324 48)">
        <circle cx="10" cy="10" r="4" fill="#f5bd3f" />
        <circle cx="10" cy="3" r="5" fill="#fffdf4" />
        <circle cx="17" cy="10" r="5" fill="#fffdf4" />
        <circle cx="10" cy="17" r="5" fill="#fffdf4" />
        <circle cx="3" cy="10" r="5" fill="#fffdf4" />
      </g>

      <g className="storybook-meadow-apple" transform="translate(760 41)">
        <path d="M13 3C14-3 18-5 22-4" stroke="#5f8b48" strokeWidth="3" strokeLinecap="round" />
        <path d="M17 1C23-2 28 0 29 5C23 7 19 5 17 1Z" fill="#6cab66" />
        <path d="M14 7C25 1 35 10 32 22C30 33 21 37 14 33C7 37-2 33-4 22C-7 10 3 1 14 7Z" fill="#f17a61" />
        <circle cx="5" cy="17" r="2.5" fill="#ffad8e" />
      </g>

      <g className="storybook-meadow-bowl" transform="translate(1062 42)">
        <path d="M0 11H38C36 27 29 34 19 34C9 34 2 27 0 11Z" fill="#4aa7ae" />
        <ellipse cx="19" cy="11" rx="19" ry="7" fill="#f9f1d8" />
        <ellipse cx="19" cy="10" rx="13" ry="4" fill="#fffef8" />
        <circle cx="15" cy="9" r="2" fill="#83b87d" />
        <circle cx="23" cy="11" r="2" fill="#f1a54b" />
      </g>

      <g className="storybook-meadow-flower" transform="translate(1374 44)">
        <circle cx="10" cy="10" r="4" fill="#f5bd3f" />
        <circle cx="10" cy="3" r="5" fill="#fffdf4" />
        <circle cx="17" cy="10" r="5" fill="#fffdf4" />
        <circle cx="10" cy="17" r="5" fill="#fffdf4" />
        <circle cx="3" cy="10" r="5" fill="#fffdf4" />
      </g>
    </svg>
  );
}

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav
      className={mobile ? "storybook-mobile-nav" : "storybook-main-nav"}
      aria-label={mobile ? "スマートフォンメニュー" : "メインメニュー"}
    >
      {headerNavigation.map((item) => (
        <Link
          className={`storybook-nav-link storybook-nav-link-${item.accent}`}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
      <a
        className="storybook-nav-link storybook-nav-link-sun"
        href={`mailto:${site.email}`}
      >
        お問い合わせ
      </a>
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header storybook-site-header">
      <div className="storybook-header-panel">
        <SukoyakaBrandHomeLink className="storybook-full-logo" priority />

        <NavigationLinks />

        <details className="storybook-mobile-menu">
          <summary aria-label="メニューを開く">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </summary>
          <NavigationLinks mobile />
        </details>

        <HeaderMeadow />
      </div>
    </header>
  );
}
