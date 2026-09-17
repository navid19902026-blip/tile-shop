"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
    identifier: z.string().min(3, "ایمیل یا شماره موبایل را وارد کنید"),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  })
  .transform((data) => {
    const isEmail = data.identifier.includes("@");
    return {
      name: data.name,
      password: data.password,
      email: isEmail ? data.identifier : undefined,
      phone: !isEmail ? data.identifier : undefined,
    };
  });

export type RegisterFormState = { error?: string; success?: boolean };

export async function registerUser(_prev: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "اطلاعات وارد شده نامعتبر است" };
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [email ? { email } : undefined, phone ? { phone } : undefined].filter(Boolean) as never },
  });
  if (existing) {
    return { error: "کاربری با این مشخصات قبلاً ثبت‌نام کرده است" };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, phone, password: hashed },
  });

  return { success: true };
}
