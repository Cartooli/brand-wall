"use client";

import { useState } from "react";
import { Brand, SIZE_MAP } from "@/data/brands";
import { COUNTRIES } from "@/data/countries";
import { generateColor } from "@/data/utils";

interface BrandBlockProps {
  brand: Brand & { country: string };
  cellSize: number;
  delay: number;
  onClick: (brand: Brand & { country: string }) => void;
}

export default function BrandBlock({ brand, cellSize, delay, onClick }: BrandBlockProps) {
  const [hovered, setHovered] = useState(false);
  const span = SIZE_MAP[brand.size];
  const color = generateColor(brand.name, brand.cat);

  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        gridRow: `span ${span}`,
        background: color,
        borderRadius: 5,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        zIndex: hovered ? 10 : 1,
        boxShadow: hovered ? `0 8px 32px ${color}88, 0 0 0 2px #fff2` : `0 1px 3px #0004`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: cellSize * span,
        animation: `blockPop 0.4s cubic-bezier(.4,0,.2,1) ${delay}ms both`,
        opacity: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(brand)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered ? "linear-gradient(135deg, #fff2 0%, transparent 50%)" : "none",
          transition: "background 0.2s",
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontWeight: 600,
          fontSize: span >= 4 ? 14 : span >= 3 ? 11 : span >= 2 ? 9 : 7,
          color: "#fff",
          textShadow: "0 1px 6px #0009",
          textAlign: "center",
          padding: span >= 2 ? 8 : 3,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          wordBreak: "break-word",
        }}
      >
        {brand.name}
      </div>
      {hovered && span >= 2 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "5px 8px",
            background: "#000b",
            backdropFilter: "blur(10px)",
            fontSize: 8,
            color: "#fffd",
            fontFamily: "var(--font-dm-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{brand.cat}</span>
          <span>{COUNTRIES[brand.country]?.flag}</span>
        </div>
      )}
    </div>
  );
}
