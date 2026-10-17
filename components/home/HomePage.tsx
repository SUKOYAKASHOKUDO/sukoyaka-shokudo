import { Suspense } from "react";
import { HomeNews } from "../HomeNews";
import { SiteFooter } from "../SiteFooter";
import { HomeHeader } from "./HomeHeader";
import { HomeHero } from "./HomeHero";
import { HomeDiagnostics } from "./HomeDiagnostics";
import { YahooEntryDiagnostics } from "./YahooEntryDiagnostics";
import { HomeAccess, HomeMessage, HomeMovie, HomeNotice, HomeQuestions } from "./HomeSections";
import styles from "./home.module.css";

/** Homepage document: fresh layout; shared content/assets keep their identity. */
export function HomePage() {
  return <div className={styles.document} data-home-root>
    <link rel="preload" as="image" href="/images/home-rebuild/hero-scene.png" type="image/png" fetchPriority="high" />
    <a className="skip-link" href="#main">本文へ移動</a>
    <HomeHeader />
    <main id="main" className={styles.main}>
      <HomeHero /><HomeNotice /><HomeMovie /><HomeMessage /><HomeNews /><HomeQuestions /><HomeAccess />
    </main>
    <SiteFooter />
    {process.env.VERCEL_ENV === "preview" && <HomeDiagnostics />}
    <Suspense fallback={null}><YahooEntryDiagnostics /></Suspense>
  </div>;
}
