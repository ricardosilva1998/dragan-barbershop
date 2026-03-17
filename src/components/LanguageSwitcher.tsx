"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors text-sm"
        aria-label="Change language"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
        </svg>
        {LOCALE_NAMES[locale]}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[140px] z-50">
          {SUPPORTED_LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc as Locale);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                loc === locale
                  ? "text-amber-500 bg-zinc-700/50"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-700"
              }`}
            >
              {LOCALE_NAMES[loc as Locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
