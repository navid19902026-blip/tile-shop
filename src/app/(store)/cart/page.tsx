"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatToman, PRODUCT_UNIT_LABELS } from "@/lib/utils";

export default function CartPage() {
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
        <h1 className="mb-2 text-lg font-bold text-slate-800">سبد خرید شما خالی است</h1>
        <p className="mb-6 text-sm text-slate-400">محصولات مورد نظر خود را به سبد خرید اضافه کنید.</p>
        <Link href="/products" className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">سبد خرید</h1>

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
                  {formatToman(item.price)} / {PRODUCT_UNIT_LABELS[item.unit] ?? item.unit}
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
                {formatToman(item.price * item.quantity)}
              </div>

              <button onClick={() => removeItem(item.productId)} className="text-slate-300 hover:text-red-500" aria-label="حذف">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-slate-100 p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-800">خلاصه سفارش</h2>
          <div className="flex justify-between text-sm text-slate-500">
            <span>جمع کل</span>
            <span className="font-medium text-slate-800">{formatToman(totalPrice)}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">هزینه ارسال در مرحله بعد محاسبه می‌شود</p>
          <Link
            href="/checkout"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600"
          >
            ادامه فرآیند خرید
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
