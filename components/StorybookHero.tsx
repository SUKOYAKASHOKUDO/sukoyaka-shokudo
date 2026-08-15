import Image from "next/image";
import Link from "next/link";
import { site } from "../content/siteContent";

const internalHotspots = [
  { className: "reference-hotspot-logo", href: "/", label: "すこやか食堂 ホーム" },
  { className: "reference-hotspot-home", href: "/", label: "ホーム" },
] as const;

export function StorybookHero() {
  return (
    <section
      className="reference-design-hero"
      aria-labelledby="storybook-heading"
    >
      <div className="reference-design-frame">
        <Image
          className="reference-design-image"
          src="/images/brand/sukoyaka-site-design-wordmark.webp"
          alt="水色の空と丘を背景に、おにぎりを持つクマ、食事を持つウサギ、小鳥が描かれた、すこやか食堂のご案内"
          width={1672}
          height={941}
          sizes="100vw"
          priority
          unoptimized
          draggable={false}
        />

        <div className="reference-nav-visual-shift" aria-hidden="true" />
        <div className="reference-design-nav-blank" aria-hidden="true" />

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
      </div>
    </section>
  );
}
