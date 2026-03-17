"use client";

import BookingForm from "@/components/BookingForm";
import { useTranslation } from "@/i18n/useTranslation";

export default function BookingPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {t("booking.title")} <span className="text-amber-500">{t("booking.titleHighlight")}</span>
      </h1>
      <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">
        {t("booking.subtitle")}
      </p>
      <BookingForm />
    </div>
  );
}
