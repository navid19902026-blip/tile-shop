"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { registerUser, type RegisterFormState } from "@/actions/auth";

const initialState: RegisterFormState = {};

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(registerUser, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("ثبت‌نام با موفقیت انجام شد");
      const form = document.getElementById("register-form") as HTMLFormElement | null;
      const identifier = (form?.elements.namedItem("identifier") as HTMLInputElement)?.value;
      const password = (form?.elements.namedItem("password") as HTMLInputElement)?.value;
      if (identifier && password) {
        signIn("credentials", { identifier, password, redirect: false }).then(() => {
          router.push("/account/orders");
          router.refresh();
        });
      } else {
        router.push("/auth/login");
      }
    }
  }, [state, router]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
          <UserPlus size={22} />
        </span>
        <h1 className="text-xl font-extrabold text-slate-900">ساخت حساب کاربری</h1>
        <p className="mt-1 text-sm text-slate-400">برای خرید و پیگیری سفارش‌ها ثبت‌نام کنید</p>
      </div>

      <form id="register-form" action={formAction} className="space-y-4 rounded-2xl border border-slate-100 p-6">
        <Field label="نام و نام خانوادگی" name="name" type="text" />
        <Field label="شماره موبایل یا ایمیل" name="identifier" type="text" />
        <Field label="رمز عبور" name="password" type="password" />
        <SubmitButton />
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/auth/login" className="font-bold text-brand-600 hover:underline">
          وارد شوید
        </Link>
      </p>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
    >
      {pending ? "در حال ثبت‌نام..." : "ثبت‌نام"}
    </button>
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
