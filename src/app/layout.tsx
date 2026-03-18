import type { Metadata } from "next";
import { Newsreader, DM_Mono, Noto_Sans_Georgian } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n/context";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  subsets: ["georgian"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const canonicalBase = "https://www.brandwall.online";

const title = "The Brand Wall";
const description =
  "A pixel mosaic of indie brands from 11 countries. Every block is a brand. Every path is a country. Explore Georgia first — then the world.";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalBase),
  title,
  description,
  alternates: {
    canonical: canonicalBase + "/",
  },
  openGraph: {
    type: "website",
    url: canonicalBase + "/",
    siteName: title,
    title,
    description,
    locale: "en_GB",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The Brand Wall — indie brands from 11 countries. Featured: Georgia.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${dmMono.variable} ${notoGeorgian.variable}`}>
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
