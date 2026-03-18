"use client";

import { Brand, BRANDS } from "@/data/brands";
import { useLocale } from "@/lib/i18n/context";

interface StatsProps {
  brands: (Brand & { country: string })[];
  country: string;
}

export default function Stats({ brands, country }: StatsProps) {
  const { t } = useLocale();
  const totalBrands = brands.length;
  const categories = [...new Set(brands.map((b) => b.cat))].length;
  const countries = country === "all" ? Object.keys(BRANDS).length : 1;

  return (
    <div
      style={{
        display: "flex",
        gap: 28,
        padding: "14px 0",
        borderTop: "1px solid #141414",
        borderBottom: "1px solid #141414",
      }}
    >
      {[
        { label: t("stats", "brands"), value: totalBrands },
        { label: t("stats", "categories"), value: categories },
        {
          label: countries === 1 ? t("stats", "country") : t("stats", "countries"),
          value: countries,
        },
        { label: t("stats", "pixels"), value: (totalBrands * 247).toLocaleString() },
      ].map((s) => (
        <div key={s.label}>
          <div style={{ fontFamily: "var(--font-newsreader)", fontSize: 22, color: "#fff", lineHeight: 1 }}>
            {s.value}
          </div>
          <div
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 8,
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginTop: 2,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
