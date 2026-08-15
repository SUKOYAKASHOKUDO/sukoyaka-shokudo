import type { Metadata } from "next";
import { InstagramCalendarFrame } from "../../components/InstagramCalendarFrame";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { site } from "../../content/siteContent";
import { getInstagramCalendarData } from "../../lib/instagramCalendar";
import styles from "./schedule-calendar.module.css";

export const metadata: Metadata = {
  title: "すこやか食堂開催予定｜開催カレンダー",
  description:
    "すこやか食堂の開催予定と当日のメニューをご案内します。最新情報は公式Instagramでご確認ください。",
  alternates: { canonical: "/schedule" },
};

const confirmationItems = [
  {
    number: "01",
    title: "開催日",
    text: "現在は不定期開催です。カレンダーと最新投稿をご確認ください。",
  },
  {
    number: "02",
    title: "当日のメニュー",
    text: "協賛食材などにより変更することがあります。最新投稿でお知らせします。",
  },
  {
    number: "03",
    title: "変更のお知らせ",
    text: "急な変更や中止もInstagramでご案内します。ご来場前にご確認ください。",
  },
] as const;

export default async function SchedulePage() {
  const calendar = await getInstagramCalendarData();

  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />

      <main id="main" className={styles.page}>
        <section className={styles.hero} aria-labelledby="schedule-title">
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>SCHEDULE &amp; MENU</p>
            <h1 id="schedule-title">すこやか食堂 開催カレンダー</h1>
            <p className={styles.heroLead}>
              開催日と当日のメニューは、公式Instagramの最新投稿をご確認ください。
            </p>
            <span className={styles.statusPill}>現在は不定期で開催しています</span>
          </div>
        </section>

        <section className={styles.calendarSection} aria-labelledby="calendar-title">
          <div className={styles.sectionInner}>
            <div className={styles.calendarGrid}>
              <InstagramCalendarFrame initialCalendar={calendar} />

              <div className={styles.calendarCopy}>
                <p className={styles.eyebrow}>LATEST CALENDAR</p>
                <h2 id="calendar-title">次回の開催を確認する</h2>
                <p>
                  この枠には、Instagram連携後に公式アカウントで公開した開催カレンダー画像が表示されます。
                </p>
                <div className={styles.noticeBox}>
                  <strong>ご来場前に、もう一度ご確認ください</strong>
                  <p>
                    開催日時・メニューは変更になる場合があります。最新の投稿内容を優先してください。
                  </p>
                </div>
                <a
                  className={styles.instagramButton}
                  href={calendar.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagramで最新情報を見る
                  <span aria-hidden="true">↗</span>
                </a>
                <small className={styles.accountName}>@mi_repollito</small>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.checkSection} aria-labelledby="check-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>BEFORE YOUR VISIT</p>
              <h2 id="check-title">来る前に確認すること</h2>
            </div>

            <div className={styles.checkGrid}>
              {confirmationItems.map((item) => (
                <article className={styles.checkCard} key={item.number}>
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <aside className={styles.allergyNote}>
              <strong>食物アレルギーについて</strong>
              <p>
                個別のアレルギー対応食・除去食は提供していません。食物アレルギーがある場合は、保護者の方が食事内容をご確認ください。
              </p>
            </aside>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.contactCard}>
            <div>
              <p className={styles.eyebrow}>NEED HELP?</p>
              <h2>開催について確認したいとき</h2>
              <p>掲載内容だけで判断できない場合は、お気軽にお問い合わせください。</p>
            </div>
            <div className={styles.contactActions}>
              <a href={`mailto:${site.email}`}>メールで問い合わせる</a>
              <a href={site.map} target="_blank" rel="noopener noreferrer">
                地図を見る ↗
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
