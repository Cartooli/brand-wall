"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Locale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  getNamespaceTranslations,
  Namespace,
  detectBrowserLocale,
} from "./index";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (namespace: Namespace, key: string) => string;
  supportedLocales: Locale[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = localStorage.getItem("app-locale") as Locale | null;
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      setLocaleState(stored);
    } else {
      const detected = detectBrowserLocale();
      setLocaleState(detected);
      localStorage.setItem("app-locale", detected);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem("app-locale", newLocale);
    }
  };

  const t = (namespace: Namespace, key: string): string => {
    const trans = getNamespaceTranslations(locale, namespace);
    return trans[key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, supportedLocales: SUPPORTED_LOCALES }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
