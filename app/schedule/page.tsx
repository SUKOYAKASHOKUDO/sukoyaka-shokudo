import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { site } from "../../content/siteContent";
import styles from "./schedule-guide.module.css";

export const metadata: Metadata = {
  title: "こどものみんなへ｜はじめてのすこやか食堂",
  description:
    "すこやか食堂へはじめて来る子どもと保護者の方へ、開催日の確認、料金、場所、食物アレルギーについて分かりやすくご案内します。",
  alternates: { canonical: "/schedule" },
};

const comicPanels = [
  {
    number: "1",
    title: "「きょうは やってるかな？」",
    description: "おうちの人と ひにちを みてみよう！",
    artClass: "topLeft",
    toneClass: "yellow",
    alt: "クマとウサギがカレンダーとスマートフォンで開催日を確認しているイラスト",
  },
  {
    number: "2",
    title: "「こんにちは！」",
    description: "すこやか食堂へ ようこそ。",
    artClass: "topRight",
    toneClass: "mint",
    alt: "食堂の入口でクマがウサギと小鳥を迎えているイラスト",
  },
  {
    number: "3",
    title: "「みんなで いただきます！」",
    description: "ちゅうがくせいまでの こどもは 0えんだよ。",
    artClass: "bottomLeft",
    toneClass: "coral",
    alt: "クマとウサギと小鳥が食卓を囲んで食事を楽しんでいるイラスト",
  },
  {
    number: "4",
    title: "「ゆっくり していってね」",
    description: "ごはんの あとは、えほんや おもちゃで あそべるよ。",
    artClass: "bottomRight",
    toneClass: "sky",
    alt: "ウサギが絵本を読み、小鳥が遊び、クマが手を振っているイラスト",
  },
] as const;

const firstVisitFacts = [
  {
    icon: "📅",
    title: "開催日",
    text: "現在は不定期で開催しています。ご来場前に、公式Instagramで最新の開催日時とメニューをご確認ください。",
  },
  {
    icon: "🍚",
    title: "利用料金",
    text: "中学生以下は無料です。大人の方は1食500円でご利用いただけます。",
  },
  {
    icon: "📍",
    title: "場所",
    text: `${site.shortAddress}。札幌市電「山鼻9条駅」から徒歩4分です。`,
  },
  {
    icon: "🥕",
    title: "食物アレルギー",
    text: "個別のアレルギー対応食・除去食は提供していません。食物アレルギーがある場合は、保護者の方が食事内容をご確認ください。",
  },
  {
    icon: "🧸",
    title: "小さなお子さま",
    text: "提供する食事を安全に食べられることを前提に、年齢や食事について心配がある場合は事前にご相談ください。",
  },
  {
    icon: "📚",
    title: "過ごし方",
    text: "絵本やおもちゃをご用意しています。にぎやかに過ごすことや、じっとしていることが苦手なお子さまもご利用いただけます。",
  },
] as const;

export default function SchedulePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />

      <main id="main" className={styles.page}>
        <section className={styles.hero} aria-labelledby="kids-guide-title">
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>KIDS GUIDE</p>
            <h1 id="kids-guide-title">
              こどものみんなへ
              <span>はじめての すこやか食堂</span>
            </h1>
            <p className={styles.heroLead}>
              こどもも おとなも、いっしょに ごはんを 食べられる まちの食堂です。
            </p>
          </div>
        </section>

        <section className={styles.comicSection} aria-labelledby="comic-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeading}>
              <p>4つのコマで みてみよう</p>
              <h2 id="comic-title">すこやか食堂に いく日</h2>
            </div>

            <ol className={styles.comicGrid}>
              {comicPanels.map((panel) => (
                <li
                  className={`${styles.comicCard} ${styles[panel.toneClass]}`}
                  key={panel.number}
                >
                  <div
                    className={`${styles.comicArt} ${styles[panel.artClass]}`}
                    role="img"
                    aria-label={panel.alt}
                  />
                  <div className={styles.comicCopy}>
                    <span aria-hidden="true">{panel.number}</span>
                    <div>
                      <h3>{panel.title}</h3>
                      <p>{panel.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className={styles.firstVisitSection}
          aria-labelledby="first-visit-title"
        >
          <div className={styles.sectionInner}>
            <div className={styles.firstVisitIntro}>
              <div>
                <p className={styles.eyebrow}>FIRST VISIT</p>
                <h2 id="first-visit-title">はじめてのかたへ</h2>
              </div>
              <p>
                はじめて利用するお子さまと保護者の方に、来る前に確認していただきたいことをまとめました。
              </p>
            </div>

            <div className={styles.factGrid}>
              {firstVisitFacts.map((fact) => (
                <article className={styles.factCard} key={fact.title}>
                  <span className={styles.factIcon} aria-hidden="true">
                    {fact.icon}
                  </span>
                  <div>
                    <h3>{fact.title}</h3>
                    <p>{fact.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside className={styles.confirmationNote} aria-label="事前確認のお願い">
              <strong>事前に確認したいことがある場合</strong>
              <p>
                予約や付き添い、食事内容などについて心配なことがある場合は、ご来場前にお問い合わせください。
              </p>
            </aside>
          </div>
        </section>

        <section className={styles.actionSection} aria-labelledby="action-title">
          <div className={styles.actionCard}>
            <p className={styles.eyebrow}>SEE YOU SOON</p>
            <h2 id="action-title">まずは 開催日を みてみよう</h2>
            <p>みんなに 会えるのを、たのしみに まっています。</p>
            <div className={styles.actions}>
              <a
                className={styles.primaryAction}
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagramで開催日を見る
                <span aria-hidden="true">↗</span>
              </a>
              <a
                className={styles.secondaryAction}
                href={site.map}
                target="_blank"
                rel="noopener noreferrer"
              >
                地図を見る
                <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.secondaryAction} href={`mailto:${site.email}`}>
                メールで問い合わせる
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
