"use client";

import { useContext } from "react";
import { I18nContext, type I18nContextType } from "./context";

export function useTranslation(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
