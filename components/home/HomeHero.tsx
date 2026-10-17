import Image from "next/image";
import styles from "./home-top.module.css";

const rows = [
  [{ name: "kids", href: "/kids", label: "こどものみんなへ", width: 518.32, height: 162.793 },
   { name: "family", href: "/about", label: "おうちの方へ", width: 491.568, height: 162.793 }],
  [{ name: "schedule", href: "/schedule", label: "次回の開催", width: 518.32, height: 138.327 },
   { name: "recipes", href: "/recipes", label: "レシピとコラム", width: 491.568, height: 138.327 }],
] as const;

export function HomeHero() {
  return <section className={styles.hero} aria-labelledby="storybook-heading" data-home-hero>
    <div className={styles.heroSurface}>
      <div className={styles.sceneFrame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.scene} src="/images/home-rebuild/hero-scene.png" width="3344" height="878" fetchPriority="high" loading="eager" alt="水色の空と丘を背景に、おにぎりを持つクマ、食事を持つウサギ、小鳥が描かれた、すこやか食堂のご案内" />
      </div>
      <div className={styles.srOnly}><h1 id="storybook-heading">おなかも こころも ぽかぽかに。</h1><p>中学生以下 無料／大人 500円</p></div>
      <nav className={styles.heroMenu} aria-label="トップメニュー">
        {rows.map((cards, index) => <div className={styles.menuRow} key={index}>
          {cards.map((card, column) => <a key={card.name} href={card.href} data-card={card.name} className={styles.pictureCard} style={{ gridColumn: column === 0 ? 1 : 3, aspectRatio: `${card.width} / ${card.height}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/home-rebuild/menu-${card.name}.png`} width={Math.ceil(card.width) * 2} height={Math.ceil(card.height) * 2} alt="" />
            <span className={styles.srOnly}>{card.label}</span>
          </a>)}
          <a className={styles.supportCard} href={index === 0 ? "/support" : "/sponsorship"} data-card={index === 0 ? "support" : "sponsor"}>
            <span className={styles.supportIcon} aria-hidden="true">{index === 0
              ? <Image src="/images/brand/support-heart-hands.png" alt="" width={256} height={256} unoptimized />
              : <Image src="/images/brand/support-partners-house-heart.png" alt="" width={447} height={447} unoptimized />}</span>
            <strong>{index === 0 ? <><span>すこやか食堂を</span><span>応援する</span></> : <span>スポンサー</span>}</strong>
            <span className={styles.cardArrow} aria-hidden="true">›</span>
          </a>
        </div>)}
      </nav>
    </div>
  </section>;
}
