import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requestPayment } from "@/lib/zarinpal";

// GET /payment/start?orderId=... — initiates a Zarinpal payment for a pending order and redirects to the gateway.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.redirect(new URL("/account/orders", req.url));
  }

  const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } });
  if (!order) {
    return NextResponse.redirect(new URL("/account/orders", req.url));
  }

  if (order.paymentStatus === "PAID") {
    return NextResponse.redirect(new URL(`/account/orders/${order.id}`, req.url));
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
  const result = await requestPayment({
    amountToman: order.totalAmount,
    description: `پرداخت سفارش #${order.id.slice(-6)} - کاشی و سرامیک آرمانی`,
    callbackUrl: `${baseUrl}/payment/callback`,
    email: session.user.email ?? undefined,
  });

  if (!result.ok) {
    return NextResponse.redirect(new URL(`/payment/result?orderId=${order.id}&status=error&message=${encodeURIComponent(result.message)}`, req.url));
  }

  await prisma.order.update({ where: { id: order.id }, data: { paymentAuthority: result.authority } });

  return NextResponse.redirect(result.paymentUrl);
}
