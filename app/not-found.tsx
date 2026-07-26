import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="not-found-page">
        <div className="shell">
          <p className="eyebrow">404 NOT FOUND</p>
          <h1>ページが見つかりませんでした</h1>
          <p>
            URLが変更されたか、公開前のページである可能性があります。ホームから目的の情報をご確認ください。
          </p>
          <Link className="button" href="/">
            ホームへ戻る
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
