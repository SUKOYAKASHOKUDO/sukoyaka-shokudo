import Link from "next/link";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  mobileTitleLines?: readonly string[];
  description: string;
};

export function PageIntro({
  eyebrow,
  title,
  mobileTitleLines,
  description,
}: PageIntroProps) {
  return (
    <section className="page-intro">
      <div className="shell page-intro-inner">
        <nav aria-label="パンくずリスト" className="breadcrumb">
          <Link href="/">ホーム</Link>
          <span aria-hidden="true">／</span>
          <span>{title}</span>
        </nav>
        <div className="page-intro-title">
          <span aria-hidden="true" />
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1
              className={mobileTitleLines ? "page-intro-mobile-title" : undefined}
            >
              {mobileTitleLines
                ? mobileTitleLines.map((line) => <span key={line}>{line}</span>)
                : title}
            </h1>
          </div>
          <span aria-hidden="true" />
        </div>
        <p className="sr-only">{description}</p>
      </div>
    </section>
  );
}
