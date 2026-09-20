"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice, formatNumber, interpolate } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";

const WASTE_PERCENT = 10;
const SQM_PER_CARTON = 1.44; // typical box coverage for wall/floor tile; used only for the carton estimate

export default function CoverageCalculator({
  product,
}: {
  product: { productId: string; name: string; slug: string; image: string | null; price: number; unit: string; stock: number };
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const area = (Number(length) || 0) * (Number(width) || 0);
  const withWaste = area * (1 + WASTE_PERCENT / 100);
  const cartons = Math.ceil(withWaste / SQM_PER_CARTON);
  const roundedSqm = Math.ceil(withWaste);
  const estimatedPrice = roundedSqm * product.price;
  const hasResult = area > 0;
  const sqmLabel = t("units.SQUARE_METER");

  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
        <Calculator size={16} className="text-brand-500" />
        {t("product.calculator.title")}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">{t("product.calculator.length")}</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder={`${t("product.calculator.examplePrefix")} ${formatNumber(4, locale)}`}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">{t("product.calculator.width")}</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder={`${t("product.calculator.examplePrefix")} ${formatNumber(3, locale)}`}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
      </div>

      {hasResult && (
        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
          <Row label={t("product.calculator.area")} value={`${formatNumber(area.toFixed(1), locale)} ${sqmLabel}`} />
          <Row
            label={interpolate(t.raw("product.calculator.withWaste"), { percent: formatNumber(WASTE_PERCENT, locale) })}
            value={`${formatNumber(roundedSqm, locale)} ${sqmLabel}`}
          />
          {product.unit === "CARTON" || product.unit === "SQUARE_METER" ? (
            <Row label={t("product.calculator.cartons")} value={formatNumber(cartons, locale)} />
          ) : null}
          <div className="border-t border-slate-200 pt-2">
            <Row label={t("product.calculator.estimatedPrice")} value={formatPrice(estimatedPrice, locale)} bold />
          </div>
          <button
            onClick={() => {
              addItem(product, roundedSqm);
              toast.success(`${formatNumber(roundedSqm, locale)} ${sqmLabel} — ${t("product.addedToCart")}`);
            }}
            disabled={product.stock <= 0}
            className="mt-2 w-full rounded-xl bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {interpolate(t.raw("product.calculator.addToCartWithAmount"), { amount: formatNumber(roundedSqm, locale) })}
          </button>
        </div>
      )}
      <p className="mt-2 text-[11px] leading-5 text-slate-400">{t("product.calculator.note")}</p>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-bold text-slate-900" : "text-slate-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
