import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { CorporateSponsorCarousel } from "../../components/CorporateSponsorCarousel";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { SponsorshipHashCleanup } from "../../components/SponsorshipHashCleanup";
import styles from "./shirushi-sponsor.module.css";
import {
  getPublishedCorporateSponsors,
  site,
} from "../../content/siteContent";

export const metadata: Metadata = {
  title: { absolute: "企業スポンサーのご紹介・募集｜すこやか食堂" },
  description:
    "すこやか食堂では、子どもたちが安心して食事を楽しめる地域の居場所づくりを応援してくださる企業スポンサーを募集しています。会社ロゴや会社情報の掲載、年1回の活動報告をご用意しています。",
  alternates: { canonical: "/sponsorship" },
};

const sponsorSubject = encodeURIComponent(
  "すこやか食堂の企業スポンサーについて",
);
const sponsorMailto = `mailto:${site.email}?subject=${sponsorSubject}`;

const sponsorshipBenefits = [
  {
    number: "01",
    title: "子どもたちの食事を支える",
    description: "協賛金を、食材費や活動運営費などに活用します。",
  },
  {
    number: "02",
    title: "企業情報をご紹介",
    description:
      "会社ロゴ、会社名、会社概要、応援メッセージ、公式サイトをご紹介します。",
  },
  {
    number: "03",
    title: "年1回の活動報告",
    description:
      "年間開催回数や活動の様子を、A4・1枚の年間スポンサー活動報告書にまとめてお送りします。",
  },
  {
    number: "04",
    title: "地域への応援を、見えるかたちに",
    description:
      "年間活動報告書と紹介文をご用意し、企業サイトのサステナビリティ・CSRページや社内報などで、地域貢献の取り組みとしてご紹介いただけます。",
  },
] as const;

const partnershipPlans = [
  {
    title: "企業スポンサー",
    price: "月額10,000円〜",
    benefits: [
      "公式サイトに企業名・ロゴ掲載",
      "応援メッセージ掲載",
      "年1回の活動報告",
    ],
  },
  {
    title: "PRパートナー",
    price: "月額20,000円〜",
    benefits: [
      "店内パンフレット・ポスター設置",
      "シニア向け／ファミリー向けPRスペース掲載",
      "食材・商品提供企業として紹介",
    ],
  },
  {
    title: "地域共創パートナー",
    price: "月額30,000円〜",
    benefits: [
      "地域イベント・体験企画との連携",
      "CSR・地域貢献活動として紹介",
      "企業特性に合わせた連携企画を相談",
    ],
  },
  {
    title: "専門家連携パートナー",
    price: "参加費無料",
    description:
      "司法書士・税理士・弁護士・FPなどの専門家と連携し、地域住民向けの無料相談機会を設けます。",
    volunteer: true,
  },
] as const;

const sponsorSteps = [
  {
    number: "01",
    title: "お問い合わせ",
    description: "メールで、ご希望の支援内容をお知らせください。",
  },
  {
    number: "02",
    title: "内容の確認",
    description: "協賛内容、契約期間、掲載内容などを確認します。",
  },
  {
    number: "03",
    title: "お申込み・ご契約",
    description: "内容をご確認いただき、必要な書類を取り交わします。",
  },
  {
    number: "04",
    title: "スポンサー掲載",
    description: "会社ロゴ、会社概要、公式サイトなどを掲載します。",
  },
  {
    number: "05",
    title: "年間活動報告",
    description:
      "年度終了後に、A4・1枚の年間スポンサー活動報告書をお送りします。",
  },
] as const;

