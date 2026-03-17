"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-amber-500">{t("home.hero.title1")}</span> {t("home.hero.title2")}
            <br />
            {t("home.hero.title3")}
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            {t("home.hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              {t("home.hero.bookAppointment")}
            </Link>
            <Link
              href="/about"
              className="border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              {t("home.hero.learnMore")}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.services.title")} <span className="text-amber-500">{t("home.services.titleHighlight")}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t("home.services.haircut.title"),
                desc: t("home.services.haircut.desc"),
                icon: "✂️",
              },
              {
                title: t("home.services.beardTrim.title"),
                desc: t("home.services.beardTrim.desc"),
                icon: "🪒",
              },
              {
                title: t("home.services.fullService.title"),
                desc: t("home.services.fullService.desc"),
                icon: "💈",
              },
            ].map((service) => (
              <div
                key={service.icon}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center hover:border-amber-600/50 transition-colors"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-zinc-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section — Instagram Embeds */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.gallery.title")} <span className="text-amber-500">{t("home.gallery.titleHighlight")}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "https://www.instagram.com/p/DG17J1cNaA5/",
              "https://www.instagram.com/p/DGzHaWENMXA/",
              "https://www.instagram.com/p/DGMxIcUtFQr/",
              "https://www.instagram.com/p/DFdcVFptqKP/",
              "https://www.instagram.com/p/DEyh_nMtiLi/",
              "https://www.instagram.com/p/DEeK0w9Nlxr/",
            ].map((url) => (
              <div key={url} className="flex justify-center">
                <blockquote
                  className="instagram-media"
                  data-instgrm-captioned
                  data-instgrm-permalink={url}
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
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t("home.instagram.followUs")}</h2>
          <a
            href="https://www.instagram.com/dragan.barbershop21"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 text-lg font-semibold transition-colors"
          >
            @dragan.barbershop21
          </a>
        </div>
      </section>
    </div>
  );
}
