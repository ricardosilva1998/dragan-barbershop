"use client";

import { useTranslation } from "@/i18n/useTranslation";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPageContent() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white print:text-black">
            {t("admin.dashboard.title")} <span className="text-amber-500 print:text-black">{t("admin.dashboard.titleHighlight")}</span>
          </h1>
          <p className="text-zinc-400 print:text-gray-600">{t("admin.dashboard.subtitle")}</p>
        </div>
      </div>
      <AdminDashboard />
    </div>
  );
}
