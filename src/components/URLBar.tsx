"use client";

import { COUNTRIES } from "@/data/countries";

interface URLBarProps {
  activeCountry: string;
}

export default function URLBar({ activeCountry }: URLBarProps) {
  return (
    <div
      style={{
        background: "#0c0c0c",
        border: "1px solid #1a1a1a",
        borderRadius: 10,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        maxWidth: 520,
        fontFamily: "var(--font-dm-mono)",
      }}
    >
      <span style={{ color: "#333", fontSize: 13 }}>&#x1F512;</span>
      <span style={{ color: "#444", fontSize: 12 }}>brandwall.xyz</span>
      <span style={{ color: "#222" }}>/</span>
      <span
        style={{
          color: activeCountry === "all" ? "#06D6A0" : COUNTRIES[activeCountry]?.accent || "#fff",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {activeCountry === "all" ? "explore" : `country/${activeCountry}`}
      </span>
    </div>
  );
}
