"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-amber-500 font-bold text-lg mb-3">Barbershop Dragan</h3>
            <p className="text-zinc-400 text-sm">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t("footer.address")}</h4>
            <p className="text-zinc-400 text-sm">
              Rua Placeholder, 123<br />
              2780-001 Oeiras<br />
              Portugal
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t("footer.followUs")}</h4>
            <a
              href="https://www.instagram.com/dragan.barbershop21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 transition-colors text-sm"
            >
              @dragan.barbershop21
            </a>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} {t("footer.rights")}
          </p>
          <Link href="/admin/login" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">
            {t("footer.admin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
