import Link from "next/link";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
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
            <h1>{title}</h1>
          </div>
          <span aria-hidden="true" />
        </div>
        <p className="sr-only">{description}</p>
      </div>
    </section>
  );
}
