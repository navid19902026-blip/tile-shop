"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type FilterOptions = {
  brands: string[];
  colors: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
};

export default function ProductFilters({ options }: { options: FilterOptions }) {
  const t = useTranslations("products.filters");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selected = {
    brand: searchParams.getAll("brand"),
    color: searchParams.getAll("color"),
    size: searchParams.getAll("size"),
    antiSlip: searchParams.get("antiSlip") === "1",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  };

  function updateParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleMulti(key: "brand" | "color" | "size", value: string) {
    updateParams((params) => {
      const values = params.getAll(key);
      params.delete(key);
      if (values.includes(value)) {
        values.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        [...values, value].forEach((v) => params.append(key, v));
      }
    });
  }

  const content = (
    <div className="space-y-6">
      {options.brands.length > 0 && (
        <FilterGroup title={t("brand")}>
          {options.brands.map((b) => (
            <CheckboxRow key={b} label={b} checked={selected.brand.includes(b)} onChange={() => toggleMulti("brand", b)} />
          ))}
        </FilterGroup>
      )}

      {options.sizes.length > 0 && (
        <FilterGroup title={t("size")}>
          {options.sizes.map((s) => (
            <CheckboxRow key={s} label={s} checked={selected.size.includes(s)} onChange={() => toggleMulti("size", s)} />
          ))}
        </FilterGroup>
      )}

      {options.colors.length > 0 && (
        <FilterGroup title={t("color")}>
          {options.colors.map((c) => (
            <CheckboxRow key={c} label={c} checked={selected.color.includes(c)} onChange={() => toggleMulti("color", c)} />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title={t("feature")}>
        <CheckboxRow
          label={t("antiSlip")}
          checked={selected.antiSlip}
          onChange={() =>
            updateParams((params) => {
              if (params.get("antiSlip") === "1") params.delete("antiSlip");
              else params.set("antiSlip", "1");
            })
          }
        />
      </FilterGroup>

      <FilterGroup title={t("priceRange")}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`${t("from")} ${formatPrice(options.minPrice, locale)}`}
            defaultValue={selected.minPrice}
            onBlur={(e) => updateParams((p) => (e.target.value ? p.set("minPrice", e.target.value) : p.delete("minPrice")))}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
          />
          <span className="text-slate-300">-</span>
          <input
            type="number"
            placeholder={`${t("to")} ${formatPrice(options.maxPrice, locale)}`}
            defaultValue={selected.maxPrice}
            onBlur={(e) => updateParams((p) => (e.target.value ? p.set("maxPrice", e.target.value) : p.delete("maxPrice")))}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
          />
        </div>
      </FilterGroup>

      <button
        onClick={() => router.push(pathname)}
        className="w-full rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
      >
        {t("clearAll")}
      </button>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>

      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700"
        >
          <SlidersHorizontal size={16} />
          {t("toggle")}
        </button>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-bold">{t("toggle")}</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              {content}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-slate-800">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded accent-brand-500" />
      {label}
    </label>
  );
}
