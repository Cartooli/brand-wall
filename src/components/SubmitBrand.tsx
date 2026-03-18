"use client";

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { CATEGORIES } from "@/data/categories";
import { useLocale } from "@/lib/i18n/context";
import ShareButton from "@/components/ShareButton";

export type SubmitBrandProps = {
  /** When true, the form is expanded on mount (e.g. on /submit page). */
  initialOpen?: boolean;
  /** Pre-fill country (e.g. "georgia" from ?country=georgia). */
  initialCountry?: string;
};

const inputBaseStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #222",
  background: "#0c0c0c",
  color: "#fff",
  fontFamily: "var(--font-dm-mono)",
  fontSize: 12,
  outline: "none",
  flex: 1,
};

const selectStyle: React.CSSProperties = {
  ...inputBaseStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
};

export default function SubmitBrand({ initialOpen, initialCountry }: SubmitBrandProps = {}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(!!initialOpen);
  const [submitted, setSubmitted] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    country: initialCountry ?? "",
    cat: "",
    desc: "",
  });

  if (submitted)
    return (
      <div
        style={{
          padding: 20,
          borderRadius: 12,
          border: "1px dashed #E4002B33",
          background: "#E4002B06",
          textAlign: "center",
          animation: "successScaleIn 0.35s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "#E4002B" }}>
          &#10022; {form.name} {t("submit", "submitted_for_curation")}
        </div>
        <div
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 11,
            color: "#888",
            marginTop: 8,
          }}
        >
          {t("submit", "success_check_back").replace("{name}", form.name)}
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          <ShareButton
            label={t("share", "share_submitted")}
            text={t("share", "share_submitted_text")}
            url="https://www.brandwall.online"
            variant="compact"
          />
        </div>
      </div>
    );

  if (!open)
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          style={{
            width: "100%",
            padding: 20,
            borderRadius: 12,
            border: ctaHovered ? "1px dashed #333" : "1px dashed #222",
            background: ctaHovered ? "#0c0c0c" : "#0a0a0a",
            color: ctaHovered ? "#555" : "#444",
            fontFamily: "var(--font-dm-mono)",
            fontSize: 12,
            cursor: "pointer",
            transition: "all 0.2s",
            textAlign: "center",
            boxShadow: ctaHovered ? "0 0 0 1px #1a1a1a" : "none",
          }}
        >
          {t("submit", "submit_brand_cta")}
        </button>
        <div
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 10,
            color: "#333",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {t("submit", "cta_subtext")}
        </div>
      </div>
    );

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid #1a1a1a",
        background: "#0a0a0a",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: 11,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 6,
        }}
      >
        {t("submit", "add_brand")}
      </div>
      <div
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: 10,
          color: "#444",
          marginBottom: 14,
        }}
      >
        {t("submit", "removal_promise")}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder={t("common", "brand_name")}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            style={inputBaseStyle}
          />
          <input
            type="text"
            placeholder={t("common", "url")}
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            style={inputBaseStyle}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            style={selectStyle}
          >
            <option value="">{t("common", "country")}</option>
            {Object.entries(COUNTRIES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.flag} {v.nameEn}
              </option>
            ))}
          </select>
          <select
            value={form.cat}
            onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))}
            style={selectStyle}
          >
            <option value="">{t("common", "category")}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t("categories", c)}
              </option>
            ))}
          </select>
        </div>
        <textarea
          placeholder={t("submit", "placeholder_pitch")}
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
          style={{ ...inputBaseStyle, height: 48, resize: "none" }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #222",
              background: "transparent",
              color: "#888",
              fontFamily: "var(--font-dm-mono)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("common", "cancel")}
          </button>
          {form.name && (
            <button
              onClick={() => setSubmitted(true)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #E4002B",
                background: "#E4002B",
                color: "#fff",
                fontFamily: "var(--font-dm-mono)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("common", "submit")} &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
