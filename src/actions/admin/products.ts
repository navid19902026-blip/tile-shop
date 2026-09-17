"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string().min(1),
  description: z.string().min(10),
  brand: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  usage: z.string().optional(),
  antiSlip: z.coerce.boolean().optional(),
  price: z.coerce.number().int().positive(),
  unit: z.enum(["SQUARE_METER", "CARTON", "PIECE"]),
  stock: z.coerce.number().int().min(0),
  isFeatured: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
  images: z.array(z.string()).default([]),
});

export type ProductFormState = { error?: string };

async function uniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "product";
  let slug = base;
  let i = 1;
  while (await prisma.product.findFirst({ where: { slug, id: excludeId ? { not: excludeId } : undefined } })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    ...Object.fromEntries(formData),
    images: formData.getAll("images"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };

  const { images, ...data } = parsed.data;
  const slug = await uniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      images: { create: images.map((url, order) => ({ url, order })) },
    },
  });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(id: string, _prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    ...Object.fromEntries(formData),
    images: formData.getAll("images"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };

  const { images, ...data } = parsed.data;
  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });
  const slug = data.name !== existing.name ? await uniqueSlug(data.name, id) : existing.slug;

  await prisma.$transaction([
    prisma.product.update({ where: { id }, data: { ...data, slug } }),
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.productImage.createMany({ data: images.map((url, order) => ({ productId: id, url, order })) }),
  ]);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return {};
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
