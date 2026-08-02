import Image from "next/image";
import Link from "next/link";
import { site } from "../content/siteContent";

const internalHotspots = [
  { className: "reference-hotspot-logo", href: "/", label: "すこやか食堂 ホーム" },
  { className: "reference-hotspot-home", href: "/", label: "ホーム" },
  {
    className: "reference-hotspot-about",
    href: "/about",
    label: "すこやか食堂について",
  },
  {
    className: "reference-hotspot-schedule-nav",
    href: "/schedule",
    label: "開催のおしらせ",
  },
  {
    className: "reference-hotspot-recipes-nav",
    href: "/recipes",
    label: "レシピとコラム",
  },
  {
    className: "reference-hotspot-support-nav",
    href: "/support",
    label: "すこやか食堂を応援する",
  },
  {
    className: "reference-hotspot-kids",
    href: "/schedule",
    label: "こどものみんなへ",
  },
  {
    className: "reference-hotspot-family",
    href: "/about",
    label: "おうちの方へ",
  },
  {
    className: "reference-hotspot-schedule-card",
    href: "/schedule",
    label: "次回の開催",
  },
  {
    className: "reference-hotspot-recipes-card",
    href: "/recipes",
    label: "レシピとコラム",
  },
] as const;

const replacementCards = [
  {
    className: "reference-card-replacement-support",
    href: "/support",
    label: "すこやか食堂を応援する",
    icon: "heartHands",
  },
  {
    className: "reference-card-replacement-story",
    href: "/partners",
    label: "応援企業のご紹介",
    icon: "partnerBuilding",
  },
] as const;

function ReplacementCardIcon({
  name,
}: {
  name: (typeof replacementCards)[number]["icon"];
}) {
  if (name === "heartHands") {
    return (
      <Image
        className="reference-card-heart-hands"
        src="/images/brand/support-heart-hands.png"
        alt=""
        width={256}
        height={256}
        unoptimized
      />
    );
  }

  return (
    <Image
      className="reference-card-partner-icon"
      src="/images/brand/support-partners-house-heart.png"
      alt=""
      width={447}
      height={447}
      unoptimized
    />
  );
}

export function StorybookHero() {
  return (
    <section
      className="reference-design-hero"
      aria-labelledby="storybook-heading"
    >
      <div className="reference-design-frame">
        <Image
          className="reference-design-image"
          src="/images/brand/sukoyaka-site-design-reference.webp"
          alt="水色の空と丘を背景に、おにぎりを持つクマ、食事を持つウサギ、小鳥が描かれた、すこやか食堂のご案内"
          width={1672}
          height={941}
          sizes="100vw"
          priority
          unoptimized
          draggable={false}
        />

        <span className="reference-design-logo-swap" aria-hidden="true">
          <Image
            src="/images/brand/sukoyaka-onigiri-logo-transparent-clean.webp"
            alt=""
            width={1097}
            height={731}
            priority
            unoptimized
            draggable={false}
          />
        </span>

        <div className="reference-design-copy">
          <h1 id="storybook-heading">おなかも こころも ぽかぽかに。</h1>
          <p>中学生以下 無料／大人 500円</p>
        </div>

        <nav className="reference-design-links" aria-label="トップメニュー">
          {internalHotspots.map((hotspot) => (
            <Link
              className={`reference-hotspot ${hotspot.className}`}
              href={hotspot.href}
              key={hotspot.className}
            >
              <span>{hotspot.label}</span>
            </Link>
          ))}
          <a
            className="reference-hotspot reference-hotspot-contact"
            href={`mailto:${site.email}`}
          >
            <span>お問い合わせ</span>
          </a>
        </nav>

        <nav className="reference-card-replacements" aria-label="目的別のご案内">
          {replacementCards.map((card) => (
            <Link
              className={`reference-card-replacement ${card.className}`}
              href={card.href}
              key={card.label}
            >
              <span className="reference-card-replacement-icon" aria-hidden="true">
                <ReplacementCardIcon name={card.icon} />
              </span>
              <strong>{card.label}</strong>
              <span className="reference-card-replacement-arrow" aria-hidden="true">
                ›
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
