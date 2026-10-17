import styles from "./home-top.module.css";

/** Production artwork baked to pixels once; no runtime masks or filters. */
export function HomeHeaderArtwork() {
  return <div className={styles.headerArtwork} aria-hidden="true">
    <div className={styles.mobileArtwork}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.natureArtwork} src="/images/home-rebuild/header-nature.png" width="760" height="370" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.cloudArtwork} src="/images/home-rebuild/header-cloud.png" width="200" height="110" alt="" />
    </div>
  </div>;
}
