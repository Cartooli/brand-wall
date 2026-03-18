import en from "./en.json";
import ka from "./ka.json";

export type Locale = "en" | "ka";
export type Namespace = keyof typeof en;

export const SUPPORTED_LOCALES: Locale[] = ["en", "ka"];
export const DEFAULT_LOCALE: Locale = "en";

const translations: Record<Locale, typeof en> = { en, ka };

export function getNamespaceTranslations(locale: Locale, namespace: Namespace): Record<string, string> {
  const trans = translations[locale] || translations[DEFAULT_LOCALE];
  return trans[namespace] as Record<string, string>;
}

export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const browserLocale = navigator.language.split("-")[0];
  return SUPPORTED_LOCALES.includes(browserLocale as Locale) ? (browserLocale as Locale) : DEFAULT_LOCALE;
}
