import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MashiroPageHero } from "../../components/MashiroPageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { legacyBlog } from "../../content/legacyContent";
import { columns } from "../../content/siteContent";

export const metadata: Metadata = {
  title: "活動記録・すこやかコラム",
  description:
    "すこやか食堂の活動記録と、親御さん、お子さん、地域の皆さんに向けた読みものです。",
  alternates: {
    canonical: "/columns",
  },
};

export default function ColumnsPage() {
  const publishedColumns = columns.filter(
    (column) => column.status === "published",
  );

  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site">
        <MashiroPageHero
          eyebrow="ACTIVITY JOURNAL"
          title="3.活動記録(ブログ)"
          description="日頃の活動の様子やイベントの情報を、少しずつ記録していきます。食事、子育て、地域のことを伝える読みものも掲載します。"
          current="活動記録"
        />
        <section className="mashiro-section">
          <div className="shell mashiro-editorial-grid">
            <div className="mashiro-blog-art">
              <Image
                src="/images/legacy/legacy-logo-2023.png"
                alt="日記帳と鉛筆のイラスト"
                width={1500}
                height={800}
                priority
              />
            </div>
            <div className="mashiro-prose mashiro-prose-large">
              <p className="mashiro-kicker">FROM THE OLD JOURNAL</p>
              <h2>日々の活動を、言葉でも伝えたい。</h2>
              {legacyBlog.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <a
                className="mashiro-arrow-link"
                href="mailto:sukoyakashokudo@gmail.com"
              >
                ライティングのお手伝いを相談する
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <section className="section listing-section mashiro-soft-section">
          <div className="shell">
            <div className="mashiro-section-title">
              <div>
                <p className="mashiro-kicker">SUKOYAKA COLUMN</p>
                <h2>すこやかコラム</h2>
              </div>
              <p>
                確認できた記事から順次公開します。下書きの記事は公開ページに表示しません。
              </p>
            </div>
            <div className="column-grid">
              {publishedColumns.map((column) => (
                <article
                  className={`column-card ${column.tone}`}
                  key={column.slug}
                >
                  <div className="column-meta">
                    <span>{column.audience}</span>
                    <span>{column.readingTime}</span>
                  </div>
                  <h2>{column.title}</h2>
                  <p>{column.summary}</p>
                  <Link
                    className="text-link"
                    href={`/columns/${column.slug}`}
                  >
                    記事を読む →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
