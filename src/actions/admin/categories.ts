"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

export type CategoryFormState = { error?: string; success?: boolean };

export async function createCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };

  const slug = slugify(parsed.data.name);
  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) return { error: "دسته‌بندی با این نام قبلاً ثبت شده است" };

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description || undefined,
      image: parsed.data.image || undefined,
      parentId: parsed.data.parentId || undefined,
    },
  });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/categories");
}
