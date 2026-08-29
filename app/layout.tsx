import type { Metadata, Viewport } from "next";
import { BackToTopButton } from "../components/BackToTopButton";
import { site } from "../content/siteContent";
import "./globals.css";
import "./storybook-world.css";

const socialTitle = "すこやか食堂｜あたたかいごはんと、安心できる居場所";
const socialDescription =
  "子どもたちが、あたたかいごはんを食べながら安心して過ごせる地域の居場所です。";
const socialImage = "/images/brand/sukoyaka-ogp.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "札幌市中央区の子ども食堂 | すこやか食堂",
    template: "%s｜すこやか食堂",
  },
  description:
    "札幌市中央区の子ども食堂「すこやか食堂」。開催案内、日程とメニュー、活動記録、ボランティア、ご支援、親子向けレシピをご案内します。",
  keywords: [
    "すこやか食堂",
    "子ども食堂",
    "札幌",
    "札幌市中央区",
    "企業協賛",
    "ボランティア",
  ],
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: socialImage,
        width: 1254,
        height: 1254,
        alt: "子ども食堂 すこやか食堂",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: socialTitle,
    description: socialDescription,
    images: [socialImage],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/images/brand/sukoyaka-favicon-32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/images/brand/sukoyaka-favicon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/images/brand/sukoyaka-favicon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/images/brand/sukoyaka-favicon-32.png",
    apple: {
      url: "/images/brand/sukoyaka-favicon-180.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#c7f0f2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
