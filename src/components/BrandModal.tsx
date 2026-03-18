"use client";

import { Brand } from "@/data/brands";
import { COUNTRIES } from "@/data/countries";
import { generateColor } from "@/data/utils";
import { useLocale } from "@/lib/i18n/context";
import ShareButton from "@/components/ShareButton";

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 5,
        border: `1px solid ${color}33`,
        background: `${color}0d`,
        color,
        fontFamily: "var(--font-dm-mono)",
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}

interface BrandModalProps {
  brand: (Brand & { country: string }) | null;
  onClose: () => void;
}

export default function BrandModal({ brand, onClose }: BrandModalProps) {
  const { t } = useLocale();

  if (!brand) return null;
  const color = generateColor(brand.name, brand.cat);
  const countryData = COUNTRIES[brand.country];

  const tierLabel =
    brand.size === "xl"
      ? t("modal", "tier_iconic")
      : brand.size === "lg"
        ? t("modal", "tier_rising")
        : brand.size === "md"
          ? t("modal", "tier_indie")
          : t("modal", "tier_micro");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#000d",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0c0c0c",
          border: `1px solid ${color}33`,
          borderRadius: 16,
          maxWidth: 500,
          width: "100%",
          overflow: "hidden",
          animation: "slideUp 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div style={{ height: 5, background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
        <div style={{ padding: "28px 28px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontWeight: 400,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color,
                  marginBottom: 6,
                }}
              >
                {countryData?.flag} {countryData?.nameEn} &middot; {t("categories", brand.cat)}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-newsreader)",
                  fontSize: 36,
                  fontWeight: 400,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {brand.name}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid #222",
                color: "#666",
                fontSize: 16,
                cursor: "pointer",
                width: 34,
                height: 34,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              &#10005;
            </button>
          </div>

          <p
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 13,
              color: "#aaa",
              lineHeight: 1.65,
              marginBottom: 20,
            }}
          >
            {brand.desc}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <Tag label={`${t("modal", "est")} ${brand.year}`} color={color} />
            <Tag label={t("categories", brand.cat)} color={color} />
            <Tag label={tierLabel} color={color} />
          </div>

          <a
            href={`https://${brand.url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              padding: "13px 20px",
              background: color,
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
            {t("modal", "visit")} {brand.name} &rarr;
          </a>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <ShareButton
              label={t("modal", "share_brand")}
              text={t("share", "share_brand_text").replace("{name}", brand.name)}
              url={`https://www.brandwall.online/?country=${brand.country}`}
              variant="compact"
            />
          </div>

          <div
            style={{
              marginTop: 14,
              textAlign: "center",
              fontFamily: "var(--font-dm-mono)",
              fontSize: 8,
              color: "#333",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            {t("modal", "pixel")} #{(brand.name.charCodeAt(0) * 1000 + brand.year).toLocaleString()} &middot; {t("common", "the_brand_wall")}
          </div>
        </div>
      </div>
    </div>
  );
}
