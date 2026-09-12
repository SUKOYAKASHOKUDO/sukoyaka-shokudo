"use client";

import Link from "next/link";
import { site } from "../content/siteContent";
import { SukoyakaBrandHomeLink } from "./SukoyakaBrandHomeLink";

const headerNavigation = [
  { href: "/", label: "HOME", accent: "sky" },
  { href: "/operator", label: "私たちについて", accent: "coral" },
] as const;

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
      </div>
    </header>
  );
}
