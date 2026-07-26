import type { Metadata } from "next";
import Image from "next/image";
import { MashiroPageHero } from "../../components/MashiroPageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { legacySchedule } from "../../content/legacyContent";
import { site } from "../../content/siteContent";

export const metadata: Metadata = {
  title: "日程とメニュー｜開催予定",
  description:
    "すこやか食堂と食育ランチクッキングの開催予定、日時、メニューについてご案内します。最新情報は公式Instagramをご確認ください。",
  alternates: { canonical: "/schedule" },
};

export default function SchedulePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site">
        <MashiroPageHero
          eyebrow="SCHEDULE & MENU"
          title="すこやか食堂開催予定"
          description="現在は不定期で開催しています。開催日時と当日のメニューは、公式Instagramの最新投稿を必ずご確認ください。"
          current="日程とメニュー"
        />

        <section className="mashiro-section">
          <div className="shell mashiro-schedule-detail">
            <div className="mashiro-date-panel">
              <p className="mashiro-kicker">2.営業について · CURRENT RHYTHM</p>
              <h2>日時</h2>
              {legacySchedule.recurring.map((line) => (
                <p className="mashiro-date-line" key={line}>
                  {line}
                </p>
              ))}
              <div className="mashiro-notice-box">
                {legacySchedule.notices.slice(0, 2).map((notice) => (
                  <p key={notice}>{notice}</p>
                ))}
              </div>
              <a
                className="mashiro-button"
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagramで最新日程を確認
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <figure className="mashiro-menu-figure">
              <Image
                src="/images/legacy/legacy-menu-plan.png"
                alt="カレーライスのイラスト"
                width={1238}
                height={1239}
                priority
              />
            </figure>
          </div>
        </section>

        <section className="mashiro-section mashiro-soft-section">
          <div className="shell mashiro-reading-layout">
            <aside>
              <p className="mashiro-kicker">OPENING HOURS</p>
              <h2>食堂と食育</h2>
            </aside>
            <div className="mashiro-prose">
              {legacySchedule.notices.slice(2).map((notice) => (
                <p key={notice}>{notice}</p>
              ))}
              <div className="mashiro-hours-card">
                {legacySchedule.hours.map((line) => (
                  <strong key={line}>{line}</strong>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mashiro-section">
          <div className="shell mashiro-reading-layout">
            <aside>
              <p className="mashiro-kicker">MENU</p>
              <h2>メニュー</h2>
            </aside>
            <div className="mashiro-prose">
              {legacySchedule.menu.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="mashiro-alert-card">
                <strong>アレルギー対応について</strong>
                <p>
                  旧公式サイトでは「アレルギー対応はしていません」と案内しています。ご来場前に必ず最新情報をご確認ください。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
