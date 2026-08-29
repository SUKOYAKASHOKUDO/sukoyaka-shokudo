import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { site } from "../../content/siteContent";
import styles from "./kids-guide.module.css";

export const metadata: Metadata = {
  title: "こどものみんなへ｜はじめてのすこやか食堂",
  description:
    "すこやか食堂へはじめて来る子どもと保護者の方へ、開催日の確認、料金、場所、食物アレルギーについて分かりやすくご案内します。",
  alternates: { canonical: "/kids" },
};

const comicPanels = [
  {
    number: "1",
    title: "「きょうは やってるかな？」",
    description: "おうちの ひとと ひにちを みてみよう！",
    artClass: "topLeft",
    toneClass: "yellow",
    alt: "クマとウサギがカレンダーとスマートフォンで開催日を確認しているイラスト",
  },
  {
    number: "2",
    title: "「こんにちは！」",
    description: "すこやかしょくどうへ ようこそ。",
    artClass: "topRight",
    toneClass: "mint",
    alt: "食堂の入口でクマがウサギと小鳥を迎えているイラスト",
  },
  {
    number: "3",
    title: "「みんなで いただきます！」",
    description: "ちゅうがくせいまでの こどもは むりょうだよ。",
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

const kidsRules = [
  {
    number: "1",
    title: "じかんを まもろう",
    text: null,
  },
  {
    number: "2",
    title: "そとでは しずかに まとう",
    text: "まんしょんの まえや そとでは、おおきな こえで おしゃべりしたり、あそびまわったり しないでね。",
  },
  {
    number: "3",
    title: "あいさつを しよう",
    text: "きたときは こんにちは、かえるときは ごちそうさまと いってみよう。",
  },
  {
    number: "4",
    title: "てを きれいに しよう",
    text: "ごはんの まえに てを あらおう。といれでは あそばないでね。",
  },
  {
    number: "5",
    title: "たべられる ぶんだけに しよう",
    text: "たべものを のこさないように、たべきれる ぶんだけ とろう。",
  },
  {
    number: "6",
    title: "ばらんすよく たべよう",
    text: "おにくや おさかなだけでなく、やさいも いっしょに たべてみよう。",
  },
  {
    number: "7",
    title: "つかったものを かたづけよう",
    text: "じぶんで つかった おさらや こっぷは、じぶんで かたづけよう。",
  },
  {
    number: "8",
    title: "あれるぎーを かくにんしてね",
    text: "あれるぎーに あわせた しょくじは つくっていません。しんぱいな ひとは、おうちの ひとと しょくじの なかみを かくにんしてね。",
  },
] as const;

const firstVisitFacts = [
  {
    icon: "calendar",
    title: "開催日",
    text: "現在は不定期で開催しています。ご来場前に、公式Instagramで最新の開催日時とメニューをご確認ください。",
  },
  {
    icon: "meal",
    title: "利用料金",
    text: "中学生以下は無料です。大人の方は1食500円でご利用いただけます。",
  },
  {
    icon: "location",
    title: "場所",
    text: `${site.shortAddress}。札幌市電「山鼻9条駅」から徒歩4分です。`,
  },
  {
    icon: "carrot",
    title: "食物アレルギー",
    text: "個別のアレルギー対応食・除去食は提供していません。食物アレルギーがある場合は、保護者の方が食事内容をご確認ください。",
  },
  {
    icon: "child",
    title: "小さなお子さま",
    text: "提供する食事を安全に食べられることを前提に、年齢や食事について心配がある場合は事前にご相談ください。",
  },
  {
    icon: "book",
    title: "過ごし方",
    text: "絵本やおもちゃをご用意しています。にぎやかに過ごすことや、じっとしていることが苦手なお子さまもご利用いただけます。",
  },
] as const;

type GuideIconName = (typeof firstVisitFacts)[number]["icon"];

function GuideIcon({ name }: { name: GuideIconName }) {
  const commonProps = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    focusable: false,
    "aria-hidden": true,
  };

  switch (name) {
    case "calendar":
      return (
        <svg {...commonProps}>
          <path d="M13 10v6M35 10v6M9 19h30" />
          <rect x="9" y="13" width="30" height="27" rx="6" />
          <path d="M16 26h4M28 26h4M16 33h4M28 33h4" />
        </svg>
      );
    case "meal":
      return (
        <svg {...commonProps}>
          <path d="M10 25h28c0 8-5.5 14-14 14S10 33 10 25Z" />
          <path d="M14 25c1-7 6-11 10-11s9 4 10 11M17 39h14" />
          <path d="M19 10c-2 2-2 4 0 6M27 8c-2 2-2 5 0 7" />
        </svg>
      );
    case "location":
      return (
        <svg {...commonProps}>
          <path d="M24 42s13-11.6 13-23a13 13 0 1 0-26 0c0 11.4 13 23 13 23Z" />
          <circle cx="24" cy="19" r="4.5" />
        </svg>
      );
    case "carrot":
      return (
        <svg {...commonProps}>
          <path d="M17 18c6-4 11-2 14 1 3 3 4 8 0 14L20 43c-2 2-5 .4-4-2l4-15c.6-3-.6-5-3-8Z" />
          <path d="M21 16c-1-5 1-9 5-11M25 16c2-6 6-8 10-8M28 18c5-4 9-3 12-1" />
          <path d="m20 28 7 3M18 34l6 3" />
        </svg>
      );
    case "child":
      return (
        <svg {...commonProps}>
          <circle cx="15" cy="15" r="5" />
          <circle cx="33" cy="15" r="5" />
          <path d="M36 26c0 9-5 15-12 15S12 35 12 26c0-8 5-14 12-14s12 6 12 14Z" />
          <circle cx="19.5" cy="25" r="1" fill="currentColor" stroke="none" />
          <circle cx="28.5" cy="25" r="1" fill="currentColor" stroke="none" />
          <path d="M21 32c2 2 4 2 6 0" />
        </svg>
      );
    case "book":
      return (
        <svg {...commonProps}>
          <path d="M7 11h11c4 0 6 2 6 6v24c0-4-2-6-6-6H7V11Z" />
          <path d="M41 11H30c-4 0-6 2-6 6v24c0-4 2-6 6-6h11V11Z" />
          <path d="M12 18h6M12 24h7M30 18h6M29 24h7" />
        </svg>
      );
  }
}

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
            <p className={styles.eyebrow}>
              <ruby>
                KIDS GUIDE<rt>きっず がいど</rt>
              </ruby>
            </p>
            <h1 id="kids-guide-title">
              こどものみんなへ
              <span>
                はじめての すこやか
                <ruby>
                  食堂<rt>しょくどう</rt>
                </ruby>
              </span>
            </h1>
            <p className={styles.heroLead}>
              こどもも おとなも、いっしょに ごはんを たべられる まちの
              <ruby>
                食堂<rt>しょくどう</rt>
              </ruby>
              です。
            </p>
          </div>
        </section>

        <section className={styles.rulesSection} aria-labelledby="rules-title">
          <div className={styles.sectionInner}>
            <div className={styles.rulesHeading}>
              <div>
                <p className={styles.eyebrow}>
                  <ruby>
                    SUKOYAKA RULES<rt>すこやか るーるず</rt>
                  </ruby>
                </p>
                <h2 id="rules-title">おやくそくも まもってね</h2>
              </div>
              <p>
                みんなが きもちよく ごはんを たべられるように、
                <ruby>
                  8つの<rt>やっつの</rt>
                </ruby>
                おやくそくを よんでから きてね。
              </p>
            </div>

            <ol className={styles.rulesGrid}>
              {kidsRules.map((rule) => (
                <li className={styles.ruleCard} key={rule.number}>
                  <span aria-hidden="true">{rule.number}</span>
                  <div>
                    <h3>{rule.title}</h3>
                    {rule.text ? <p>{rule.text}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.comicSection} aria-labelledby="comic-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeading}>
              <p>
                <ruby>
                  4つのコマ<rt>よっつの こま</rt>
                </ruby>
                で みてみよう
              </p>
              <h2 id="comic-title">
                すこやか
                <ruby>
                  食堂<rt>しょくどう</rt>
                </ruby>
                に いく
                <ruby>
                  日<rt>ひ</rt>
                </ruby>
              </h2>
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
                    <GuideIcon name={fact.icon} />
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
