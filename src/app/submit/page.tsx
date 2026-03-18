"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/i18n/context";
import { COUNTRIES } from "@/data/countries";
import SubmitBrand from "@/components/SubmitBrand";

function SubmitContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const country = searchParams.get("country")?.toLowerCase() || undefined;
  const validCountry = country && country in COUNTRIES ? country : undefined;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050508",
        color: "#fff",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 11,
            color: "#555",
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 24,
            display: "inline-block",
          }}
        >
          ← {t("common", "the_brand_wall")}
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: 26,
            fontWeight: 400,
            marginBottom: 8,
          }}
        >
          {t("submit", "add_brand")}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 12,
            color: "#888",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {t("submit", "removal_promise")}
        </p>

        <SubmitBrand initialOpen={true} initialCountry={validCountry} />
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#050508",
            color: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-dm-mono)",
            fontSize: 12,
          }}
        >
          Loading…
        </div>
      }
    >
      <SubmitContent />
    </Suspense>
  );
}
