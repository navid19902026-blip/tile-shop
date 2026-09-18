"use client";

import { useLocale, useTranslations } from "next-intl";
import { Menu } from "@headlessui/react";
import { Globe, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-600"
        aria-label={t("language")}
      >
        <Globe size={18} />
      </Menu.Button>
      <Menu.Items className="absolute left-0 z-50 mt-2 w-40 origin-top-left rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg focus:outline-none">
        {LOCALES.map((l) => (
          <Menu.Item key={l}>
            <button
              onClick={() => router.replace({ pathname, query: Object.fromEntries(searchParams.entries()) }, { locale: l })}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600"
            >
              {LOCALE_LABELS[l]}
              {l === locale && <Check size={14} className="text-brand-500" />}
            </button>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
