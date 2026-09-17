import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayment } from "@/lib/zarinpal";
import { applyLoyaltyForOrder } from "@/lib/loyalty";

// GET /payment/callback?Authority=...&Status=OK|NOK — Zarinpal redirects here after checkout.
export async function GET(req: NextRequest) {
  const authority = req.nextUrl.searchParams.get("Authority");
  const status = req.nextUrl.searchParams.get("Status");

  const order = authority ? await prisma.order.findFirst({ where: { paymentAuthority: authority } }) : null;

  if (!order) {
    return NextResponse.redirect(new URL("/payment/result?status=error&message=سفارش+یافت+نشد", req.url));
  }

  if (order.paymentStatus === "PAID") {
    return NextResponse.redirect(new URL(`/payment/result?orderId=${order.id}&status=success`, req.url));
  }

  if (status !== "OK") {
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED", status: "CANCELED" } });
    return NextResponse.redirect(new URL(`/payment/result?orderId=${order.id}&status=canceled`, req.url));
  }

  const result = await verifyPayment({ amountToman: order.totalAmount, authority: order.paymentAuthority! });

  if (!result.ok) {
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
    return NextResponse.redirect(
      new URL(`/payment/result?orderId=${order.id}&status=error&message=${encodeURIComponent(result.message)}`, req.url)
    );
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "PAID", status: "PROCESSING", paymentRefId: String(result.refId) },
  });

  await applyLoyaltyForOrder(order.id);

  return NextResponse.redirect(new URL(`/payment/result?orderId=${order.id}&status=success`, req.url));
}
