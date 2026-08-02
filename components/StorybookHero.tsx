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
    href: "/story",
    label: "すこやか食堂を知る",
    icon: "microphone",
  },
] as const;

function ReplacementCardIcon({
  name,
}: {
  name: (typeof replacementCards)[number]["icon"];
}) {
  if (name === "heartHands") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path
          className="replacement-icon-heart"
          d="M48 47C27 35 24 20 33 14c7-5 13-1 15 5 3-6 9-10 16-5 9 6 6 21-16 33Z"
        />
        <path
          className="replacement-icon-hand"
          d="M43 80c-10-4-20-9-28-16-4-4-5-9-3-12 2-3 6-2 9 1l9 7-10-16c-2-4-1-8 2-9 3-1 6 1 8 4l10 16 4-8c2-4 7-5 10-2 2 2 2 5 1 8l-5 14c-1 5-3 9-7 13Z"
        />
        <path
          className="replacement-icon-hand"
          d="M53 80c10-4 20-9 28-16 4-4 5-9 3-12-2-3-6-2-9 1l-9 7 10-16c2-4 1-8-2-9-3-1-6 1-8 4L56 55l-4-8c-2-4-7-5-10-2-2 2-2 5-1 8l5 14c1 5 3 9 7 13Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <g transform="rotate(42 48 48)">
        <rect
          className="replacement-icon-mic-body"
          x="35"
          y="8"
          width="26"
          height="50"
          rx="13"
        />
        <path
          className="replacement-icon-mic-line"
          d="M28 42v4c0 12 9 21 20 21s20-9 20-21v-4M48 67v16M36 83h24"
        />
        <path className="replacement-icon-mic-shine" d="M43 16c-4 2-6 6-6 11" />
      </g>
    </svg>
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
