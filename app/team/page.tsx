import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { ZaikaiSapporoArticle } from "../../components/ZaikaiSapporoArticle";
import { legacyTeam } from "../../content/legacyContent";

export const metadata: Metadata = {
  title: "私たちについて・ボランティア",
  description:
    "すこやか食堂を運営するミレポリト合同会社、財界さっぽろ掲載記事、ボランティアの内容と体験談をご紹介します。",
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

        <section id="volunteer" className="mashiro-section">
          <div className="shell mashiro-volunteer-grid">
            <div>
              <p className="mashiro-kicker">ボランティアについて · VOLUNTEER</p>
              <h2>ボランティア募集</h2>
              <h3>好きな時間に、できそうなお手伝いを。</h3>
              {legacyTeam.recruitment.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link className="mashiro-button" href="/support">
                ボランティアについて相談
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mashiro-task-board">
              <p>内容の具体例</p>
              <ul>
                {legacyTeam.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mashiro-section mashiro-testimonial-section">
          <div className="shell">
            <div className="mashiro-section-title">
              <div>
                <p className="mashiro-kicker">VOICE</p>
                <h2>ボランティア体験談</h2>
              </div>
              <p>
                北海道医療大学ボランティアネットワークサークルの学生さんと、中学生女児が興味を持ち、お手伝いしていただきました。
              </p>
            </div>
            <blockquote className="mashiro-testimonial">
              {legacyTeam.testimonial.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
