"use client";

import { useTransition } from "react";
import { toggleDiscountCode } from "@/actions/admin/discounts";

export default function DiscountToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => toggleDiscountCode(id, !isActive))}
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
    >
      {isActive ? "فعال" : "غیرفعال"}
    </button>
  );
}
