"use client";

import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import LoadingFallback from "@/components/LoadingFallback";

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
