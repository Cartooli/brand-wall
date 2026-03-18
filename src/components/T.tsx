"use client";

import { useLocale } from "@/lib/i18n/context";
import type { Namespace } from "@/lib/i18n";

export function T({ ns, k }: { ns: Namespace; k: string }) {
  const { t } = useLocale();
  return <span suppressHydrationWarning>{t(ns, k)}</span>;
}
