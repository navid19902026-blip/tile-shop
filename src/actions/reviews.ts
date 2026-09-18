"use server";

import { z } from "zod";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("errors");
  const session = await auth();
  if (!session?.user) {
    return { error: t("reviewLoginRequired") };
  }

  const parsed = schema.safeParse({
    productId: formData.get("productId"),
    productSlug: formData.get("productSlug"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });
  if (!parsed.success) {
    return { error: t("reviewInvalid") };
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
