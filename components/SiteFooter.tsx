import Image from "next/image";
import Link from "next/link";
import { navigation, site } from "../content/siteContent";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="brand footer-brand storybook-footer-brand">
          <a
            className="storybook-footer-logo storybook-footer-logo-link"
            href="/"
            aria-label="すこやか食堂 ホームへ戻る"
          >
            <Image
              src="/images/brand/sukoyaka-footer-logo.jpg"
              alt="子ども食堂 すこやか食堂"
              fill
              sizes="(max-width: 640px) 118px, 138px"
            />
          </a>
          <span>
            <strong>{site.name}</strong>
            <small>運営：{site.operator}</small>
          </span>
        </div>

        <div>
          <p>{site.shortAddress}</p>
          <p>札幌市電「山鼻9条駅」徒歩4分</p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span aria-hidden="true"> ／ </span>
            <a href={site.phoneHref}>{site.phone}</a>
          </p>
          <p>{site.informationNote}</p>
        </div>

        <nav className="footer-links" aria-label="フッターメニュー">
          {navigation.slice(0, 6).map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a href={site.line} target="_blank" rel="noopener noreferrer">
            LINE
          </a>
        </nav>
      </div>

      <div className="shell footer-bottom">
        <small>
          © {new Date().getFullYear()} {site.name}
        </small>
        <small>{site.informationNote}</small>
      </div>
    </footer>
  );
}
