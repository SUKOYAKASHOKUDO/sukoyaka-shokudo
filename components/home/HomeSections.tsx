import Image from "next/image";
import { legacyAbout, legacyFaqs } from "../../content/legacyContent";
import { site, storyPage, youtubeVideos } from "../../content/siteContent";
import styles from "./home.module.css";

export function HomeNotice() {
  return <aside className={styles.notice} aria-label="大切なお知らせ"><div className={styles.noticeInner}>
    <span>NOTICE</span><p>開催日時・料金・支援方法は変更される場合があります。<br className={styles.mobileBreak} />最新情報は公式Instagramをご確認ください。</p>
    <a href={site.instagram} target="_blank" rel="noopener noreferrer">最新情報を確認</a>
  </div></aside>;
}

export function HomeMovie() {
  return <section className={`${styles.section} ${styles.movie}`} aria-labelledby="home-movie-title">
    <div className={styles.container}>
      <header className={styles.movieHeading}><p className={styles.kicker}>{storyPage.movie.eyebrow}</p><h2 id="home-movie-title">{storyPage.movie.title}</h2><p className={styles.movieDescription}>{storyPage.movie.descriptionLine2}</p></header>
      <div className={styles.movieFeature}><p className={styles.movieMessage}><strong>子ども食堂ですが、子どもに限らず<br className={styles.mobileBreak} />どなたでもご利用いただけます。</strong></p></div>
      <div className={styles.videoGroup}>{youtubeVideos.map(video => <div className={styles.videoFrame} key={video.id}><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}`} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>)}</div>
      <div className={styles.movieLink}><a className={styles.button} href={site.youtube} target="_blank" rel="noopener noreferrer">YouTubeで動画を見る<span aria-hidden="true">↗</span></a></div>
    </div>
  </section>;
}

const photos = [
  { src: "/images/home/our-message-iida-panel.png", alt: "『おいしいね』からつながっていく、すこやか食堂で食事を楽しむ子どもたち", width: 1517, height: 1079 },
  { src: "/images/home/sukoyaka-community-prep.jpg", alt: "すこやか食堂の食事を準備する様子", width: 600, height: 450 },
  { src: "/images/home/bento-500-support-promo.jpg", alt: "大人のお弁当購入が子ども食堂への寄付につながる500円弁当のご案内", width: 1774, height: 887 },
  { src: "/images/home/bento-meal-photo.jpg", alt: "すこやか食堂のお弁当", width: 600, height: 450 },
];

export function HomeMessage() {
  return <section id="about" className={`${styles.section} ${styles.message}`} aria-labelledby="home-message-title"><div className={`${styles.container} ${styles.messageLayout}`}>
    <div className={styles.messageIndex}><span>OUR MESSAGE</span></div>
    <article className={styles.statement}>
      <p className={styles.opening}>{legacyAbout.opening[0]}</p><h2 id="home-message-title">食事は、おいしく楽しいものです。</h2>
      {legacyAbout.opening.slice(1).map((paragraph, index) => {
        const separator = index === 0 ? "日。" : "いく。";
        const [first, second] = paragraph.split(separator);
        return <p key={paragraph}>{first}{separator}<br />{second}</p>;
      })}
      <div className={styles.photos}>{photos.map((photo, index) => <Image key={photo.src} {...photo} className={index > 1 ? styles.bentoPhoto : styles.photo} sizes="(max-width: 760px) calc(100vw - 76px), 50vw" />)}</div>
    </article>
  </div></section>;
}

export function HomeQuestions() {
  return <section className={`${styles.section} ${styles.questions}`} aria-labelledby="home-questions-title"><div className={`${styles.container} ${styles.questionLayout}`}>
    <header><p className={styles.kicker}>QUESTIONS</p><h2 id="home-questions-title">よくある質問</h2></header>
    <div className={styles.questionList}>{legacyFaqs.map((faq, index) => <details key={faq.question}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
  </div></section>;
}

function ContactIcon({ instagram = false }: { instagram?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24">{instagram ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" /></> : <><path d="M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></>}</svg>;
}

export function HomeAccess() {
  return <section id="access" className={styles.access} aria-labelledby="home-access-title"><div className={`${styles.container} ${styles.accessInner}`}>
    <div className={styles.accessLayout}>
      <div><p className={styles.kicker}>ACCESS</p><h2 id="home-access-title">すこやか食堂</h2><address>{site.address}</address><p>札幌市電「山鼻9条駅」徒歩4分</p></div>
      <div className={styles.contact}><p>開催日は気軽にご利用ください。</p><a href={`mailto:${site.email}`}>{site.email}{site.emailReception}</a><a href={site.phoneHref}>{site.phone}{site.phoneReception}</a>
        <div className={styles.contactLinks}><a href={site.map} target="_blank" rel="noopener noreferrer"><ContactIcon /><span>Google Map</span></a><a className={styles.instagram} href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="すこやか食堂のInstagramを開く"><ContactIcon instagram /><span>Instagram</span></a></div>
      </div>
    </div>
    <div className={styles.mapFrame}><iframe src="https://www.google.com/maps?q=%E3%81%99%E3%81%93%E3%82%84%E3%81%8B%E9%A3%9F%E5%A0%82%20%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8D%979%E6%9D%A1%E8%A5%BF8%E4%B8%81%E7%9B%AE1-26&output=embed" title="すこやか食堂の周辺地図" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
  </div></section>;
}
