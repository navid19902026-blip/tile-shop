import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";

export async function getDashboardStats() {
  const [orderCount, totalSalesAgg, userCount, activeLoyaltyUsers, bestSellers, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { totalAmount: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { loyaltyPoints: { gt: 0 } } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { name: true, email: true, phone: true } } },
    }),
  ]);

  const products = await prisma.product.findMany({
    where: { id: { in: bestSellers.map((b) => b.productId) } },
    select: { id: true, name: true },
  });

  const bestSellersWithNames = bestSellers.map((b) => ({
    name: products.find((p) => p.id === b.productId)?.name ?? "—",
    quantity: b._sum.quantity ?? 0,
  }));

  const since = subDays(new Date(), 13);
  const recentPaidOrders = await prisma.order.findMany({
    where: { paymentStatus: "PAID", createdAt: { gte: since } },
    select: { totalAmount: true, createdAt: true },
  });

  const salesByDay = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const key = format(startOfDay(subDays(new Date(), i)), "MM/dd");
    salesByDay.set(key, 0);
  }
  for (const order of recentPaidOrders) {
    const key = format(startOfDay(order.createdAt), "MM/dd");
    salesByDay.set(key, (salesByDay.get(key) ?? 0) + order.totalAmount);
  }

  return {
    orderCount,
    totalSales: totalSalesAgg._sum.totalAmount ?? 0,
    userCount,
    activeLoyaltyUsers,
    bestSellers: bestSellersWithNames,
    recentOrders,
    salesChart: Array.from(salesByDay.entries()).map(([date, amount]) => ({ date, amount })),
  };
}
