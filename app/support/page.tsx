import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "../../components/PageIntro";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import {
  homePage,
  site,
  sponsors,
  supportBankAccount,
  supportMethods,
} from "../../content/siteContent";
import { legacySupport } from "../../content/legacyContent";

export const metadata: Metadata = {
  title: "すこやか食堂を応援する｜ご支援の案内",
  description:
    "個人、企業・団体の皆さまへ、寄付金、食材・物品、ボランティア、協賛など、すこやか食堂への支援方法をご案内します。",
  alternates: {
    canonical: "/support",
  },
};

export default function SupportPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site">
        <PageIntro
          eyebrow="SUPPORT SUKOYAKA"
          title="すこやか食堂を応援する"
          description="個人、企業・団体の皆さまからの、食材・物品、ボランティア、寄付金、協賛などのご支援についてご案内します。"
        />

        <section className="section support-detail-section">
          <div className="shell">
            <div className="mashiro-support-message">
              <div className="mashiro-prose">
                <p className="mashiro-kicker">THANK YOU</p>
                <h2>ご支援について</h2>
                {legacySupport.message.slice(0, 3).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <ul className="mashiro-support-methods">
                  {legacySupport.methods.map((method) => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
                {legacySupport.message.slice(3).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <figure>
                <Image
                  src="/images/legacy/legacy-member-03.webp"
                  alt="カレーとサラダ、汁物、果物の献立"
                  fill
                  sizes="(max-width: 900px) 92vw, 42vw"
                />
              </figure>
            </div>

            <div className="support-audience-grid">
              <article>
                <p className="mashiro-kicker">FOR INDIVIDUALS</p>
                <h2>個人の方へ</h2>
                <p>
                  食材や物品の提供、ボランティア、寄付金など、できる形でのご支援をご相談いただけます。
                </p>
              </article>
              <article>
                <p className="mashiro-kicker">FOR ORGANIZATIONS</p>
                <h2>企業・団体の皆さまへ</h2>
                <p>
                  食材・物品の提供、団体でのボランティア、寄付金、協賛について、内容と日程を個別に確認します。
                </p>
              </article>
            </div>

            <div className="support-method-heading">
              <p className="mashiro-kicker">HOW TO SUPPORT</p>
              <h2>支援方法</h2>
            </div>
            <div className="support-detail-grid">
              {supportMethods.map((method) => (
                <article key={method.title}>
                  <span aria-hidden="true">{method.symbol}</span>
                  <h2>{method.title}</h2>
                  <p>{method.description}</p>
                </article>
              ))}
            </div>

            <div className="support-process">
              <div>
                <p className="eyebrow">BEFORE CONTACT</p>
                <h2>ご相談前にお知らせいただきたいこと</h2>
              </div>
              <ol>
                <li>
                  <span>01</span>
                  <div>
                    <strong>お名前・企業名・団体名</strong>
                    <p>
                      個人の方はお名前を、企業・団体の方は名称とご担当者名を、差し支えない範囲でお知らせください。
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>ご支援を検討している内容</strong>
                    <p>
                      食材・物品の場合は、品名、数量、賞味期限、保管条件などをお知らせください。
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>希望時期・参加人数</strong>
                    <p>
                      ボランティアの場合は、候補日と参加予定人数もあわせてご相談ください。
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="contact-callout">
              <div>
                <p className="eyebrow light">CONTACT</p>
                <h2>ご支援・ボランティアのご相談</h2>
                <p>
                  公式Instagram、メール、電話でご相談いただけます。受入条件や日程を確認するため、物資をお持ち込みになる前にご連絡ください。
                </p>
                <div className="contact-details">
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                  <a href={site.phoneHref}>{site.phone}</a>
                </div>
              </div>
              <a
                className="button button-light"
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="公式Instagramを新しいタブで開く"
              >
                Instagramで相談する
              </a>
            </div>

            <section className="bank-account" aria-labelledby="bank-heading">
              <div>
                <p className="eyebrow">DONATION</p>
                <h2 id="bank-heading">活動資金のご支援先</h2>
                <p>
                  お振込前に、公式Instagram・メール・電話のいずれかで、最新の活動状況と口座情報をご確認ください。
                </p>
              </div>
              <dl>
                <div>
                  <dt>銀行名</dt>
                  <dd>{supportBankAccount.bankName}</dd>
                </div>
                <div>
                  <dt>支店名</dt>
                  <dd>
                    {supportBankAccount.branchName}（店番号
                    {supportBankAccount.branchNumber}）
                  </dd>
                </div>
                <div>
                  <dt>口座種別</dt>
                  <dd>{supportBankAccount.accountType}</dd>
                </div>
                <div>
                  <dt>口座番号</dt>
                  <dd>{supportBankAccount.accountNumber}</dd>
                </div>
                <div>
                  <dt>名義</dt>
                  <dd>{supportBankAccount.accountName}</dd>
                </div>
              </dl>
            </section>
          </div>
        </section>

        <section className="section sponsor-page-section" id="supporters">
          <div className="shell">
            <div className="section-heading centered">
              <p className="eyebrow">{homePage.support.sponsorEyebrow}</p>
              <h2>協賛企業様一覧</h2>
              <p>{homePage.support.sponsorDescription}</p>
            </div>
            {sponsors.length === 0 ? (
              <div className="content-empty">
                掲載許可を確認できた企業・団体様から順次ご紹介します。現在は掲載準備中です。
              </div>
            ) : (
              <div className="supporter-list">
                {sponsors.map((sponsor) => (
                  <article key={sponsor.name}>
                    <span aria-hidden="true">{sponsor.name.slice(0, 1)}</span>
                    <div>
                      <h3>{sponsor.name}</h3>
                      <p>ご支援：{sponsor.support}</p>
                      {sponsor.url ? (
                        <a
                          href={sponsor.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                        >
                          公式サイト
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="sponsor-policy centered-policy">
              ※{homePage.support.sponsorPolicy}
            </p>
            <div className="mashiro-supporter-note">
              {legacySupport.supporterNote.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="section-more">
              <Link className="text-link" href="/">
                ← ホームへ戻る
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
