import Link from "next/link";
import { site } from "../content/siteContent";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">
            す
          </span>
          <span>
            <strong>{site.name}</strong>
            <small>運営：{site.operator}</small>
          </span>
        </div>

        <div>
          <p>{site.shortAddress}</p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span aria-hidden="true"> ／ </span>
            <a href={site.phoneHref}>{site.phone}</a>
          </p>
          <p>{site.informationNote}</p>
          <p className="source-date">{site.sourceCheckedAt}</p>
        </div>

        <nav className="footer-links" aria-label="フッターメニュー">
          <Link href="/support">ご支援</Link>
          <Link href="/columns">コラム</Link>
          <Link href="/recipes">レシピ</Link>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
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
