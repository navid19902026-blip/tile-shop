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

const CURRENCY_LABEL_BY_LOCALE: Record<string, string> = {
  fa: "تومان",
  az: "tümen",
  en: "Toman",
  ka: "თუმანი",
};

/** Locale-aware price formatter for pages wired up to next-intl (fa keeps Persian digits, others use Western digits). */
export function formatPrice(amount: number, locale: string) {
  const digits = amount.toLocaleString("en-US");
  const localizedDigits = locale === "fa" ? toPersianDigits(digits) : digits;
  return `${localizedDigits} ${CURRENCY_LABEL_BY_LOCALE[locale] ?? CURRENCY_LABEL_BY_LOCALE.en}`;
}

/** Locale-aware digit formatter (fa keeps Persian digits, others use Western digits). */
export function formatNumber(value: number | string, locale: string) {
  return locale === "fa" ? toPersianDigits(value) : String(value);
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
