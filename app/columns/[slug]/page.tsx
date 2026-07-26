import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { columns } from "../../../content/siteContent";

type ColumnPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return columns
    .filter((column) => column.status === "published")
    .map((column) => ({ slug: column.slug }));
}

export async function generateMetadata({
  params,
}: ColumnPageProps): Promise<Metadata> {
  const { slug } = await params;
  const column = columns.find(
    (item) => item.slug === slug && item.status === "published",
  );

  if (!column) {
    return {};
  }

  return {
    title: column.title,
    description: column.summary,
    alternates: {
      canonical: `/columns/${column.slug}`,
    },
  };
}

export default async function ColumnPage({ params }: ColumnPageProps) {
  const { slug } = await params;
  const column = columns.find(
    (item) => item.slug === slug && item.status === "published",
  );

  if (!column) {
    notFound();
  }

  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main">
        <article className="article-page">
          <header className={`article-header article-header-${column.tone}`}>
            <div className="shell article-header-inner">
              <nav aria-label="パンくずリスト" className="breadcrumb">
                <Link href="/">ホーム</Link>
                <span aria-hidden="true">／</span>
                <Link href="/columns">コラム</Link>
              </nav>
              <div className="column-meta article-meta">
                <span>{column.audience}</span>
                <span>{column.readingTime}</span>
              </div>
              <h1>{column.title}</h1>
              <p>{column.summary}</p>
            </div>
          </header>

          <div className="shell article-body">
            {column.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
            <div className="article-callout">
              <strong>開催情報について</strong>
              <p>
                開催日時や利用方法は変更される場合があります。ご来場前に公式Instagramの最新案内をご確認ください。
              </p>
            </div>
            <Link className="text-link article-back" href="/columns">
              ← コラム一覧へ戻る
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
