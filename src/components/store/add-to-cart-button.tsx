"use client";

import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function AddToCartButton({
  product,
  compact = false,
}: {
  product: Omit<CartItem, "quantity">;
  compact?: boolean;
}) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const [qty, setQty] = useState(1);

  const inCart = items.find((i) => i.productId === product.productId);
  const outOfStock = product.stock <= 0;

  if (compact) {
    return (
      <button
        disabled={outOfStock}
        onClick={() => {
          addItem(product, 1);
          toast.success(t("addedToCart"));
        }}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600",
          outOfStock && "cursor-not-allowed bg-slate-200 text-slate-400 hover:bg-slate-200"
        )}
        aria-label={t("addToCart")}
      >
        <ShoppingCart size={15} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {!outOfStock && (
        <div className="flex items-center rounded-xl border border-slate-200">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 text-slate-500 hover:text-brand-600">
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="p-2.5 text-slate-500 hover:text-brand-600"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
      <button
        disabled={outOfStock}
        onClick={() => {
          if (inCart) {
            setQuantity(product.productId, inCart.quantity + qty);
          } else {
            addItem(product, qty);
          }
          toast.success(t("addedToCart"));
        }}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600",
          outOfStock && "cursor-not-allowed bg-slate-200 text-slate-400 hover:bg-slate-200"
        )}
      >
        <ShoppingCart size={18} />
        {outOfStock ? t("outOfStock") : t("addToCart")}
      </button>
    </div>
  );
}
