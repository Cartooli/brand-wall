"use client";

import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";

function HomeFallback() {
  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff" }}>
      <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto", fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "#444" }}>
        Loading…
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
