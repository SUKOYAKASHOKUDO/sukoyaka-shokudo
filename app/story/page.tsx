import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "../../components/PageIntro";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { legacyAbout } from "../../content/legacyContent";
import { site, storyPage, youtubeVideos } from "../../content/siteContent";

export const metadata: Metadata = {
  title: "すこやか食堂を知る",
  description: storyPage.description,
  alternates: {
    canonical: "/story",
  },
};

export default function StoryPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main" className="mashiro-site story-page">
        <PageIntro
          eyebrow="OUR STORY"
          title={storyPage.title}
          description={storyPage.description}
        />

        <section className="mashiro-section story-interview-section">
          <div className="shell story-reading-grid">
            <div>
              <p className="mashiro-kicker">{storyPage.interview.eyebrow}</p>
              <h2>{storyPage.interview.title}</h2>
            </div>
            <div className="story-interview-pending" role="note">
              <strong>{storyPage.interview.status}</strong>
              <p>{storyPage.interview.notice}</p>
            </div>
          </div>
        </section>

        <section className="mashiro-section story-origin-section">
          <div className="shell story-reading-grid">
            <div>
              <p className="mashiro-kicker">OUR BEGINNING</p>
              <h2>すこやか食堂を始めたきっかけ</h2>
            </div>
            <div className="mashiro-prose">
              {legacyAbout.message.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="mashiro-section story-values-section">
          <div className="shell story-reading-grid">
            <div>
              <p className="mashiro-kicker">WHAT MATTERS</p>
              <h2>活動で大切にしていること</h2>
            </div>
            <div className="mashiro-prose">
              {legacyAbout.opening.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="mashiro-section story-community-section">
          <div className="shell story-reading-grid">
            <div>
              <p className="mashiro-kicker">FOR OUR COMMUNITY</p>
              <h2>地域や子どもたちへの想い</h2>
            </div>
            <div className="mashiro-prose">
              {legacyAbout.background.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="mashiro-section mashiro-video-section story-movie-section">
          <div className="shell">
            <div className="story-movie-heading">
              <p className="mashiro-kicker">{storyPage.movie.eyebrow}</p>
              <h2>{storyPage.movie.title}</h2>
              <p>{storyPage.movie.description}</p>
            </div>
            <div className="story-video-grid">
              {youtubeVideos.map((video) => (
                <div className="mashiro-video-frame" key={video.id}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
            <div className="story-movie-link">
              <a
                className="mashiro-button"
                href={site.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTubeで動画を見る
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <div className="section-more story-home-link">
          <Link className="text-link" href="/">
            ← ホームへ戻る
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
