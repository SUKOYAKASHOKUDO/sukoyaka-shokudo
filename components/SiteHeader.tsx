import Link from "next/link";
import { navigation, site } from "../content/siteContent";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`${site.name} トップへ`}>
          <span className="brand-mark" aria-hidden="true">
            す
          </span>
          <span>
            <strong>{site.name}</strong>
            <small>{site.subtitle}</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="メインメニュー">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="mobile-menu">
          <summary>メニュー</summary>
          <nav className="mobile-menu-nav" aria-label="スマートフォンメニュー">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </details>

        <Link className="button button-small header-cta" href="/support">
          応援する
        </Link>
      </div>
    </header>
  );
}
