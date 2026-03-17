"use client";

import { useTranslation } from "@/i18n/useTranslation";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">
        {t("about.title")} <span className="text-amber-500">{t("about.titleHighlight")}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Instagram photo embed */}
        <div className="flex justify-center">
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink="https://www.instagram.com/p/DG17J1cNaA5/"
            style={{
              maxWidth: "540px",
              width: "100%",
              background: "#1c1917",
              border: "1px solid #3f3f46",
              borderRadius: "12px",
              margin: 0,
            }}
          />
        </div>

        {/* Bio */}
        <div>
          <h2 className="text-2xl font-bold text-amber-500 mb-6">{t("about.theBarber")}</h2>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>{t("about.bio1")}</p>
            <p>{t("about.bio2")}</p>
            <p>{t("about.bio3")}</p>
          </div>

          <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">{t("about.openingHours")}</h3>
            <div className="space-y-2 text-sm">
              {[
                { day: t("hours.mondayFriday"), hours: "10:00 - 20:00" },
                { day: t("hours.saturday"), hours: "10:00 - 18:00" },
                { day: t("hours.sunday"), hours: t("hours.closed") },
              ].map((item) => (
                <div key={item.day} className="flex justify-between">
                  <span className="text-zinc-400">{item.day}</span>
                  <span className="text-amber-500 font-medium">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
