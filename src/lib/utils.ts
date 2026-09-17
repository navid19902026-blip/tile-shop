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
