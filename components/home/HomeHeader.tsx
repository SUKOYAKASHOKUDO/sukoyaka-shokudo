"use client";

import { useId, useState } from "react";
import { site } from "../../content/siteContent";
import { HomeHeaderArtwork } from "./HomeHeaderArtwork";
import styles from "./home.module.css";

function MenuIcon({ name }: { name: "home" | "about" | "mail" }) {
  return <svg viewBox="0 0 64 64" aria-hidden="true" data-icon={name}>
    {name === "home" && <><path d="M7 30 32 8l25 22-6 1v24H38V40H26v15H13V31Z" /><path d="M22 28h20" /></>}
    {name === "about" && <><path data-heart="true" d="M32 56C25 49 9 39 9 23 9 13 16 7 25 7c4 0 7 2 9 5 3-3 6-5 10-5 9 0 16 6 16 16 0 16-17 27-28 33Z" /><circle cx="22" cy="27" r="5" /><circle cx="32" cy="24" r="5.5" /><circle cx="43" cy="27" r="5" /><path d="M17 44v-6c0-3 2-5 5-5s5 2 5 5v6Z M28 47V36c0-3 2-6 4-6s5 3 5 6v11Z M38 44v-6c0-3 2-5 5-5s5 2 5 5v6Z" /></>}
    {name === "mail" && <><rect x="6" y="13" width="52" height="39" rx="7" /><path d="m10 18 22 18 22-18" /></>}
  </svg>;
}

export function HomeHeader() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const items = [{ href: "/", label: "HOME", icon: "home" }, { href: "/operator", label: "私たちについて", icon: "about" }, { href: `mailto:${site.email}`, label: "お問い合わせ", icon: "mail" }] as const;
  return <header className={styles.header} data-home-header>
    <div className={styles.headerSurface}>
      <div className={styles.desktopArt}><HomeHeaderArtwork id={`${id}-desktop`} kind="desktop" /></div>
      <div className={styles.brandArt}><HomeHeaderArtwork id={`${id}-brand`} kind="brand" /></div>
      <div className={styles.natureArt}><HomeHeaderArtwork id={`${id}-nature`} kind="nature" /></div>
      <div className={styles.cloudArt}><HomeHeaderArtwork id={`${id}-cloud`} kind="cloud" /></div>
      <a className={styles.brandLink} href="/" aria-label="子ども食堂 すこやか食堂 トップへ" />
      <nav className={styles.mainNav} aria-label="メインメニュー">
        {items.map(item => <a key={item.href} href={item.href} aria-label={item.label}><MenuIcon name={item.icon} /><span>{item.label}</span></a>)}
      </nav>
      <button className={styles.auxToggle} type="button" aria-expanded={open} aria-controls={`${id}-menu`} aria-label={open ? "補助メニューを閉じる" : "補助メニューを開く"} onClick={() => setOpen(!open)}><span /><span /><span /></button>
      <nav className={styles.auxNav} aria-label="補助メニュー" id={`${id}-menu`} hidden={!open} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
        <a href="/schedule">日程とメニュー</a><a href="/recipes">レシピとコラム</a><a href="/support">すこやか食堂を応援する</a>
      </nav>
    </div>
  </header>;
}
