import Image from "next/image";

type PartnerShowcaseCardProps = {
  name: string;
  summary: string;
  url?: string;
  logo?: string;
  supportLabel?: string;
  preview?: boolean;
};

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function PartnerShowcaseCard({
  name,
  summary,
  url,
  logo,
  supportLabel = "すこやか食堂の協賛企業",
  preview = false,
}: PartnerShowcaseCardProps) {
  return (
    <article className={`partner-showcase-card${preview ? " is-preview" : ""}`}>
      <div className="partner-showcase-body">
        <div className="partner-logo-column">
          <div className="partner-logo-arch">
            {logo ? (
              <Image
                src={logo}
                alt={`${name}のロゴ`}
                fill
                sizes="(max-width: 720px) 58vw, 260px"
              />
            ) : (
              <span>YOUR LOGO</span>
            )}
          </div>
          <span className="partner-card-label">COMMUNITY PARTNER</span>
        </div>

        <div className="partner-showcase-copy">
          {preview && <span className="partner-preview-badge">掲載イメージ</span>}
          <h2>{name}</h2>
          <span className="partner-showcase-rule" aria-hidden="true" />
          <p>{summary}</p>
          <small>{supportLabel}</small>
        </div>
      </div>

      <footer className="partner-showcase-footer">
        <strong>{name}</strong>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {displayUrl(url)}
          </a>
        ) : (
          <span>OFFICIAL WEBSITE</span>
        )}
      </footer>
    </article>
  );
}
