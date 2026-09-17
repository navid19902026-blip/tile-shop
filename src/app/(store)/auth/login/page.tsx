"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await signIn("credentials", {
      identifier: formData.get("identifier"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      toast.error("شماره موبایل/ایمیل یا رمز عبور اشتباه است");
      return;
    }
    toast.success("خوش آمدید");
    router.push("/account/orders");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
          <LogIn size={22} />
        </span>
        <h1 className="text-xl font-extrabold text-slate-900">ورود به حساب کاربری</h1>
        <p className="mt-1 text-sm text-slate-400">با شماره موبایل یا ایمیل وارد شوید</p>
      </div>

      <form action={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 p-6">
        <Field label="شماره موبایل یا ایمیل" name="identifier" type="text" />
        <Field label="رمز عبور" name="password" type="password" />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        حساب کاربری ندارید؟{" "}
        <Link href="/auth/register" className="font-bold text-brand-600 hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      <input
        name={name}
        type={type}
        required
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
      />
    </div>
  );
}
