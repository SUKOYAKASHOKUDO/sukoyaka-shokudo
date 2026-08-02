import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { StorybookHero } from "../components/StorybookHero";
import {
  legacyAbout,
  legacyFaqs,
  legacySchedule,
} from "../content/legacyContent";
import {
  site,
  sponsors,
  storyPage,
  youtubeVideos,
} from "../content/siteContent";

const gateways = [
  {
    number: "01",
    href: "/about",
    label: "すこやか食堂について",
    sub: "思いと、目指している場所",
  },
  {
    number: "02",
    href: "/schedule",
    label: "日程とメニュー",
    sub: "開催日時と献立のご案内",
  },
  {
    number: "03",
    href: "/team",
    label: "私たち・ボランティア",
    sub: "運営メンバーと参加方法",
  },
  {
    number: "04",
    href: "/support",
    label: "ご支援",
    sub: "食材・物品・寄付について",
  },
  {
    number: "05",
    href: "/columns",
    label: "活動記録",
    sub: "食堂の日々を伝える記録",
  },
  {
    number: "06",
    href: "/recipes",
    label: "レシピ・食育",
    sub: "親子で楽しめる料理",
  },
] as const;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>

      <main id="main" className="mashiro-site">
        <StorybookHero />

        <aside className="mashiro-notice" aria-label="大切なお知らせ">
          <div className="shell">
            <span>NOTICE</span>
            <p>{site.informationNote}</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              最新情報を確認
            </a>
          </div>
        </aside>

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

        <section className="mashiro-section mashiro-intro" id="about">
          <div className="shell mashiro-intro-grid">
            <div className="mashiro-section-index">
              <span>OUR MESSAGE</span>
              <strong>01</strong>
            </div>
            <div className="mashiro-statement">
              <p>{legacyAbout.opening[0]}</p>
              <h2>
                食事は、
                <br />
                おいしく楽しいものです。
              </h2>
              {legacyAbout.opening.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link className="mashiro-arrow-link" href="/about">
                すこやか食堂の思いを読む
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mashiro-section mashiro-gateway-section">
          <div className="shell">
            <div className="mashiro-section-title">
              <div>
                <p className="mashiro-kicker">CHOOSE YOUR PAGE</p>
                <h2>知りたいことを、ひとつの画面から。</h2>
              </div>
              <p>
                メニューを閉じ込めず、すべての入口をいつでも見える場所に置きました。
              </p>
            </div>

            <div className="mashiro-gateway-grid">
              {gateways.map((item) => (
                <Link href={item.href} key={item.href}>
                  <span>{item.number}</span>
                  <strong>{item.label}</strong>
                  <small>{item.sub}</small>
                  <i aria-hidden="true">↗</i>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mashiro-section mashiro-schedule-preview" id="schedule">
          <div className="shell mashiro-schedule-grid mashiro-schedule-text-only">
            <div>
              <p className="mashiro-kicker">SCHEDULE &amp; MENU</p>
              <h2>開催予定</h2>
              <div className="mashiro-schedule-lines">
                {legacySchedule.recurring.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <p className="mashiro-muted">{legacySchedule.notices[0]}</p>
              <p className="mashiro-muted">{legacySchedule.notices[1]}</p>
              <Link className="mashiro-button" href="/schedule">
                日程とメニューの詳細
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mashiro-section mashiro-support-preview">
          <div className="shell">
            <div className="mashiro-support-head">
              <div>
                <p className="mashiro-kicker">WITH THANKS</p>
                <h2>地域の食卓を、一緒に。</h2>
              </div>
              <p>
                すこやか食堂は、食材提供、ボランティア、寄付金で支えられています。
              </p>
              <Link className="mashiro-button mashiro-button-light" href="/support">
                ご支援について
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            {sponsors.length > 0 ? (
              <div className="mashiro-sponsor-strip" aria-label="協賛企業・支援者">
                {sponsors.map((sponsor) => (
                  <span key={sponsor.name}>{sponsor.name}</span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mashiro-section mashiro-faq-section">
          <div className="shell mashiro-faq-grid">
            <div>
              <p className="mashiro-kicker">QUESTIONS</p>
              <h2>よくある質問</h2>
            </div>
            <div className="mashiro-faq-list">
              {legacyFaqs.map((faq, index) => (
                <details key={faq.question}>
                  <summary>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {faq.question}
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mashiro-access" id="access">
          <div className="shell mashiro-access-grid">
            <div>
              <p className="mashiro-kicker">ACCESS</p>
              <h2>すこやか食堂</h2>
              <address>{site.address}</address>
              <p>札幌市電「山鼻9条駅」徒歩4分</p>
            </div>
            <div className="mashiro-contact-card">
              <p>開催日は気軽にご利用ください。</p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.phoneHref}>{site.phone}</a>
              <div>
                <a href={site.map} target="_blank" rel="noopener noreferrer">
                  Google Map
                </a>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
