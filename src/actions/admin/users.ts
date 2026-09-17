"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import type { LoyaltyTierLevel, Role } from "@prisma/client";

export async function updateUserRole(userId: string, role: Role) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function updateUserTier(userId: string, tier: LoyaltyTierLevel) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { tier } });
  revalidatePath("/admin/users");
}

export async function adjustUserPoints(userId: string, points: number, description: string) {
  await requireAdmin();
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { loyaltyPoints: { increment: points } } }),
    prisma.loyaltyTransaction.create({
      data: { userId, type: points >= 0 ? "EARN" : "REDEEM", points: Math.abs(points), description },
    }),
  ]);
  revalidatePath("/admin/users");
}
