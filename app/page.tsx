import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  columns,
  faqs,
  homePage,
  recipes,
  site,
  sponsors,
  supportMethods,
  youtubeVideos,
} from "../content/siteContent";

export default function Home() {
  const publishedColumns = columns.filter(
    (column) => column.status === "published",
  );
  const publishedRecipes = recipes.filter(
    (recipe) => recipe.status === "published",
  );
  const featuredSponsors = sponsors.slice(0, 6);

  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>

      <SiteHeader />

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-dots" aria-hidden="true" />
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{homePage.hero.eyebrow}</p>
              <h1>
                {homePage.hero.headingLine1}
                <br />
                {homePage.hero.headingLine2}
                <br />
                <span>{homePage.hero.headingAccent}</span>
                {homePage.hero.headingAfter}
                <br />
                {homePage.hero.headingClosing}
              </h1>
              <p className="hero-lead">{homePage.hero.lead}</p>

              <div className="hero-actions">
                <a className="button" href="#schedule">
                  {homePage.hero.primaryCta}
                </a>
                <a className="button button-outline" href="#support">
                  {homePage.hero.secondaryCta}
                </a>
              </div>

              <ul className="quick-facts" aria-label="旧公式サイトの利用案内">
                {homePage.hero.quickFacts.map((fact) => (
                  <li key={fact.value}>
                    <strong>{fact.value}</strong>
                    <span>{fact.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-visual">
              <div className="photo-frame">
                <Image
                  src="/images/sukoyaka-storefront.jpg"
                  alt="すこやか食堂の窓に掲示された利用案内"
                  fill
                  priority
                  sizes="(max-width: 1020px) 90vw, 46vw"
                />
              </div>
              <p className="hand-note">{homePage.hero.handNote}</p>
              <div className="hero-badge">
                <span>場所</span>
                <strong>札幌市中央区</strong>
                <small>南9条西8丁目</small>
              </div>
            </div>
          </div>
        </section>

        <aside className="announcement" aria-label="大切なお知らせ">
          <div className="shell announcement-inner">
            <span className="announcement-label">
              {homePage.announcement.label}
            </span>
            <p>{homePage.announcement.text}</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${homePage.announcement.linkLabel}（新しいタブで開く）`}
            >
              {homePage.announcement.linkLabel}
            </a>
          </div>
        </aside>

        <section className="section intro-section" id="about">
          <div className="shell">
            <div className="section-heading centered">
              <p className="eyebrow">{homePage.about.eyebrow}</p>
              <h2>{homePage.about.title}</h2>
              <p>{homePage.about.description}</p>
            </div>

            <div className="value-grid">
              {homePage.about.values.map((value) => (
                <article
                  className={`value-card value-card-${value.tone}`}
                  key={value.number}
                >
                  <span className="card-number">{value.number}</span>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section schedule-section" id="schedule">
          <div className="shell schedule-grid">
            <div>
              <div className="section-heading">
                <p className="eyebrow">{homePage.schedule.eyebrow}</p>
                <h2>{homePage.schedule.title}</h2>
                <p>{homePage.schedule.description}</p>
              </div>

              <div className="schedule-card">
                <div className="schedule-status">
                  <span className="pulse" aria-hidden="true" />
                  {homePage.schedule.status}
                </div>
                <dl>
                  {homePage.schedule.details.map((detail) => (
                    <div key={detail.label}>
                      <dt>{detail.label}</dt>
                      <dd>{detail.value}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  className="button"
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${homePage.schedule.cta}（新しいタブで開く）`}
                >
                  {homePage.schedule.cta}
                </a>
                <p className="small-note">{homePage.schedule.note}</p>
              </div>
            </div>

            <div className="banner-photo">
              <Image
                src="/images/sukoyaka-banner.jpg"
                alt="すこやか食堂の青緑色ののぼり"
                fill
                sizes="(max-width: 1020px) 90vw, 42vw"
              />
              <span>{homePage.schedule.photoNote}</span>
            </div>
          </div>
        </section>

        <section className="section video-section" id="activity">
          <div className="shell">
            <div className="section-heading video-heading">
              <div>
                <p className="eyebrow">{homePage.movie.eyebrow}</p>
                <h2>{homePage.movie.title}</h2>
              </div>
              <p>{homePage.movie.description}</p>
            </div>

            <div className="video-grid">
              {youtubeVideos.map((video) => (
                <article className="video-card" key={video.id}>
                  <div className="video-frame">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="video-copy">
                    <p>{video.category}</p>
                    <h3>{video.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section support-section" id="support">
          <div className="shell">
            <div className="support-lead">
              <div className="section-heading">
                <p className="eyebrow light">{homePage.support.eyebrow}</p>
                <h2>{homePage.support.title}</h2>
                <p>{homePage.support.description}</p>
              </div>
              <a
                className="button button-light"
                href="/support"
              >
                {homePage.support.cta}
              </a>
            </div>

            <div className="support-methods">
              {supportMethods.map((method) => (
                <article key={method.title}>
                  <span aria-hidden="true">{method.symbol}</span>
                  <h3>{method.title}</h3>
                  <p>{method.description}</p>
                </article>
              ))}
            </div>

            <div className="sponsor-showcase">
              <div className="sponsor-heading">
                <div>
                  <p className="eyebrow">{homePage.support.sponsorEyebrow}</p>
                  <h3>{homePage.support.sponsorTitle}</h3>
                </div>
                <p>{homePage.support.sponsorDescription}</p>
              </div>

              {sponsors.length > 0 ? (
                <div className="sponsor-grid">
                  {featuredSponsors.map((sponsor) => (
                    <article className="sponsor-card" key={sponsor.name}>
                      <div className="sponsor-logo">
                        {sponsor.logo ? (
                          <Image
                            src={sponsor.logo}
                            alt={`${sponsor.name}のロゴ`}
                            width={80}
                            height={80}
                          />
                        ) : (
                          <span>{sponsor.name.slice(0, 1)}</span>
                        )}
                      </div>
                      <div>
                        <p className="sponsor-type">{sponsor.support}</p>
                        <h4>{sponsor.name}</h4>
                        {sponsor.summary ? <p>{sponsor.summary}</p> : null}
                        {sponsor.message ? (
                          <blockquote>{sponsor.message}</blockquote>
                        ) : null}
                        {sponsor.supportPeriod ? (
                          <p className="sponsor-period">
                            支援実施時期：{sponsor.supportPeriod}
                          </p>
                        ) : null}
                        {sponsor.url ? (
                          <a
                            href={sponsor.url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            aria-label={`${sponsor.name}の公式サイトを新しいタブで開く`}
                          >
                            企業・団体サイトを見る
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="sponsor-empty">
                  <div>
                    <span>企業ロゴ</span>
                    <strong>掲載準備中</strong>
                    <small>会社概要／ご支援内容／公式URL</small>
                  </div>
                  <div>
                    <span>企業ロゴ</span>
                    <strong>掲載準備中</strong>
                    <small>応援メッセージ／支援実施時期</small>
                  </div>
                  <p>
                    掲載情報は企業・団体様の確認後に公開します。現在、掲載準備中です。
                  </p>
                </div>
              )}

              <p className="sponsor-policy">
                ※{homePage.support.sponsorPolicy}
              </p>
              <div className="section-more">
                <Link className="text-link" href="/support#supporters">
                  ご支援者一覧を見る →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section column-section" id="columns">
          <div className="shell">
            <div className="section-heading centered">
              <p className="eyebrow">{homePage.columns.eyebrow}</p>
              <h2>{homePage.columns.title}</h2>
              <p>{homePage.columns.description}</p>
            </div>

            {publishedColumns.length > 0 ? (
              <div className="column-grid">
                {publishedColumns.map((column) => (
                  <article
                    className={`column-card ${column.tone}`}
                    key={column.title}
                  >
                    <div className="column-meta">
                      <span>{column.audience}</span>
                      <span>{column.readingTime}</span>
                    </div>
                    <h3>{column.title}</h3>
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
            ) : (
              <p className="content-empty">{homePage.columns.emptyText}</p>
            )}
            <div className="section-more">
              <Link className="button button-outline" href="/columns">
                コラム一覧を見る
              </Link>
            </div>
          </div>
        </section>

        <section className="section recipe-section" id="recipes">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">{homePage.recipes.eyebrow}</p>
                <h2>{homePage.recipes.title}</h2>
              </div>
              <p>{homePage.recipes.description}</p>
            </div>

            {publishedRecipes.length > 0 ? (
              <div className="recipe-grid">
                {publishedRecipes.map((recipe) => (
                  <article className="recipe-card" key={recipe.title}>
                    <div className={`recipe-illustration ${recipe.tone}`}>
                      <span aria-hidden="true">{recipe.symbol}</span>
                      <small>{recipe.time}</small>
                    </div>
                    <div className="recipe-body">
                      <p>{recipe.label}</p>
                      <h3>{recipe.title}</h3>
                      <p>{recipe.description}</p>
                      <Link
                        className="text-link recipe-link"
                        href={`/recipes/${recipe.slug}`}
                      >
                        材料と作り方を見る →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="content-empty">{homePage.recipes.emptyText}</p>
            )}
            <div className="section-more">
              <Link className="button button-outline" href="/recipes">
                レシピ一覧を見る
              </Link>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="shell faq-grid">
            <div className="section-heading">
              <p className="eyebrow">{homePage.faq.eyebrow}</p>
              <h2>{homePage.faq.title}</h2>
              <p>{homePage.faq.description}</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section access-section" id="access">
          <div className="shell access-card">
            <div>
              <p className="eyebrow light">{homePage.access.eyebrow}</p>
              <h2>{homePage.access.title}</h2>
              <address>{site.address}</address>
              <p>{homePage.access.note}</p>
              <div className="access-actions">
                <a
                  className="button button-light"
                  href={site.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${homePage.access.mapCta}（新しいタブで開く）`}
                >
                  {homePage.access.mapCta}
                </a>
                <a
                  className="text-link light-link"
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagramを新しいタブで開く"
                >
                  Instagram →
                </a>
              </div>
            </div>
            <Image
              src="/images/sukoyaka-storefront.jpg"
              alt="すこやか食堂の店頭に掲示された利用案内"
              width={1125}
              height={2000}
              sizes="(max-width: 760px) 100vw, 44vw"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
