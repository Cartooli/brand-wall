import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a brand — The Brand Wall",
  description:
    "Add your indie brand to The Brand Wall. Free. Name, URL, one-line pitch. You can request removal anytime — we process within 7 days.",
  openGraph: {
    title: "Submit a brand — The Brand Wall",
    description:
      "Add your indie brand to The Brand Wall. Free. You can request removal anytime — we process within 7 days.",
    url: "https://www.brandwall.online/submit",
    images: [
      {
        url: "https://www.brandwall.online/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The Brand Wall — Submit your indie brand.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit a brand — The Brand Wall",
    description:
      "Add your indie brand to The Brand Wall. Free. You can request removal anytime — we process within 7 days.",
    images: ["https://www.brandwall.online/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function SubmitLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
