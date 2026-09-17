"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const discountSchema = z.object({
  code: z.string().min(3).transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().int().positive(),
  minOrderAmount: z.coerce.number().int().min(0).optional(),
  maxUses: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().optional(),
});

export type DiscountFormState = { error?: string; success?: boolean };

export async function createDiscountCode(_prev: DiscountFormState, formData: FormData): Promise<DiscountFormState> {
  await requireAdmin();
  const parsed = discountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };

  const exists = await prisma.discountCode.findUnique({ where: { code: parsed.data.code } });
  if (exists) return { error: "این کد تخفیف قبلاً ثبت شده است" };

  await prisma.discountCode.create({
    data: {
      code: parsed.data.code,
      type: parsed.data.type,
      value: parsed.data.value,
      minOrderAmount: parsed.data.minOrderAmount ?? 0,
      maxUses: parsed.data.maxUses,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    },
  });
  revalidatePath("/admin/discounts");
  return { success: true };
}

export async function toggleDiscountCode(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.discountCode.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/discounts");
}

export async function deleteDiscountCode(id: string) {
  await requireAdmin();
  await prisma.discountCode.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/discounts");
}
