import { HomeNews } from "../HomeNews";
import { SiteFooter } from "../SiteFooter";
import { HomeHeader } from "./HomeHeader";
import { HomeHero } from "./HomeHero";
import { HomeDiagnostics } from "./HomeDiagnostics";
import { HomeAccess, HomeMessage, HomeMovie, HomeNotice, HomeQuestions } from "./HomeSections";
import styles from "./home.module.css";

/** Homepage document: fresh layout; shared content/assets keep their identity. */
export function HomePage() {
  return <div className={styles.document} data-home-root>
    <link rel="preload" as="image" href="/images/brand/sukoyaka-site-design-wordmark.webp" type="image/webp" fetchPriority="high" />
    <a className="skip-link" href="#main">本文へ移動</a>
    <HomeHeader />
    <main id="main" className={styles.main}>
      <HomeHero /><HomeNotice /><HomeMovie /><HomeMessage /><HomeNews /><HomeQuestions /><HomeAccess />
    </main>
    <SiteFooter />
    {process.env.VERCEL_ENV !== "production" && <HomeDiagnostics />}
  </div>;
}
