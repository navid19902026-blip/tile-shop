"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const schema = z.object({
  productId: z.string(),
  productSlug: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type ReviewFormState = { error?: string; success?: boolean };

export async function submitReview(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "برای ثبت نظر ابتدا وارد حساب کاربری خود شوید." };
  }

  const parsed = schema.safeParse({
    productId: formData.get("productId"),
    productSlug: formData.get("productSlug"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });
  if (!parsed.success) {
    return { error: "لطفاً امتیاز و نظر خود را به‌درستی وارد کنید." };
  }

  await prisma.review.create({
    data: {
      productId: parsed.data.productId,
      userId: session.user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  revalidatePath(`/products/${parsed.data.productSlug}`);
  return { success: true };
}
