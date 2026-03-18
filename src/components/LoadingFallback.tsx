"use client";

import { useLocale } from "@/lib/i18n/context";

export default function LoadingFallback() {
  const { t } = useLocale();
  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff" }}>
      <div
        style={{
          padding: "32px 24px",
          maxWidth: 1200,
          margin: "0 auto",
          fontFamily: "var(--font-dm-mono)",
          fontSize: 12,
          color: "#444",
          animation: "loadingPulse 1.5s ease-in-out infinite",
        }}
      >
        {t("common", "loading_building")}
      </div>
    </div>
  );
}
