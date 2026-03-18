"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/context";

const CANONICAL = "https://www.brandwall.online";

export interface ShareButtonProps {
  /** Short label for the button (e.g. "Share", "Share Georgia's wall") */
  label: string;
  /** Pre-filled share text */
  text: string;
  /** Full URL to share (default: canonical homepage) */
  url?: string;
  /** Optional compact style (icon-only or shorter) */
  variant?: "default" | "compact";
  /** Optional className for the wrapper */
  className?: string;
}

export default function ShareButton({
  label,
  text,
  url = CANONICAL,
  variant = "default",
}: ShareButtonProps) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "The Brand Wall",
          text,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") copyToClipboard(url);
      }
      return;
    }
    copyToClipboard(url);
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const displayLabel = copied ? t("share", "link_copied") : label;

  return (
    <button
      type="button"
      onClick={handleShare}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: variant === "compact" ? 6 : 8,
        padding: variant === "compact" ? "8px 12px" : "10px 18px",
        borderRadius: 8,
        border: "1px solid #333",
        background: copied ? "#0a2a0a" : "#0c0c0c",
        color: copied ? "#06D6A0" : "#aaa",
        fontFamily: "var(--font-dm-mono)",
        fontSize: variant === "compact" ? 10 : 11,
        fontWeight: 600,
        cursor: "pointer",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        transition: "color 0.2s, background 0.2s, border-color 0.2s",
      }}
    >
      {copied ? (
        "✓"
      ) : (
        <span style={{ opacity: 0.9 }} aria-hidden>
          ⎘
        </span>
      )}
      {displayLabel}
    </button>
  );
}
