import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request removal — The Brand Wall",
  description:
    "Request removal of your brand from The Brand Wall. We process verified requests within 7 business days.",
  robots: { index: false, follow: true },
};

export default function RequestRemovalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
