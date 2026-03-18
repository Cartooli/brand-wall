"use client";

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { useLocale } from "@/lib/i18n/context";

interface URLBarProps {
  activeCountry: string;
}

export default function URLBar({ activeCountry }: URLBarProps) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        background: copied ? "#0a1a0a" : "#0c0c0c",
        border: copied ? "1px solid #06D6A033" : "1px solid #1a1a1a",
        borderRadius: 10,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        maxWidth: 520,
        fontFamily: "var(--font-dm-mono)",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
        textAlign: "left",
        width: "100%",
      }}
    >
      <span style={{ color: "#333", fontSize: 13 }}>&#x1F512;</span>
      <span style={{ color: "#444", fontSize: 12 }}>www.brandwall.online</span>
      <span style={{ color: "#222" }}>/</span>
      <span
        style={{
          color: activeCountry === "all" ? "#06D6A0" : COUNTRIES[activeCountry]?.accent || "#fff",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {activeCountry === "all" ? t("common", "explore") : `country/${activeCountry}`}
      </span>
      {copied && (
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#06D6A0" }}>
          {t("share", "url_copied")}
        </span>
      )}
    </button>
  );
}
