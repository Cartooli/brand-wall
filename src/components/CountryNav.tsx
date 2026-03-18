"use client";

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { useLocale } from "@/lib/i18n/context";

function NavBtn({
  label,
  active,
  accent,
  onClick,
  featured,
}: {
  label: string;
  active: boolean;
  accent: string;
  onClick: () => void;
  featured?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "8px 14px",
        borderRadius: 6,
        border: active ? `1px solid ${accent}` : featured ? `1px solid ${accent}44` : "1px solid #1e1e1e",
        background: active ? `${accent}22` : hov ? "#151515" : featured ? `${accent}08` : "transparent",
        color: active ? accent : hov ? "#fff" : featured ? accent : "#666",
        fontFamily: "var(--font-dm-mono)",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

interface CountryNavProps {
  activeCountry: string;
  onSelect: (country: string) => void;
}

export default function CountryNav({ activeCountry, onSelect }: CountryNavProps) {
  const { t } = useLocale();

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        overflowX: "auto",
        padding: "4px 0",
        scrollbarWidth: "none",
      }}
    >
      <NavBtn label={`🌍 ${t("common", "all")}`} active={activeCountry === "all"} accent="#fff" onClick={() => onSelect("all")} />
      <NavBtn
        label={`${COUNTRIES.georgia.flag} GEO`}
        active={activeCountry === "georgia"}
        accent="#E4002B"
        onClick={() => onSelect("georgia")}
        featured
      />
      {Object.entries(COUNTRIES)
        .filter(([k]) => k !== "georgia")
        .map(([key, val]) => (
          <NavBtn
            key={key}
            label={`${val.flag} ${key.toUpperCase().slice(0, 3)}`}
            active={activeCountry === key}
            accent={val.accent}
            onClick={() => onSelect(key)}
          />
        ))}
    </div>
  );
}
