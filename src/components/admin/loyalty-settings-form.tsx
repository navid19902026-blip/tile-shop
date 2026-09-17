"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { updateLoyaltySettings, type LoyaltySettingsFormState } from "@/actions/admin/loyalty";
import type { LoyaltySettings } from "@prisma/client";

const initialState: LoyaltySettingsFormState = {};

export default function LoyaltySettingsForm({ settings }: { settings: LoyaltySettings }) {
  const [state, formAction] = useFormState(updateLoyaltySettings, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success("تنظیمات باشگاه مشتریان به‌روزرسانی شد");
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6">
      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-800">نرخ امتیازدهی</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="به ازای هر چند تومان خرید، ۱ امتیاز" name="pointsPerToman" defaultValue={settings.pointsPerToman} />
          <Field label="ارزش هر امتیاز هنگام تبدیل به تخفیف (تومان)" name="pointValueInToman" defaultValue={settings.pointValueInToman} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-800">آستانه سطوح مشتریان (بر اساس مجموع خرید)</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="آستانه سطح نقره‌ای (تومان)" name="silverThreshold" defaultValue={settings.silverThreshold} />
          <Field label="آستانه سطح طلایی (تومان)" name="goldThreshold" defaultValue={settings.goldThreshold} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-800">درصد تخفیف هر سطح</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="برنزی (٪)" name="bronzeDiscountPercent" defaultValue={settings.bronzeDiscountPercent} />
          <Field label="نقره‌ای (٪)" name="silverDiscountPercent" defaultValue={settings.silverDiscountPercent} />
          <Field label="طلایی (٪)" name="goldDiscountPercent" defaultValue={settings.goldDiscountPercent} />
        </div>
      </section>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">
      {pending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
    </button>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: number }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      <input name={name} type="number" defaultValue={defaultValue} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
    </div>
  );
}
