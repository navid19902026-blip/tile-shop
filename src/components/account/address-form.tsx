"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { createAddress, type AddressFormState } from "@/actions/addresses";

const initialState: AddressFormState = {};

export default function AddressForm() {
  const t = useTranslations("account");
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(createAddress, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success(t("addressSaved"));
      setOpen(false);
    }
  }, [state, t]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-600"
      >
        <Plus size={16} />
        {t("addAddress")}
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-100 p-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">{t("newAddress")}</h3>
        <button type="button" onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("recipientName")} name="fullName" />
        <Field label={t("phoneNumber")} name="phone" />
        <Field label={t("province")} name="province" />
        <Field label={t("city")} name="city" />
        <Field label={t("postalCode")} name="postalCode" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">{t("fullAddress")}</label>
        <textarea name="addressLine" required rows={2} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-400" />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" name="isDefault" value="true" className="h-4 w-4 accent-brand-500" />
        {t("setAsDefault")}
      </label>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const t = useTranslations("account");
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">
      {pending ? t("saving") : t("saveAddress")}
    </button>
  );
}

function Field({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      <input name={name} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400" />
    </div>
  );
}
