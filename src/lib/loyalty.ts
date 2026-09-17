import { prisma } from "@/lib/prisma";
import type { LoyaltyTierLevel } from "@prisma/client";

export async function getLoyaltySettings() {
  const settings = await prisma.loyaltySettings.findUnique({ where: { id: "default" } });
  if (settings) return settings;
  return prisma.loyaltySettings.create({ data: { id: "default" } });
}

export function tierForTotalPurchase(
  totalPurchase: number,
  settings: { silverThreshold: number; goldThreshold: number }
): LoyaltyTierLevel {
  if (totalPurchase >= settings.goldThreshold) return "GOLD";
  if (totalPurchase >= settings.silverThreshold) return "SILVER";
  return "BRONZE";
}

export function tierDiscountPercent(
  tier: LoyaltyTierLevel,
  settings: { bronzeDiscountPercent: number; silverDiscountPercent: number; goldDiscountPercent: number }
) {
  if (tier === "GOLD") return settings.goldDiscountPercent;
  if (tier === "SILVER") return settings.silverDiscountPercent;
  return settings.bronzeDiscountPercent;
}

/** Points earned for a given spend amount, per loyalty settings (1 point per `pointsPerToman` toman spent). */
export function calculatePointsEarned(amountToman: number, pointsPerToman: number) {
  if (pointsPerToman <= 0) return 0;
  return Math.floor(amountToman / pointsPerToman);
}

export function pointsToToman(points: number, pointValueInToman: number) {
  return points * pointValueInToman;
}

/**
 * Applies a completed order's effect on a user's loyalty state:
 * bumps totalPurchase/tier and records an EARN transaction for points.
 * Called after payment is verified (see lib/zarinpal verify flow).
 */
export async function applyLoyaltyForOrder(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  const settings = await getLoyaltySettings();

  const user = await prisma.user.update({
    where: { id: order.userId },
    data: { totalPurchase: { increment: order.totalAmount } },
  });

  const newTier = tierForTotalPurchase(user.totalPurchase, settings);
  const pointsEarned = calculatePointsEarned(order.totalAmount, settings.pointsPerToman);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { tier: newTier, loyaltyPoints: { increment: pointsEarned } },
    }),
    prisma.order.update({ where: { id: order.id }, data: { pointsEarned } }),
    prisma.loyaltyTransaction.create({
      data: {
        userId: user.id,
        type: "EARN",
        points: pointsEarned,
        orderId: order.id,
        description: `امتیاز کسب‌شده بابت سفارش #${order.id.slice(-6)}`,
      },
    }),
  ]);
}
