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

export const metadata: Metadata = {
  metadataBase: new URL(canonicalBase),
  title: "The Brand Wall",
  description: "A modernized Million Dollar Homepage. Every pixel block is an indie brand. Every URL path is a country.",
  alternates: {
    canonical: canonicalBase + "/",
  },
  openGraph: {
    url: canonicalBase + "/",
    siteName: "The Brand Wall",
  },
  twitter: {
    card: "summary_large_image",
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
