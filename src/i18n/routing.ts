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
});
