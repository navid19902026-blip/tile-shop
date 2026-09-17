"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const settingsSchema = z.object({
  pointsPerToman: z.coerce.number().int().positive(),
  pointValueInToman: z.coerce.number().int().positive(),
  silverThreshold: z.coerce.number().int().positive(),
  goldThreshold: z.coerce.number().int().positive(),
  bronzeDiscountPercent: z.coerce.number().int().min(0).max(100),
  silverDiscountPercent: z.coerce.number().int().min(0).max(100),
  goldDiscountPercent: z.coerce.number().int().min(0).max(100),
});

export type LoyaltySettingsFormState = { error?: string; success?: boolean };

export async function updateLoyaltySettings(_prev: LoyaltySettingsFormState, formData: FormData): Promise<LoyaltySettingsFormState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };

  await prisma.loyaltySettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...parsed.data },
    update: parsed.data,
  });

  revalidatePath("/admin/loyalty");
  return { success: true };
}
