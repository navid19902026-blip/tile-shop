"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import ImageUploader from "./image-uploader";
import type { ProductFormState } from "@/actions/admin/products";

type Category = { id: string; name: string };

type ProductDefaults = {
  name?: string;
  categoryId?: string;
  description?: string;
  brand?: string;
  size?: string;
  color?: string;
  material?: string;
  usage?: string;
  antiSlip?: boolean;
  price?: number;
  unit?: string;
  stock?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  images?: string[];
};

const initialState: ProductFormState = {};

export default function ProductForm({
  action,
  categories,
  defaults,
  submitLabel = "ذخیره محصول",
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  defaults?: ProductDefaults;
  submitLabel?: string;
}) {
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="نام محصول" name="name" defaultValue={defaults?.name} required />
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">دسته‌بندی</label>
          <select name="categoryId" defaultValue={defaults?.categoryId} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400">
            <option value="">انتخاب کنید</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">توضیحات محصول</label>
        <textarea name="description" defaultValue={defaults?.description} required rows={4} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-400" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Field label="برند" name="brand" defaultValue={defaults?.brand} />
        <Field label="سایز (مثلاً 60x60)" name="size" defaultValue={defaults?.size} />
        <Field label="رنگ" name="color" defaultValue={defaults?.color} />
        <Field label="جنس" name="material" defaultValue={defaults?.material} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Field label="کاربرد (دیوار/کف)" name="usage" defaultValue={defaults?.usage} />
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">قیمت (تومان)</label>
          <input name="price" type="number" defaultValue={defaults?.price} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">واحد فروش</label>
          <select name="unit" defaultValue={defaults?.unit ?? "SQUARE_METER"} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400">
            <option value="SQUARE_METER">متر مربع</option>
            <option value="CARTON">کارتن</option>
            <option value="PIECE">عدد</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">موجودی</label>
          <input name="stock" type="number" defaultValue={defaults?.stock ?? 0} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        <Checkbox label="ضدلغزش" name="antiSlip" defaultChecked={defaults?.antiSlip} />
        <Checkbox label="محصول پرفروش" name="isFeatured" defaultChecked={defaults?.isFeatured} />
        <Checkbox label="محصول جدید" name="isNew" defaultChecked={defaults?.isNew} />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">تصاویر محصول</label>
        <ImageUploader name="images" initial={defaults?.images} />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">
      {pending ? "در حال ذخیره..." : label}
    </button>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      <input name={name} defaultValue={defaultValue} required={required} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
    </div>
  );
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <input type="checkbox" name={name} value="true" defaultChecked={defaultChecked} className="h-4 w-4 accent-brand-500" />
      {label}
    </label>
  );
}
