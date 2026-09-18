"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { formatToman, PRODUCT_UNIT_LABELS, toPersianDigits } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";

const WASTE_PERCENT = 10;
const SQM_PER_CARTON = 1.44; // typical box coverage for wall/floor tile; used only for the carton estimate

export default function CoverageCalculator({
  product,
}: {
  product: { productId: string; name: string; slug: string; image: string | null; price: number; unit: string; stock: number };
}) {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const area = (Number(length) || 0) * (Number(width) || 0);
  const withWaste = area * (1 + WASTE_PERCENT / 100);
  const cartons = Math.ceil(withWaste / SQM_PER_CARTON);
  const roundedSqm = Math.ceil(withWaste);
  const estimatedPrice = roundedSqm * product.price;
  const hasResult = area > 0;

  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
        <Calculator size={16} className="text-brand-500" />
        محاسبه‌گر متراژ مورد نیاز
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">طول فضا (متر)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="مثلاً ۴"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">عرض فضا (متر)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="مثلاً ۳"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
      </div>

      {hasResult && (
        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
          <Row label="مساحت فضا" value={`${toPersianDigits(area.toFixed(1))} متر مربع`} />
          <Row label={`با احتساب ${toPersianDigits(WASTE_PERCENT)}٪ دورریز`} value={`${toPersianDigits(roundedSqm)} متر مربع`} />
          {product.unit === "CARTON" || product.unit === "SQUARE_METER" ? (
            <Row label="تعداد کارتن تقریبی" value={`${toPersianDigits(cartons)} کارتن`} />
          ) : null}
          <div className="border-t border-slate-200 pt-2">
            <Row label="هزینه تقریبی" value={formatToman(estimatedPrice)} bold />
          </div>
          <button
            onClick={() => {
              addItem(product, roundedSqm);
              toast.success(`${toPersianDigits(roundedSqm)} ${PRODUCT_UNIT_LABELS[product.unit] ?? ""} به سبد خرید اضافه شد`);
            }}
            disabled={product.stock <= 0}
            className="mt-2 w-full rounded-xl bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            افزودن {toPersianDigits(roundedSqm)} متر به سبد خرید
          </button>
        </div>
      )}
      <p className="mt-2 text-[11px] leading-5 text-slate-400">
        این محاسبه تقریبی است. برای اندازه‌گیری دقیق و مشاوره رایگان با پشتیبانی آنلاین در تماس باشید.
      </p>
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
