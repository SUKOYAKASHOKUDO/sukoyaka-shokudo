import type { Metadata } from "next";
import { MashiroPageHero } from "../../components/MashiroPageHero";
import { PartnerShowcaseCard } from "../../components/PartnerShowcaseCard";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { communityPartners, site } from "../../content/siteContent";

export const metadata: Metadata = {
  title: "応援企業のご紹介",
  description:
    "すこやか食堂の活動を支えてくださる企業・団体をご紹介します。協賛・企業掲載についてもご相談いただけます。",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  const inquirySubject = encodeURIComponent(
    "すこやか食堂の協賛・企業掲載について",
  );

  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site partners-page">
        <MashiroPageHero
          eyebrow="COMMUNITY PARTNERS"
          title="応援企業のご紹介"
          description="地域の子どもたちと食卓を支えてくださる企業・団体の皆さまを、感謝を込めてご紹介します。"
          current="応援企業のご紹介"
        />

        <section className="mashiro-section partner-intro-section">
          <div className="shell partner-intro-grid">
            <div>
              <p className="mashiro-kicker">TOGETHER FOR THE COMMUNITY</p>
              <h2>地域への想いが、企業の信頼として届く場所。</h2>
            </div>
            <div className="mashiro-prose">
              <p>
                ご支援いただいた企業・団体について、会社ロゴ、会社名、活動や事業の概要、公式サイトをご紹介します。
              </p>
              <p>
                掲載内容は事前に確認し、地域へのあたたかな支援が伝わる、上品で見やすいページとして整えます。
              </p>
            </div>
          </div>
        </section>

        <section className="mashiro-section partner-gallery-section">
          <div className="shell">
            <div className="partner-section-heading">
              <p className="mashiro-kicker">OUR SUPPORTERS</p>
              <h2>すこやか食堂を応援してくださる皆さま</h2>
            </div>

            <div className="partner-showcase-list">
              {communityPartners.length > 0 ? (
                communityPartners.map((partner) => (
                  <PartnerShowcaseCard key={partner.name} {...partner} />
                ))
              ) : (
                <PartnerShowcaseCard
                  name="貴社名"
                  summary="会社や事業の概要、地域への想い、ご支援についてのメッセージなどを、読みやすく簡潔にご紹介します。"
                  preview
                />
              )}
            </div>
          </div>
        </section>

        <section className="mashiro-section partner-inquiry-section" id="partner-inquiry">
          <div className="shell partner-inquiry-card">
            <div>
              <p className="mashiro-kicker">PARTNERSHIP</p>
              <h2>掲載・協賛について相談する</h2>
              <p>
                掲載内容やご支援の方法は、活動状況とご希望を確認しながら個別にご案内します。
              </p>
            </div>
            <a
              className="mashiro-button partner-inquiry-button"
              href={`mailto:${site.email}?subject=${inquirySubject}`}
            >
              メールで相談する
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
