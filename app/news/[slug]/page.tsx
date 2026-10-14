import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { getPublishedNewsPosts } from "../../../content/newsPosts";
import { formatNewsDate } from "../../../lib/newsFormatting";
import styles from "../news.module.css";

type NewsPageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return getPublishedNewsPosts().map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedNewsPosts().find((item) => item.slug === slug);
  if (!post) return { robots: { index: false, follow: false } };
  const image = post.coverImage ?? "/images/brand/sukoyaka-ogp.jpg";
  return {
    title: post.title, description: post.summary,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: { title: post.title, description: post.summary, type: "article",
      url: `/news/${post.slug}`, publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: [{ url: image, alt: post.coverImageAlt ?? "すこやか食堂" }] },
    twitter: { card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title, description: post.summary, images: [image] },
  };
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const { slug } = await params;
  const post = getPublishedNewsPosts().find((item) => item.slug === slug);
  if (!post) notFound();
  const paragraphs = post.body.split("\n\n").filter((paragraph) => !paragraph.startsWith("# "));
  return (
    <>
      <a className="skip-link" href="#main">本文へ移動</a>
      <SiteHeader />
      <main id="main" className={`mashiro-site ${styles.page}`}>
        <article className={styles.article}>
          <header className={styles.pageHeader}>
            <nav className={styles.breadcrumb} aria-label="パンくずリスト"><Link href="/">ホーム</Link><Link href="/news">お知らせ</Link></nav>
            <div className={styles.meta}><span>{post.category}</span><time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time></div>
            <h1>{post.title}</h1>
          </header>
          <div className={styles.body}>
            {paragraphs.map((paragraph, index) => (
              <Fragment key={index}>
                <p>{/^https:\/\//.test(paragraph) ? (
                  <a href={paragraph} target="_blank" rel="noopener noreferrer">{paragraph}</a>
                ) : paragraph.startsWith("**") ? paragraph.split("\n").map((line, lineIndex) => (
                  <Fragment key={lineIndex}>{lineIndex > 0 && <br />}<strong>{line.replace(/\*\*/g, "").trimEnd()}</strong></Fragment>
                )) : post.slug === "aka-to-ao" ? paragraph.split(/(（Xhttps:\/\/x\.com\/yama7713）|からのご紹介で、\n)/).map((part, partIndex) => (
                  part === "（Xhttps://x.com/yama7713）"
                    ? <Fragment key={partIndex}><br className={styles.mobileProfileBreak} />（<a className={styles.xProfileLink} href="https://x.com/yama7713" target="_blank" rel="noopener noreferrer">
                        <Image className={styles.xProfileLogo} src="/images/news/x-logo.png" alt="X" width={24} height={25} unoptimized />
                        <span>https://x.com/yama7713</span>
                      </a>）</Fragment>
                    : part === "からのご紹介で、\n"
                      ? <Fragment key={partIndex}>からのご紹介で、<br className={styles.desktopReferralBreak} /></Fragment>
                    : part
                )) : paragraph}</p>
                {post.additionalImages.filter((photo) => photo.afterParagraph === index).map((photo) => (
                  <figure key={photo.src} className={styles.figure}>
                    <div className={styles.photoFrame}>
                      <Image src={photo.src} alt={photo.alt} fill unoptimized
                        sizes="(max-width: 560px) calc(100vw - 28px), 520px" />
                    </div>
                  </figure>
                ))}
              </Fragment>
            ))}
          </div>
          <nav className={styles.backLinks} aria-label="お知らせページへのリンク">
            <Link href="/news">← お知らせ一覧へ戻る</Link><Link href="/">トップページへ戻る →</Link>
          </nav>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
