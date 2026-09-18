"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const OPTIONS = [
  { value: "newest", key: "newest" },
  { value: "popular", key: "popular" },
  { value: "price_asc", key: "priceAsc" },
  { value: "price_desc", key: "priceDesc" },
] as const;

export default function SortSelect() {
  const t = useTranslations("products.sort");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  return (
    <select
      value={current}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
      }}
      className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {t(o.key)}
        </option>
      ))}
    </select>
  );
}
