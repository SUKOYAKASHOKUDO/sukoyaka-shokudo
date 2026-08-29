import Image from "next/image";
import Link from "next/link";
import { site } from "../content/siteContent";

function FooterInformationNote() {
  return (
    <>
      開催日時・料金・支援方法は変更される場合があります。
      <br />
      最新情報は公式Instagramをご確認ください。
    </>
  );
}

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
          <p>
            <FooterInformationNote />
          </p>
        </div>

        <nav className="footer-team-nav" aria-label="フッターメニュー">
          <Link href="/team#team">私たち</Link>
          <Link href="/team#volunteer">ボランティア</Link>
        </nav>
      </div>

      <div className="shell footer-bottom">
        <small>
          © 2023年- {site.name}
        </small>
        <small>
          <FooterInformationNote />
        </small>
      </div>
    </footer>
  );
}
