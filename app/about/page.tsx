import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "../../components/PageIntro";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { legacyAbout } from "../../content/legacyContent";

export const metadata: Metadata = {
  title: "すこやか食堂について｜代表の思い",
  description:
    "札幌市中央区の子ども食堂「すこやか食堂」が大切にしていること、代表の思い、地域の食卓として目指す場所をご紹介します。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site">
        <PageIntro
          eyebrow="ABOUT SUKOYAKA"
          title="札幌市中央区にある、子ども食堂"
          description="おなかがすいた日も、だれかと一緒に食べたい日も。どなたでも気軽に来られる、地域の食堂です。"
        />

        <section className="mashiro-section">
          <div className="shell mashiro-editorial-grid">
            <figure className="mashiro-editorial-photo">
              <Image
                src="/images/legacy/legacy-photo-01.webp"
                alt="すこやか食堂で食卓を囲む子どもたち"
                fill
                sizes="(max-width: 900px) 92vw, 45vw"
                priority
              />
            </figure>
            <div className="mashiro-prose mashiro-prose-large">
              <p className="mashiro-kicker">“すこやか食堂”</p>
              <h2>食事は、おいしく楽しいものです。</h2>
              {legacyAbout.opening.map((paragraph) => (
                <p key={paragraph} style={{ whiteSpace: "pre-line" }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="mashiro-section mashiro-soft-section">
          <div className="shell mashiro-editorial-grid mashiro-editorial-reverse">
            <div className="mashiro-prose mashiro-prose-large">
              <p className="mashiro-kicker">MESSAGE</p>
              <h2>働くママの少しでもサポートができたら。</h2>
              {legacyAbout.message.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <figure className="mashiro-editorial-photo mashiro-portrait-layout">
              <Image
                src="/images/legacy/legacy-photo-02.webp"
                alt="すこやか食堂の店舗前に立つ運営スタッフ"
                fill
                sizes="(max-width: 900px) 92vw, 40vw"
              />
            </figure>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
