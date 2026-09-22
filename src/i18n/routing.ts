import { defineRouting } from "next-intl/routing";

export const LOCALES = ["fa", "az", "en", "ka"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  fa: "فارسی",
  az: "Azərbaycan",
  en: "English",
  ka: "ქართული",
};

export const RTL_LOCALES: Locale[] = ["fa"];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "fa",
  localePrefix: "as-needed",
  // Cookie/Accept-Language-based auto-redirect has caused an infinite
  // redirect loop on this host's reverse proxy (the site already has its
  // own language switcher, so this isn't needed).
  localeDetection: false,
});
