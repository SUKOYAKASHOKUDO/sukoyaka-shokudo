import Link from "next/link";
import { getPublishedNewsPosts } from "../content/newsPosts";
import { NewsCarousel } from "./NewsCarousel";
import styles from "../app/news/news.module.css";

// Homepage-only derivatives. Article pages and /news keep their original photos.
const thumbnails: Record<string, { src: string; width: number; height: number }> = {
  "/images/news/sapporo-kaisei-interview.jpg": { src: "/images/news/sapporo-kaisei-interview-home-800-v1.jpg", width: 800, height: 1066 },
  "/images/news/aka-to-ao-book.jpg": { src: "/images/news/aka-to-ao-book-home-800-v1.jpg", width: 800, height: 1066 },
};

export function HomeNews() {
  return (
    <section className={`mashiro-section ${styles.section}`} aria-labelledby="home-news-title">
      <div className="shell">
        <div className={styles.heading}>
          <p className="mashiro-kicker">NEWS</p>
          <h2 id="home-news-title">食堂からのお知らせ</h2>
          <p>すこやか食堂の日々の活動や、地域の皆さまからの温かいご支援などをご紹介します。</p>
        </div>
        <NewsCarousel posts={getPublishedNewsPosts().map(({ slug, title, category, summary, publishedAt, coverImage, coverImageAlt }) => ({ slug, title, category, summary, publishedAt, coverImage, coverImageAlt, homeThumbnail: coverImage ? thumbnails[coverImage] : undefined }))} />
        <Link href="/news" className={styles.allNews}>お知らせをすべて見る →</Link>
      </div>
    </section>
  );
}
