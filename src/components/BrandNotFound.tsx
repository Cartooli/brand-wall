"use client";

import Link from "next/link";
import { COUNTRIES } from "@/data/countries";
import { useLocale } from "@/lib/i18n/context";

interface BrandNotFoundProps {
  country: string;
}

export default function BrandNotFound({ country }: BrandNotFoundProps) {
  const { t } = useLocale();
  const countryData = COUNTRIES[country];
  const nameEn = countryData?.nameEn ?? country;

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <p
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 13,
            color: "#555",
            marginBottom: 16,
          }}
        >
          {t("not_found", "brand_message")}
        </p>
        <Link
          href={`/?country=${country}`}
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#06D6A0",
            color: "#fff",
            borderRadius: 10,
            fontFamily: "var(--font-dm-mono)",
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {t("not_found", "explore_country").replace("{country}", nameEn)} →
        </Link>
      </div>
    </div>
  );
}
