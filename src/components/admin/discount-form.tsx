"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createDiscountCode, type DiscountFormState } from "@/actions/admin/discounts";

const initialState: DiscountFormState = {};

export default function DiscountForm() {
  const [state, formAction] = useFormState(createDiscountCode, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("کد تخفیف ثبت شد");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white p-5 md:grid-cols-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">کد</label>
        <input name="code" required placeholder="SUMMER20" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">نوع</label>
        <select name="type" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400">
          <option value="PERCENT">درصدی</option>
          <option value="FIXED">مبلغ ثابت</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">مقدار</label>
        <input name="value" type="number" required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">حداقل خرید</label>
        <input name="minOrderAmount" type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">سقف استفاده</label>
        <input name="maxUses" type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium text-slate-600">تاریخ انقضا (اختیاری)</label>
        <input name="expiresAt" type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
      </div>
      <div className="flex items-end md:col-span-1">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">
      {pending ? "..." : "افزودن"}
    </button>
  );
}
