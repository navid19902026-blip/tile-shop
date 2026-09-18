"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <ShoppingBag size={56} className="mb-4 text-slate-200" />
        <h1 className="mb-2 text-lg font-bold text-slate-800">{t("cart.empty")}</h1>
        <p className="mb-6 text-sm text-slate-400">{t("cart.emptyDesc")}</p>
        <Link href="/products" className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600">
          {t("cart.browseProducts")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">{t("cart.title")}</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
              </div>

              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-medium text-slate-800 hover:text-brand-600">
                  {item.name}
                </Link>
                <div className="mt-1 text-xs text-slate-400">
                  {formatPrice(item.price, locale)} / {t(`units.${item.unit}`)}
                </div>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200">
                <button
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  className="p-2 text-slate-500 hover:text-brand-600"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                <button
                  onClick={() => setQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                  className="p-2 text-slate-500 hover:text-brand-600"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="w-24 text-left text-sm font-bold text-slate-800">
                {formatPrice(item.price * item.quantity, locale)}
              </div>

              <button onClick={() => removeItem(item.productId)} className="text-slate-300 hover:text-red-500" aria-label={t("cart.remove")}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-slate-100 p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-800">{t("cart.orderSummary")}</h2>
          <div className="flex justify-between text-sm text-slate-500">
            <span>{t("cart.subtotal")}</span>
            <span className="font-medium text-slate-800">{formatPrice(totalPrice, locale)}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{t("cart.shippingNote")}</p>
          <Link
            href="/checkout"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600"
          >
            {t("cart.checkout")}
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
