import Image from "next/image";
import Link from "next/link";
import type { NewsPost } from "../content/newsPosts";
import { formatNewsDate } from "../lib/newsFormatting";
import styles from "../app/news/news.module.css";

export type NewsCardPost = Pick<NewsPost, "slug" | "title" | "category" | "summary" | "publishedAt" | "coverImage" | "coverImageAlt">;

export function NewsCard({ post, headingLevel = 3 }: {
  post: NewsCardPost;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={styles.card}>
      <Link className={styles.cardLink} href={`/news/${post.slug}`}>
        <div className={styles.cover}>
          {post.coverImage ? (
            <Image src={post.coverImage} alt={post.coverImageAlt ?? ""}
              fill unoptimized sizes="(max-width: 560px) 85vw, 280px" />
          ) : (
            <div className={styles.noPhoto} aria-hidden="true">
              <span>すこやか食堂</span>
              <strong>{post.category}</strong>
            </div>
          )}
        </div>
        <div className={styles.cardContent}>
          <div className={styles.meta}>
            <span>{post.category}</span>
            <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time>
          </div>
          <Heading className={styles.cardTitle}>{post.title}</Heading>
          <p className={styles.summary}>{post.summary}</p>
          <span className={styles.readMore}>記事を読む →</span>
        </div>
      </Link>
    </article>
  );
}
