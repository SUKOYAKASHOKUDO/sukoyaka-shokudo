import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "../../components/PageIntro";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { columns } from "../../content/siteContent";

export const metadata: Metadata = {
  title: "すこやかコラム",
  description:
    "親御さん、お子さん、地域の皆さんに向けた、すこやか食堂の読みものです。",
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
      <main id="main">
        <PageIntro
          eyebrow="SUKOYAKA COLUMN"
          title="すこやかコラム"
          description="食事、子育て、地域のこと。日々の暮らしに小さく役立つ読みものを、確認を重ねながら公開します。"
        />
        <section className="section listing-section">
          <div className="shell">
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
            <p className="editorial-note">
              下書きの記事は公開ページに表示しません。内容を確認できた記事から順次公開します。
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
