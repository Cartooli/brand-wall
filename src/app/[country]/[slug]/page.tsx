import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBrandByCountrySlug } from "@/data/slugs";
import { COUNTRIES } from "@/data/countries";
import HomeContent from "@/components/HomeContent";
import BrandNotFound from "@/components/BrandNotFound";

const VALID_COUNTRIES = new Set(Object.keys(COUNTRIES));

type Props = {
  params: Promise<{ country: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, slug } = await params;
  const c = country.toLowerCase();
  if (!VALID_COUNTRIES.has(c)) return { title: "Not Found" };
  const brand = getBrandByCountrySlug(c, slug);
  if (!brand) return { title: "Not Found" };
  const title = `${brand.name} | The Brand Wall`;
  const description = brand.desc;
  const canonicalBase = "https://www.brandwall.online";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${canonicalBase}/${c}/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function BrandPageFallback() {
  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff" }}>
      <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto", fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "#444" }}>
        Loading…
      </div>
    </div>
  );
}

export default async function BrandPage({ params }: Props) {
  const { country, slug } = await params;
  const c = country.toLowerCase();
  if (!VALID_COUNTRIES.has(c)) notFound();
  const brand = getBrandByCountrySlug(c, slug);
  if (!brand) return <BrandNotFound country={c} />;
  return (
    <Suspense fallback={<BrandPageFallback />}>
      <HomeContent initialCountry={c} initialBrand={brand} />
    </Suspense>
  );
}
