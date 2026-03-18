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
  },
  robots: { index: true, follow: true },
};

export default function SubmitLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
