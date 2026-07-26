import Link from "next/link";

type MashiroPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
};

export function MashiroPageHero({
  eyebrow,
  title,
  description,
  current,
}: MashiroPageHeroProps) {
  return (
    <header className="mashiro-page-hero">
      <div className="shell">
        <nav className="mashiro-breadcrumb" aria-label="パンくずリスト">
          <Link href="/">ホーム</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{current}</span>
        </nav>
        <p className="mashiro-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}
