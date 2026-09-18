"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  province: z.string().min(2),
  city: z.string().min(2),
  postalCode: z.string().min(5),
  addressLine: z.string().min(5),
  isDefault: z.coerce.boolean().optional(),
});

export type AddressFormState = { error?: string; success?: boolean };

export async function createAddress(_prev: AddressFormState, formData: FormData): Promise<AddressFormState> {
  const t = await getTranslations("errors");
  const session = await auth();
  if (!session?.user) return { error: t("loginRequired") };

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: t("invalidInput") };

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  await prisma.address.create({ data: { ...parsed.data, userId: session.user.id } });
  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user) return;
  await prisma.address.deleteMany({ where: { id: addressId, userId: session.user.id } });
  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(addressId: string) {
  const session = await auth();
  if (!session?.user) return;
  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } }),
    prisma.address.updateMany({ where: { id: addressId, userId: session.user.id }, data: { isDefault: true } }),
  ]);
  revalidatePath("/account/addresses");
}
