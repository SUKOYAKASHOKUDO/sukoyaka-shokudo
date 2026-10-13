import Image from "next/image";
import styles from "../app/sponsorship/shirushi-sponsor.module.css";

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

type SponsorshipCardProps = Omit<PartnerShowcaseCardProps, "url" | "preview"> & {
  footerName?: string;
  links: { label: string; url: string }[];
};

export function SponsorshipCard({
  name,
  summary,
  logo,
  supportLabel = "すこやか食堂の協賛企業",
  footerName = name,
  links,
}: SponsorshipCardProps) {
  const nameParts = name.endsWith("株式会社")
    ? [name.slice(0, -4), "株式会社"]
    : [name];

  return (
    <article className={`partner-showcase-card ${styles.card}`}>
      <div className={`partner-showcase-body ${styles.body}`}>
        <div className={`partner-logo-column ${styles.logoColumn}`}>
          <div className="partner-logo-arch">
            {logo ? (
              <Image
                src={logo}
                alt={`${name}のロゴ`}
                fill
                sizes="96px"
                style={{ objectFit: "contain", padding: "12px" }}
              />
            ) : (
              <span>ありがとう</span>
            )}
          </div>
          <span className={`partner-card-label ${styles.label}`}>
            COMMUNITY PARTNER
          </span>
        </div>
        <div className={`partner-showcase-copy ${styles.copy}`}>
          <div className={styles.heading}>
            <h2>
              {nameParts.map((part, index) => (
                <span key={part}>
                  {index > 0 && <wbr />}
                  <span className={styles.namePart}>{part}</span>
                </span>
              ))}
            </h2>
            <span className="partner-showcase-rule" aria-hidden="true" />
          </div>
          <p className={styles.summary}>
            {summary.split("\n\n").map((paragraph) => (
              <span key={paragraph}>{paragraph}</span>
            ))}
          </p>
          <small>{supportLabel}</small>
        </div>
      </div>
      <footer className={`partner-showcase-footer ${styles.footer}`}>
        <strong>{footerName}</strong>
        <div className={styles.links}>
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </article>
  );
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
              <span>ありがとう</span>
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
