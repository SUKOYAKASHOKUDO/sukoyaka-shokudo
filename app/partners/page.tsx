import type { Metadata } from "next";
import { CorporateSponsorCarousel } from "../../components/CorporateSponsorCarousel";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import {
  getPublishedCorporateSponsors,
  site,
} from "../../content/siteContent";

export const metadata: Metadata = {
  title: { absolute: "企業スポンサーのご紹介・募集｜すこやか食堂" },
  description:
    "すこやか食堂では、子どもたちが安心して食事を楽しめる地域の居場所づくりを応援してくださる企業スポンサーを募集しています。会社ロゴや会社情報の掲載、年1回の活動報告をご用意しています。",
  alternates: { canonical: "/partners" },
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

const reportItems = [
  "年間開催回数",
  "活動写真",
  "協賛金の活用について",
  "すこやか食堂からの感謝メッセージ",
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
      "ご希望の期間や掲載内容などを確認しながら、個別にご案内します。ご相談いただいた時点で、お申込みが決まることはありません。",
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
  title: string;
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
                企業のみなさまと、
                <br />
                子どもたちのあたたかな食卓を支える。
              </h1>
              <p className="corporate-sponsor-lead">
                すこやか食堂では、子どもたちが安心して食事を楽しめる地域の居場所づくりを、継続的に応援してくださる企業スポンサーを募集しています。
              </p>
              <div className="corporate-sponsor-actions">
                <a className="mashiro-button" href={sponsorMailto}>
                  スポンサーについて相談する
                  <span aria-hidden="true">↗</span>
                </a>
                <a className="corporate-sponsor-text-link" href="#sponsorship">
                  スポンサー制度を見る
                  <span aria-hidden="true">↓</span>
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
                <li>金額・契約期間・掲載条件は個別案内</li>
              </ul>
            </aside>
          </div>
        </section>

        <section
          className="mashiro-section corporate-sponsor-about"
          id="sponsorship"
        >
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
            )}
          </div>
        </section>

        <section className="mashiro-section corporate-sponsor-report-section">
          <div className="shell corporate-sponsor-report-grid">
            <div>
              <SectionHeading
                eyebrow="ANNUAL REPORT"
                title="年1回、活動の様子をご報告します"
                description="スポンサー企業の皆さまには、年度終了後に、年間開催回数や活動の様子をまとめたA4・1枚の年間スポンサー活動報告書をお送りします。"
              />
              <p className="corporate-sponsor-report-note">
                いただいた協賛金は、食材費、調味料、衛生用品、会場設備、広報費など、すこやか食堂の活動運営全般に活用しました。
                <br />
                <br />
                年間スポンサー活動報告書は、企業サイトのサステナビリティ・CSRページや社内報などで、地域貢献の取り組みを紹介する際の参考資料としてご利用いただけます。
              </p>
              <small>
                活動写真を社外向けに転載する場合は、事前にすこやか食堂へご確認ください。
              </small>
            </div>
            <ul className="corporate-sponsor-report-list">
              {reportItems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ul>
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
