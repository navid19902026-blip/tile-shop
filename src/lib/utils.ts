import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const toPersianDigitsMap: Record<string, string> = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
};

export function toPersianDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, (d) => toPersianDigitsMap[d]);
}

export function formatToman(amount: number) {
  return toPersianDigits(amount.toLocaleString("en-US")) + " تومان";
}

// Approximate free-market Toman/USD rate (Sep 2026). Display-only — update as needed.
export const TOMAN_PER_USD = 230_000;

/**
 * Locale-aware price formatter. The `fa` (domestic) locale shows Toman with
 * Persian digits; the other, export-facing locales (az/en/ka) show the
 * approximate USD equivalent.
 */
export function formatPrice(amount: number, locale: string) {
  if (locale === "fa") {
    return `${toPersianDigits(amount.toLocaleString("en-US"))} تومان`;
  }
  const usd = amount / TOMAN_PER_USD;
  const formatted = usd.toLocaleString("en-US", {
    minimumFractionDigits: usd < 100 ? 2 : 0,
    maximumFractionDigits: usd < 100 ? 2 : 0,
  });
  return `$${formatted}`;
}

/** Locale-aware digit formatter (fa keeps Persian digits, others use Western digits). */
export function formatNumber(value: number | string, locale: string) {
  return locale === "fa" ? toPersianDigits(value) : String(value);
}

const DATE_LOCALE_BY_LOCALE: Record<string, string> = {
  fa: "fa-IR",
  az: "az-Latn-AZ",
  en: "en-US",
  ka: "ka-GE",
};

/** Locale-aware date formatter. */
export function formatDate(date: Date | string, locale: string) {
  return new Date(date).toLocaleDateString(DATE_LOCALE_BY_LOCALE[locale] ?? "en-US");
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const PRODUCT_UNIT_LABELS: Record<string, string> = {
  SQUARE_METER: "متر مربع",
  CARTON: "کارتن",
  PIECE: "عدد",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELED: "لغو‌شده",
};

export const TIER_LABELS: Record<string, string> = {
  BRONZE: "برنزی",
  SILVER: "نقره‌ای",
  GOLD: "طلایی",
};
