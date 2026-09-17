import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLoyaltySettings, tierDiscountPercent } from "@/lib/loyalty";
import CheckoutClient from "@/components/store/checkout-client";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/checkout");

  const [addresses, user, loyaltySettings] = await Promise.all([
    prisma.address.findMany({ where: { userId: session.user.id }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] }),
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
    getLoyaltySettings(),
  ]);

  const tierPercent = tierDiscountPercent(user.tier, loyaltySettings);

  return (
    <CheckoutClient
      addresses={addresses}
      loyaltyPoints={user.loyaltyPoints}
      pointValueInToman={loyaltySettings.pointValueInToman}
      tierPercent={tierPercent}
      tier={user.tier}
    />
  );
}
