"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const addressSchema = z.object({
  fullName: z.string().min(2, "نام گیرنده را وارد کنید"),
  phone: z.string().min(10, "شماره تماس معتبر وارد کنید"),
  province: z.string().min(2, "استان را وارد کنید"),
  city: z.string().min(2, "شهر را وارد کنید"),
  postalCode: z.string().min(5, "کد پستی معتبر وارد کنید"),
  addressLine: z.string().min(5, "آدرس کامل را وارد کنید"),
  isDefault: z.coerce.boolean().optional(),
});

export type AddressFormState = { error?: string; success?: boolean };

export async function createAddress(_prev: AddressFormState, formData: FormData): Promise<AddressFormState> {
  const session = await auth();
  if (!session?.user) return { error: "ابتدا وارد حساب کاربری خود شوید" };

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };

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
