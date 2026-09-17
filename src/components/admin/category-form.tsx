"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createCategory, type CategoryFormState } from "@/actions/admin/categories";
import ImageUploader from "./image-uploader";

const initialState: CategoryFormState = {};

export default function CategoryForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [state, formAction] = useFormState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("دسته‌بندی ثبت شد");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-5 md:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">نام دسته‌بندی</label>
        <input name="name" required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">دسته‌بندی والد (اختیاری)</label>
        <select name="parentId" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400">
          <option value="">— بدون والد —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium text-slate-600">توضیحات (اختیاری)</label>
        <textarea name="description" rows={2} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-400" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium text-slate-600">تصویر دسته‌بندی</label>
        <CategoryImageField />
      </div>
      <SubmitButton />
    </form>
  );
}

function CategoryImageField() {
  return <SingleImageUploader name="image" />;
}

function SingleImageUploader({ name }: { name: string }) {
  return <ImageUploader name={name} />;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-fit rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">
      {pending ? "در حال ثبت..." : "افزودن دسته‌بندی"}
    </button>
  );
}
