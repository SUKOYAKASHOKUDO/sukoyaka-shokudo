import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { ZaikaiSapporoArticle } from "../../components/ZaikaiSapporoArticle";
import { legacyTeam } from "../../content/legacyContent";

export const metadata: Metadata = {
  title: "私たちについて・ボランティア",
  description:
    "すこやか食堂を運営するミレポリト合同会社と、財界さっぽろ掲載記事をご紹介します。",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site team-page">
        <section className="mashiro-section mashiro-soft-section">
          <div className="shell mashiro-reading-layout">
            <aside>
              <p className="mashiro-kicker">運営企業 · OPERATOR</p>
              <h2>ミレポリト合同会社</h2>
            </aside>
            <div className="mashiro-prose">
              <p>{legacyTeam.operator[0]}</p>
              <h3>事業例</h3>
              {legacyTeam.operator.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <ZaikaiSapporoArticle />
      </main>
      <SiteFooter />
    </>
  );
}
