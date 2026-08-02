import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MashiroPageHero } from "../../components/MashiroPageHero";
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
        <MashiroPageHero
          eyebrow="ABOUT SUKOYAKA"
          title="札幌市中央区にある、子ども食堂"
          description="どうか、子ども食堂にネガティブなイメージを持たないでください。食事をきっかけに、人と人が顔見知りになれる楽しい場所を目指しています。"
          current="すこやか食堂について"
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
              <h2>食事は、美味しく楽しいものです。</h2>
              {legacyAbout.opening.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
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

        <section className="mashiro-section">
          <div className="shell mashiro-reading-layout">
            <aside>
              <p className="mashiro-kicker">OUR TABLE</p>
              <h2>1.子ども食堂利用に対してのお願い</h2>
            </aside>
            <div className="mashiro-prose">
              {legacyAbout.request.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link className="mashiro-arrow-link" href="/schedule">
                日程とメニューを見る
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mashiro-section mashiro-ink-section">
          <div className="shell mashiro-reading-layout">
            <aside>
              <p className="mashiro-kicker">BACKGROUND</p>
              <h2>札幌に、こんな子ども食堂が多い</h2>
              <h3>一般的な“子ども食堂の目的”とは？</h3>
            </aside>
            <div className="mashiro-prose">
              <h3>子ども食堂の現実</h3>
              {legacyAbout.background.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="mashiro-source-links">
                {legacyAbout.sources.map((source) => (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={source.url}
                  >
                    引用：{source.label}
                  </a>
                ))}
              </div>
              <p className="mashiro-small-note">
                上記は旧公式サイトの文章をそのまま引き継いだアーカイブ情報です。統計や制度の最新状況は各引用元をご確認ください。
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
