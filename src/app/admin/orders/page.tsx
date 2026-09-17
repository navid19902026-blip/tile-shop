import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatToman, ORDER_STATUS_LABELS } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/order-status-select";
import type { OrderStatus } from "@prisma/client";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as OrderStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, phone: true, email: true } } },
  });

  const statuses: OrderStatus[] = ["PENDING_PAYMENT", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"];

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">سفارش‌ها</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterLink label="همه" active={!status} href="/admin/orders" />
        {statuses.map((s) => (
          <FilterLink key={s} label={ORDER_STATUS_LABELS[s]} active={status === s} href={`/admin/orders?status=${s}`} />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-right text-xs text-slate-400">
              <th className="p-3 font-medium">شناسه</th>
              <th className="p-3 font-medium">مشتری</th>
              <th className="p-3 font-medium">مبلغ</th>
              <th className="p-3 font-medium">پرداخت</th>
              <th className="p-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-slate-50 last:border-0">
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-brand-600 hover:underline">
                    #{o.id.slice(-6)}
                  </Link>
                </td>
                <td className="p-3 text-slate-600">{o.user.name ?? o.user.phone ?? o.user.email}</td>
                <td className="p-3 text-slate-700">{formatToman(o.totalAmount)}</td>
                <td className="p-3 text-slate-500">{o.paymentStatus === "PAID" ? "پرداخت‌شده" : o.paymentStatus === "FAILED" ? "ناموفق" : "پرداخت‌نشده"}</td>
                <td className="p-3">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">سفارشی یافت نشد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterLink({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
        active ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </Link>
  );
}
