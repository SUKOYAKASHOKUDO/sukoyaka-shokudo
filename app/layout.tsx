import type { Metadata, Viewport } from "next";
import { site } from "../content/siteContent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "すこやか食堂｜札幌市中央区の子ども食堂",
    template: "%s｜すこやか食堂",
  },
  description:
    "札幌市中央区の子ども食堂「すこやか食堂」。開催案内、活動動画、企業・団体からのご支援、親子向けコラム、料理レシピをご案内します。",
  keywords: [
    "すこやか食堂",
    "子ども食堂",
    "札幌",
    "札幌市中央区",
    "企業協賛",
    "ボランティア",
  ],
  openGraph: {
    title: "すこやか食堂｜みんなで囲む、地域の食卓",
    description:
      "札幌市中央区の子ども食堂。開催情報、ご支援、活動の様子をご案内します。",
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "すこやか食堂",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "すこやか食堂｜みんなで囲む、地域の食卓",
    description:
      "札幌市中央区の子ども食堂。開催情報、ご支援、活動の様子をご案内します。",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f6977",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
