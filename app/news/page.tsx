import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { NewsCard } from "../../components/NewsCard";
import { getPublishedNewsPosts } from "../../content/newsPosts";
import { paginateNews } from "../../lib/newsPagination";
import styles from "./news.module.css";

export const metadata: Metadata = {
  title: "食堂からのお知らせ",
  description: "すこやか食堂の日々の活動や、地域の皆さまからの温かいご支援などをご紹介します。",
  alternates: { canonical: "/news" },
};

export default async function NewsPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page, totalPages, items } = paginateNews(getPublishedNewsPosts(), (await searchParams).page);
  const pageUrl = (value: number) => value === 1 ? "/news" : `/news?page=${value}`;
  return (
    <>
      <a className="skip-link" href="#main">本文へ移動</a>
      <SiteHeader />
      <main id="main" className={`mashiro-site ${styles.page}`}>
        <div className="shell">
          <header className={styles.pageHeader}>
            <nav className={styles.breadcrumb} aria-label="パンくずリスト"><Link href="/">ホーム</Link><span>お知らせ</span></nav>
            <p className="mashiro-kicker">NEWS</p>
            <h1>食堂からのお知らせ</h1>
            <p>すこやか食堂の日々の活動や、地域の皆さまからの温かいご支援などをご紹介します。</p>
          </header>
          <div className={styles.listing}>{items.map((post) => <NewsCard key={post.slug} post={post} headingLevel={2} />)}</div>
          {totalPages > 1 && <nav className={styles.pagination} aria-label="お知らせ一覧のページ送り">
            {page > 1 && <Link href={pageUrl(page - 1)}>← 前のページ</Link>}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => value === page
              ? <span key={value} aria-current="page">{value}</span>
              : <Link key={value} href={pageUrl(value)} aria-label={`${value}ページ目`}>{value}</Link>)}
            {page < totalPages && <Link href={pageUrl(page + 1)}>次のページ →</Link>}
          </nav>}
          <div className={styles.backLinks}><Link href="/">← トップページへ戻る</Link></div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
