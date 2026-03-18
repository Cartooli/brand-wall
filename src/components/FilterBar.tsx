"use client";

import { CATEGORIES, CAT_COLORS } from "@/data/categories";
import { useLocale } from "@/lib/i18n/context";

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 10px",
        borderRadius: 4,
        border: "none",
        background: active ? `${color}28` : "#131313",
        color: active ? color : "#555",
        fontFamily: "var(--font-dm-mono)",
        fontSize: 9,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

interface FilterBarProps {
  activeCat: string;
  onSelect: (cat: string) => void;
}

export default function FilterBar({ activeCat, onSelect }: FilterBarProps) {
  const { t } = useLocale();

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      <FilterChip label={t("common", "all")} active={activeCat === "all"} color="#fff" onClick={() => onSelect("all")} />
      {CATEGORIES.map((cat) => (
        <FilterChip key={cat} label={t("categories", cat)} active={activeCat === cat} color={CAT_COLORS[cat]} onClick={() => onSelect(cat)} />
      ))}
    </div>
  );
}
