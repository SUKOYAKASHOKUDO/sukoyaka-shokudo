import Image from "next/image";
import styles from "./home.module.css";

const artwork = "/images/brand/sukoyaka-site-design-wordmark.webp";
const pictureCards = [
  { name: "kids", href: "/kids", label: "こどものみんなへ", viewBox: "50.16 593.771 518.32 162.793" },
  { name: "family", href: "/about", label: "おうちの方へ", viewBox: "590.216 593.771 491.568 162.793" },
  { name: "schedule", href: "/schedule", label: "次回の開催", viewBox: "50.16 774.443 518.32 138.327" },
  { name: "recipes", href: "/recipes", label: "レシピとコラム", viewBox: "590.216 774.443 491.568 138.327" },
];

export function HomeHero() {
  return <section className={styles.hero} aria-labelledby="storybook-heading" data-home-hero>
    <div className={styles.heroSurface}>
      <svg className={styles.scene} width="1672" height="438.506" viewBox="0 155.265 1672 438.506" role="img" aria-label="水色の空と丘を背景に、おにぎりを持つクマ、食事を持つウサギ、小鳥が描かれた、すこやか食堂のご案内">
        <image href={artwork} width="1672" height="941" />
      </svg>
      <div className={styles.srOnly}><h1 id="storybook-heading">おなかも こころも ぽかぽかに。</h1><p>中学生以下 無料／大人 500円</p></div>
      <nav className={styles.heroMenu} aria-label="トップメニュー">
        {pictureCards.map(card => <a key={card.name} href={card.href} data-card={card.name} className={styles.pictureCard}>
          <svg viewBox={card.viewBox} aria-hidden="true" focusable="false"><image href={artwork} width="1672" height="941" /></svg><span className={styles.srOnly}>{card.label}</span>
        </a>)}
        <a className={styles.supportCard} href="/support" data-card="support">
          <span className={styles.supportIcon} aria-hidden="true"><Image src="/images/brand/support-heart-hands.png" alt="" width={256} height={256} unoptimized /></span>
          <strong><span>すこやか食堂を</span><span>応援する</span></strong><span className={styles.cardArrow} aria-hidden="true">›</span>
        </a>
        <a className={styles.supportCard} href="/sponsorship" data-card="sponsor">
          <span className={styles.supportIcon} aria-hidden="true"><Image src="/images/brand/support-partners-house-heart.png" alt="" width={447} height={447} unoptimized /></span>
          <strong><span>スポンサー</span></strong><span className={styles.cardArrow} aria-hidden="true">›</span>
        </a>
      </nav>
    </div>
  </section>;
}