const sponsorFaqs = [
  {
    question: "相談だけでも大丈夫ですか？",
    answer:
      "はい。まだ具体的な内容が決まっていない段階でも大丈夫です。まずはご希望やご関心についてお聞かせください。",
  },
  {
    question: "スポンサー料金はいくらですか？",
    answer:
      "企業スポンサーは月額10,000円からご用意しています。店内PRや地域連携など、ご希望に合わせたプランもございます。",
  },
  {
    question: "小さな会社でもスポンサーになれますか？",
    answer:
      "はい。会社の規模にかかわらず、すこやか食堂の活動に賛同してくださる企業・団体の皆さまからのご相談を受け付けています。",
  },
  {
    question: "どのように会社を紹介してもらえますか？",
    answer:
      "会社ロゴ、会社名、会社概要、応援メッセージ、公式サイトなどを掲載できます。掲載内容は、公開前に必ずご確認いただきます。",
  },
  {
    question: "どのくらいの期間から申し込めますか？",
    answer:
      "ご希望を伺いながら、スポンサー期間を個別にご案内します。短期間のご相談についても、まずはお問い合わせください。",
  },
  {
    question: "活動の報告は受け取れますか？",
    answer:
      "はい。年1回、年間開催回数や活動の様子をまとめたA4・1枚の年間スポンサー活動報告書をお送りします。",
  },
  {
    question: "まずは何を伝えればよいですか？",
    answer:
      "会社名、ご担当者名、ご希望の支援内容が分かる範囲でお知らせください。詳しい内容が決まっていなくても大丈夫です。",
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="corporate-sponsor-heading">
      <p className="mashiro-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export default function PartnersPage() {
  const publishedSponsors = getPublishedCorporateSponsors();

  return (
    <>
      <SponsorshipHashCleanup />
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site corporate-sponsor-page">
        <section className="mashiro-section corporate-sponsor-hero">
          <div className="shell corporate-sponsor-hero-grid">
            <div>
              <p className="mashiro-kicker">CORPORATE SPONSOR</p>
              <h1>
                企業の皆さまと、
                <br />
                子どもたちが安心して
                <br />
                食事を楽しめる居場所を。
              </h1>
              <p className="corporate-sponsor-lead">
                すこやか食堂では、子どもたちが安心して食事を楽しめる地域の居場所づくりを、継続的に応援してくださる企業スポンサーを募集しています。
              </p>
              <div className="corporate-sponsor-actions">
                <a className="mashiro-button" href={sponsorMailto}>
                  スポンサーについて相談する
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <aside
              className="corporate-sponsor-hero-summary"
              aria-label="スポンサー制度の概要"
            >
              <span>SPONSORSHIP OVERVIEW</span>
              <ul>
                <li>公式サイトで企業情報をご紹介</li>
                <li>年1回、A4・1枚の活動報告</li>
                <li>企業スポンサー 月額10,000円〜</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="mashiro-section corporate-sponsor-about">
          <div className="shell">
            <SectionHeading
              eyebrow="ABOUT SPONSORSHIP"
              title="すこやか食堂の企業スポンサー制度"
              description="企業スポンサーの皆さまからいただいた協賛金は、食材費、調味料、衛生用品、会場運営費など、すこやか食堂の活動を継続するために活用します。スポンサー企業には、公式サイトでの企業紹介と、年1回の年間スポンサー活動報告書をご用意します。"
            />
            <div className="corporate-sponsor-benefits">
              {sponsorshipBenefits.map((benefit) => (
                <article key={benefit.number}>
                  <span>{benefit.number}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mashiro-section corporate-partnership-menu-section">
          <div className="shell">
            <SectionHeading
              eyebrow="PARTNERSHIP MENU"
              title={
                <>
                  企業・地域<wbr />パートナーメニュー
                </>
              }
              description="企業・専門家の皆さまと連携し、それぞれの形で地域を支える仕組みをご用意しています。"
            />
            <div className="corporate-partnership-menu-grid">
              {partnershipPlans.map((plan) => (
                <article
                  className={`corporate-partnership-menu-card${
                    "volunteer" in plan && plan.volunteer
                      ? " is-volunteer"
                      : ""
                  }`}
                  key={plan.title}
                >
                  <h3>{plan.title}</h3>
                  <p className="corporate-partnership-menu-price">
                    {plan.price}
                  </p>
                  {"benefits" in plan ? (
                    <ul>
                      {plan.benefits.map((benefit) => (
                        <li key={benefit}>{benefit}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="corporate-partnership-menu-description">
                      {plan.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
            <div className="corporate-partnership-menu-actions">
              <a className="mashiro-button" href={sponsorMailto}>
                スポンサー・連携について相談する
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="mashiro-section corporate-sponsor-list-section">
          <div className="shell">
            <SectionHeading
              eyebrow="OUR SPONSORS"
              title="すこやか食堂のスポンサー企業"
              description="すこやか食堂の活動を継続的に応援してくださるスポンサー企業をご紹介します。"
            />
            {publishedSponsors.length > 0 ? (
              <CorporateSponsorCarousel sponsors={publishedSponsors} />
            ) : (
              <>
                <div
                  className={`corporate-sponsor-preview ${styles.grid}`}
                  aria-label="しるし株式会社のスポンサー企業紹介"
                >
                  <article
                    className="partner-showcase-card"
                    style={{ width: "100%" }}
                  >
                    <div
                      className={`partner-showcase-body ${styles.body}`}
                      style={{
                        alignItems: "start",
                        gridTemplateColumns: "96px minmax(0, 1fr)",
                        paddingBlock: "12px",
                        rowGap: "8px",
                      }}
                    >
                      <div
                        className="partner-logo-column"
                        style={{ justifyContent: "flex-start", gap: "5px" }}
                      >
                        <div className="partner-logo-arch">
                          <Image
                            src="/images/sponsors/shirushi-logo-original.png"
                            alt="しるし株式会社のロゴ"
                            fill
                            sizes="96px"
                            style={{ objectFit: "contain", padding: "12px" }}
                          />
                        </div>
                        <span
                          className="partner-card-label"
                          style={{ fontSize: "10px", fontWeight: 800, lineHeight: 1.3 }}
                        >
                          COMMUNITY PARTNER
                        </span>
                      </div>
                      <div className={`partner-showcase-copy ${styles.copy}`}>
                        <div className={styles.heading}>
                          <h2>
                            <span style={{ whiteSpace: "nowrap" }}>しるし</span>
                            <wbr />
                            <span style={{ whiteSpace: "nowrap" }}>株式会社</span>
                          </h2>
                          <span
                            className="partner-showcase-rule"
                            aria-hidden="true"
                          />
                        </div>
                        <p
                          style={{
                            display: "block",
                            whiteSpace: "pre-line",
                            fontSize: "14px",
                            fontWeight: 600,
                            lineHeight: 1.6,
                          }}
                        >
                          {"しるし株式会社様は、ブロックチェーンやWeb3分野などで事業を展開されています。\n\nすこやか食堂の活動に対し、毎月の継続的なご支援に加え、ご寄付もお寄せいただいており、地域の子どもたちや食堂を利用される皆さまを支えてくださっています。\n\n日頃からの温かいご支援に、心より感謝申し上げます。"
                            .split("\n\n")
                            .map((paragraph, index) => (
                              <span
                                key={paragraph}
                                style={{
                                  display: "block",
                                  marginTop: index === 0 ? 0 : "8px",
                                }}
                              >
                                {paragraph}
                              </span>
                            ))}
                        </p>
                        <small style={{ fontSize: "11px", fontWeight: 800, marginTop: "4px" }}>
                          すこやか食堂の協賛企業
                        </small>
                      </div>
                    </div>
                    <footer
                      className="partner-showcase-footer"
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "5px",
                        paddingBlock: "8px",
                      }}
                    >
                      <strong style={{ fontSize: "12px", fontWeight: 700, lineHeight: 1.4 }}>
                        SHIRUSHI Inc.
                      </strong>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "5px",
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <a
                          href="https://shirushi.tokyo/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1.5, whiteSpace: "nowrap" }}
                        >
                          OFFICIAL WEBSITE
                        </a>
                        <a
                          href="https://note.com/shirushi_web3"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1.5, whiteSpace: "nowrap" }}
                        >
                          https://note.com/shirushi_web3
                        </a>
                        <a
                          href="https://shirushi.tokyo/blog/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1.5, whiteSpace: "nowrap" }}
                        >
                          https://shirushi.tokyo/blog/
                        </a>
                      </div>
                    </footer>
                  </article>
                </div>

              </>
            )}
            <article className="corporate-sponsor-recruitment">
              <div>
                <span>SPONSOR WANTED</span>
                <h3>企業スポンサーを募集しています</h3>
                <p>
                  すこやか食堂では、子どもたちのあたたかな食卓と、安心して過ごせる地域の居場所づくりを継続的に応援してくださる企業を募集しています。
                </p>
              </div>
              <a className="mashiro-button" href={sponsorMailto}>
                スポンサーについて相談する
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          </div>
        </section>

        <section className="mashiro-section corporate-sponsor-flow-section">
          <div className="shell">
            <SectionHeading
              eyebrow="HOW IT WORKS"
              title="スポンサー開始までの流れ"
            />
            <ol className="corporate-sponsor-flow">
              {sponsorSteps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mashiro-section corporate-sponsor-faq-section">
          <div className="shell corporate-sponsor-faq-grid">
            <SectionHeading eyebrow="QUESTIONS" title="よくある質問" />
            <div className="corporate-sponsor-faqs">
              {sponsorFaqs.map((faq, index) => (
                <details key={faq.question}>
                  <summary>
                    <span>Q{String(index + 1).padStart(2, "0")}</span>
                    {faq.question}
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mashiro-section corporate-sponsor-cta-section">
          <div className="shell corporate-sponsor-cta">
            <div>
              <p className="mashiro-kicker">PARTNERSHIP</p>
              <h2>企業スポンサーについて相談する</h2>
              <p>
                具体的な内容がまだ決まっていなくても大丈夫です。ご希望やご関心を伺いながら、無理のない形をご案内します。まずはお気軽にお問い合わせください。
              </p>
            </div>
            <a className="mashiro-button" href={sponsorMailto}>
              まずは相談してみる
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
