"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n";

const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  ka: { short: "\u10E5\u10D0", full: "\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8" },
};

export default function LanguageSwitcher() {
  const { locale, setLocale, supportedLocales } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #222",
          background: "#0c0c0c",
          color: "#888",
          fontFamily: "var(--font-dm-mono)",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 13 }}>{locale === "ka" ? "\u{1F1EC}\u{1F1EA}" : "\u{1F1EC}\u{1F1E7}"}</span>
        {LOCALE_LABELS[locale].short}
        <span style={{ fontSize: 8, opacity: 0.5 }}>{open ? "\u25B2" : "\u25BC"}</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 4,
            background: "#0c0c0c",
            border: "1px solid #222",
            borderRadius: 8,
            overflow: "hidden",
            zIndex: 100,
            minWidth: 130,
            animation: "fadeIn 0.15s ease",
          }}
        >
          {supportedLocales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "10px 14px",
                border: "none",
                background: locale === loc ? "#1a1a1a" : "transparent",
                color: locale === loc ? "#fff" : "#666",
                fontFamily: "var(--font-dm-mono)",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.1s",
              }}
            >
              <span style={{ fontSize: 14 }}>{loc === "ka" ? "\u{1F1EC}\u{1F1EA}" : "\u{1F1EC}\u{1F1E7}"}</span>
              {LOCALE_LABELS[loc].full}
              {locale === loc && <span style={{ marginLeft: "auto", color: "#06D6A0", fontSize: 10 }}>&#10003;</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
