import Image from "next/image";
import Link from "next/link";
import { site } from "../content/siteContent";

type IconName =
  | "home"
  | "bowl"
  | "calendar"
  | "people"
  | "heart"
  | "notebook"
  | "book"
  | "building"
  | "pot"
  | "pin"
  | "mail";

const headerNavigation: ReadonlyArray<{
  href: string;
  label: string;
  icon: IconName;
}> = [
  { href: "/", label: "ホーム", icon: "home" },
  { href: "/about", label: "すこやか食堂\nについて", icon: "bowl" },
  { href: "/schedule", label: "開催の\nおしらせ", icon: "calendar" },
  { href: "/recipes", label: "レシピと\nコラム", icon: "book" },
  {
    href: "/support",
    label: "応援したい\n企業・団体の方へ",
    icon: "building",
  },
];

function StorybookIcon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.2,
  };

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      {name === "home" && (
        <>
          <path {...common} d="m4 15 12-10 12 10" />
          <path {...common} d="M7 13v14h18V13M13 27v-8h6v8" />
        </>
      )}
      {name === "bowl" && (
        <>
          <ellipse {...common} cx="16" cy="10" rx="11" ry="5" />
          <path {...common} d="M5 10c1 9 5 14 11 14s10-5 11-14" />
          <path {...common} d="M12 27h8" />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect {...common} x="5" y="7" width="22" height="20" rx="3" />
          <path {...common} d="M10 4v6M22 4v6M5 13h22" />
          <path
            {...common}
            d="M10 18h2M16 18h2M22 18h1M10 23h2M16 23h2M22 23h1"
          />
        </>
      )}
      {name === "people" && (
        <>
          <circle {...common} cx="11" cy="11" r="4" />
          <circle {...common} cx="22" cy="12" r="3.5" />
          <path
            {...common}
            d="M4 26c1-6 4-9 8-9s7 3 8 9M18 19c5-1 8 2 9 7"
          />
        </>
      )}
      {name === "heart" && (
        <path
          {...common}
          d="M16 27S5 20 5 12a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 8-11 15-11 15Z"
        />
      )}
      {name === "notebook" && (
        <>
          <path
            {...common}
            d="M6 6h16a4 4 0 0 1 4 4v17H10a4 4 0 0 1-4-4Z"
          />
          <path {...common} d="M10 6v21M14 12h8M14 17h8M14 22h6" />
        </>
      )}
      {name === "book" && (
        <>
          <path
            {...common}
            d="M4 7c5-2 9-1 12 2v18c-3-3-7-4-12-2ZM28 7c-5-2-9-1-12 2v18c3-3 7-4 12-2Z"
          />
          <path {...common} d="M16 9v18" />
        </>
      )}
      {name === "building" && (
        <>
          <path {...common} d="M5 27V13h9v14M14 27V5h13v22M2 27h28" />
          <path
            {...common}
            d="M8 17h3M8 22h3M18 10h4M18 15h4M18 20h4"
          />
        </>
      )}
      {name === "pot" && (
        <>
          <path {...common} d="M7 12h18l-2 13H9Z" />
          <path
            {...common}
            d="M5 14H2M27 14h3M11 8c-2-2 1-3 0-5M17 8c-2-2 1-3 0-5M23 8c-2-2 1-3 0-5"
          />
        </>
      )}
      {name === "pin" && (
        <>
          <path
            {...common}
            d="M16 28S7 19 7 12a9 9 0 1 1 18 0c0 7-9 16-9 16Z"
          />
          <circle {...common} cx="16" cy="12" r="3" />
        </>
      )}
      {name === "mail" && (
        <>
          <rect {...common} x="4" y="7" width="24" height="18" rx="3" />
          <path {...common} d="m5 9 11 9L27 9" />
        </>
      )}
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header storybook-site-header">
      <div className="storybook-header-panel">
        <Link
          className="storybook-full-logo"
          href="/"
          aria-label={`${site.name} トップへ`}
        >
          <Image
            src="/images/brand/sukoyaka-onigiri-logo-transparent-clean.png"
            alt="子ども食堂 すこやか食堂"
            width={1097}
            height={731}
            priority
            sizes="(max-width: 760px) 82px, 118px"
          />
        </Link>

        <nav className="storybook-main-nav" aria-label="メインメニュー">
          {headerNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <StorybookIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <a className="storybook-contact" href={`mailto:${site.email}`}>
          <StorybookIcon name="mail" />
          <span>お問い合わせ</span>
        </a>
      </div>
    </header>
  );
}
