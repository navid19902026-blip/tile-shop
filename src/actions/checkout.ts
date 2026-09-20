"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLoyaltySettings, pointsToToman, tierDiscountPercent } from "@/lib/loyalty";
import { formatPrice, interpolate } from "@/lib/utils";
import { localizedName } from "@/lib/product-i18n";

const SHIPPING_COST = 350_000;
const FREE_SHIPPING_THRESHOLD = 15_000_000;

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
});

const checkoutSchema = z.object({
  addressId: z.string(),
  shippingMethod: z.enum(["post", "peyk"]).default("post"),
  discountCode: z.string().optional(),
  usePoints: z.coerce.boolean().optional(),
  items: z.array(cartItemSchema).min(1),
});

export type CheckoutState = { error?: string; orderId?: string };

export async function placeOrder(input: z.infer<typeof checkoutSchema>): Promise<CheckoutState> {
  const t = await getTranslations("errors");
  const locale = await getLocale();
  const session = await auth();
  if (!session?.user) return { error: t("loginRequired") };

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { error: t("invalidOrderData") };
  const data = parsed.data;

  const address = await prisma.address.findFirst({ where: { id: data.addressId, userId: session.user.id } });
  if (!address) return { error: t("invalidAddress") };

  const products = await prisma.product.findMany({ where: { id: { in: data.items.map((i) => i.productId) } } });
  if (products.length !== data.items.length) return { error: t("productsNotFound") };

  for (const item of data.items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity)
      return { error: interpolate(t.raw("insufficientStock"), { product: localizedName(product, locale) }) };
  }

  const subtotal = data.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  const loyaltySettings = await getLoyaltySettings();
  const tierPercent = tierDiscountPercent(user.tier, loyaltySettings);
  let discountAmount = Math.round((subtotal * tierPercent) / 100);

  let discountCodeId: string | undefined;
  if (data.discountCode) {
    const code = await prisma.discountCode.findUnique({ where: { code: data.discountCode } });
    if (!code || !code.isActive || (code.expiresAt && code.expiresAt < new Date())) {
      return { error: t("invalidDiscountCode") };
    }
    if (code.maxUses && code.usedCount >= code.maxUses) return { error: t("discountCodeExhausted") };
    if (subtotal < code.minOrderAmount)
      return { error: interpolate(t.raw("minOrderForDiscount"), { amount: formatPrice(code.minOrderAmount, locale) }) };

    discountCodeId = code.id;
    discountAmount += code.type === "PERCENT" ? Math.round((subtotal * code.value) / 100) : code.value;
  }

  let pointsUsed = 0;
  if (data.usePoints && user.loyaltyPoints > 0) {
    pointsUsed = user.loyaltyPoints;
    discountAmount += pointsToToman(pointsUsed, loyaltySettings.pointValueInToman);
  }

  discountAmount = Math.min(discountAmount, subtotal);
  const shippingCost = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const totalAmount = subtotal - discountAmount + shippingCost;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: session.user.id,
        addressId: address.id,
        subtotal,
        discountAmount,
        shippingCost,
        totalAmount,
        pointsUsed,
        shippingMethod: data.shippingMethod,
        discountCodeId,
        items: {
          create: data.items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice: product.price,
              totalPrice: product.price * item.quantity,
            };
          }),
        },
      },
    });

    for (const item of data.items) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    }

    if (discountCodeId) {
      await tx.discountCode.update({ where: { id: discountCodeId }, data: { usedCount: { increment: 1 } } });
    }

    if (pointsUsed > 0) {
      await tx.user.update({ where: { id: session.user.id }, data: { loyaltyPoints: { decrement: pointsUsed } } });
      await tx.loyaltyTransaction.create({
        data: {
          userId: session.user.id,
          type: "REDEEM",
          points: pointsUsed,
          orderId: created.id,
        },
      });
    }

    return created;
  });

  return { orderId: order.id };
}

export async function placeOrderAndRedirect(input: z.infer<typeof checkoutSchema>) {
  const result = await placeOrder(input);
  if (result.orderId) {
    redirect(`/payment/start?orderId=${result.orderId}`);
  }
  return result;
}
