"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COUNTRIES } from "@/data/countries";
import { useLocale } from "@/lib/i18n/context";

const inputBaseStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #222",
  background: "#0c0c0c",
  color: "#fff",
  fontFamily: "var(--font-dm-mono)",
  fontSize: 12,
  outline: "none",
  width: "100%",
};

const selectStyle: React.CSSProperties = {
  ...inputBaseStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
};

function RequestRemovalForm() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    brandName: "",
    country: "",
    email: "",
    reason: "",
  });

  useEffect(() => {
    const brand = searchParams.get("brand");
    const country = searchParams.get("country");
    if (brand) setForm((f) => ({ ...f, brandName: decodeURIComponent(brand) }));
    if (country) setForm((f) => ({ ...f, country: decodeURIComponent(country).toLowerCase() }));
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/request-removal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || t("removal", "error_send"));
        return;
      }
      setSubmitted(true);
    } catch {
      setError(t("removal", "error_send"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050508",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 440,
            padding: 28,
            borderRadius: 16,
            border: "1px dashed #E4002B33",
            background: "#E4002B06",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: 14, color: "#E4002B", marginBottom: 8 }}>
            &#10022; {t("removal", "received_title")}
          </div>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
            {t("removal", "received_body")}
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #333",
              background: "transparent",
              color: "#888",
              fontFamily: "var(--font-dm-mono)",
              fontSize: 11,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← {t("removal", "back_to_wall")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050508",
        color: "#fff",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
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
            fontSize: 28,
            fontWeight: 400,
            marginBottom: 8,
          }}
        >
          {t("removal", "title")}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 12,
            color: "#888",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          {t("removal", "sla_copy")}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: 24,
            borderRadius: 12,
            border: "1px solid #1a1a1a",
            background: "#0a0a0a",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label
                htmlFor="brandName"
                style={{
                  display: "block",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 10,
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                {t("removal", "label_brand")}
              </label>
              <input
                id="brandName"
                type="text"
                required
                placeholder={t("common", "brand_name")}
                value={form.brandName}
                onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
                style={inputBaseStyle}
              />
            </div>
            <div>
              <label
                htmlFor="country"
                style={{
                  display: "block",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 10,
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                {t("common", "country")}
              </label>
              <select
                id="country"
                required
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                style={selectStyle}
              >
                <option value="">{t("removal", "select_country")}</option>
                {Object.entries(COUNTRIES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.flag} {v.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 10,
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                {t("removal", "label_email")}
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                style={inputBaseStyle}
              />
            </div>
            <div>
              <label
                htmlFor="reason"
                style={{
                  display: "block",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 10,
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                {t("removal", "label_reason")} ({t("removal", "optional")})
              </label>
              <textarea
                id="reason"
                placeholder={t("removal", "reason_placeholder")}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                style={{ ...inputBaseStyle, height: 72, resize: "none" }}
                rows={3}
              />
            </div>
            {error && (
              <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "#E4002B" }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
              <Link
                href="/"
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #222",
                  background: "transparent",
                  color: "#888",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {t("common", "cancel")}
              </Link>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid #E4002B",
                  background: "#E4002B",
                  color: "#fff",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: submitting ? "wait" : "pointer",
                  opacity: submitting ? 0.8 : 1,
                }}
              >
                {submitting ? t("removal", "sending") : t("removal", "submit")}
              </button>
            </div>
          </div>
        </form>

        <p
          style={{
            marginTop: 20,
            fontFamily: "var(--font-dm-mono)",
            fontSize: 10,
            color: "#444",
            lineHeight: 1.5,
          }}
        >
          {t("removal", "privacy_note")}
        </p>
      </div>
    </div>
  );
}

export default function RequestRemovalPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#050508",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-dm-mono)",
            fontSize: 12,
            color: "#444",
          }}
        >
          Loading…
        </div>
      }
    >
      <RequestRemovalForm />
    </Suspense>
  );
}
