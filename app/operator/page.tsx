import type { Metadata } from "next";
import { MashiroInterviewFeature } from "../../components/MashiroInterviewFeature";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { ZaikaiSapporoArticle } from "../../components/ZaikaiSapporoArticle";

export const metadata: Metadata = {
  title: "私たちについて・ボランティア",
  description:
    "すこやか食堂を運営するミレポリト合同会社と、財界さっぽろ掲載記事をご紹介します。",
  alternates: { canonical: "/operator" },
};

export default function OperatorPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site team-page">
        <section className="mashiro-section mashiro-soft-section operator-summary-section">
          <div className="shell mashiro-reading-layout">
            <aside>
              <p className="mashiro-kicker">運営企業 · OPERATOR</p>
              <h2>ミレポリト合同会社</h2>
            </aside>
            <div className="mashiro-prose operator-name-story">
              <p>
                <strong>“ミレポリト”</strong>は、フランス語で愛すべき子とゆう意味です。
              </p>
            </div>
          </div>
        </section>

        <ZaikaiSapporoArticle />
        <MashiroInterviewFeature />
      </main>
      <SiteFooter />
    </>
  );
}
