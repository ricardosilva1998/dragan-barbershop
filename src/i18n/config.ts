export const SUPPORTED_LOCALES = ["en", "pt", "fr", "es", "it", "de", "zh"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  pt: "Portugues",
  fr: "Francais",
  es: "Espanol",
  it: "Italiano",
  de: "Deutsch",
  zh: "中文",
};

export const DATE_LOCALE_MAP: Record<Locale, string> = {
  en: "en-GB",
  pt: "pt-PT",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  de: "de-DE",
  zh: "zh-CN",
};
