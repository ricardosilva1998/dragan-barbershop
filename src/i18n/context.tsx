"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Locale, DEFAULT_LOCALE, SUPPORTED_LOCALES, DATE_LOCALE_MAP } from "./config";
import en from "./locales/en.json";
import pt from "./locales/pt.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import de from "./locales/de.json";
import zh from "./locales/zh.json";

type Translations = Record<string, string>;

const localeMap: Record<Locale, Translations> = { en, pt, fr, es, it, de, zh };

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);

function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const stored = localStorage.getItem("locale");
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }

  const browserLang = navigator.language.split("-")[0];
  if (SUPPORTED_LOCALES.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem("locale", locale);
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      let value = localeMap[locale]?.[key] ?? localeMap[DEFAULT_LOCALE]?.[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{{${k}}}`, v);
        }
      }
      return value;
    },
    [locale]
  );

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
      const d = typeof date === "string" ? new Date(date.includes("T") ? date : date + "T00:00:00") : date;
      return d.toLocaleDateString(DATE_LOCALE_MAP[locale], options);
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, formatDate }}>
      {children}
    </I18nContext.Provider>
  );
}
