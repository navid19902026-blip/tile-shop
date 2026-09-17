import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatToman, ORDER_STATUS_LABELS, toPersianDigits } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-lg font-extrabold text-slate-900">سفارش‌های من</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400">
          <PackageSearch size={32} className="mb-2 text-slate-200" />
          هنوز سفارشی ثبت نکرده‌اید
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:border-brand-200"
            >
              <div>
                <div className="text-sm font-bold text-slate-800">سفارش #{o.id.slice(-6)}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {toPersianDigits(o.items.length)} قلم کالا · {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800">{formatToman(o.totalAmount)}</div>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-50 text-amber-600",
    PROCESSING: "bg-blue-50 text-blue-600",
    SHIPPED: "bg-indigo-50 text-indigo-600",
    DELIVERED: "bg-emerald-50 text-emerald-600",
    CANCELED: "bg-red-50 text-red-600",
  };
  return (
    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${colors[status] ?? "bg-slate-50 text-slate-500"}`}>
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}
