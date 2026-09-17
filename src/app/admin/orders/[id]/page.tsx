import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatToman, PRODUCT_UNIT_LABELS, toPersianDigits } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/order-status-select";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      address: true,
      user: true,
    },
  });
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 inline-block text-xs text-slate-400 hover:text-brand-600">← بازگشت به سفارش‌ها</Link>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-900">سفارش #{order.id.slice(-6)}</h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 text-sm">
              <div>
                <div className="font-medium text-slate-800">{item.product.name}</div>
                <div className="text-xs text-slate-400">
                  {toPersianDigits(item.quantity)} × {formatToman(item.unitPrice)} ({PRODUCT_UNIT_LABELS[item.product.unit]})
                </div>
              </div>
              <div className="font-bold text-slate-800">{formatToman(item.totalPrice)}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm">
            <h2 className="mb-2 text-sm font-bold text-slate-800">اطلاعات مشتری</h2>
            <p className="text-slate-600">{order.user.name ?? "—"}</p>
            <p className="text-slate-400">{order.user.phone ?? order.user.email}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm">
            <h2 className="mb-2 text-sm font-bold text-slate-800">آدرس ارسال</h2>
            <p className="text-slate-600">{order.address.fullName} — {order.address.phone}</p>
            <p className="text-slate-400">{order.address.province}، {order.address.city}، {order.address.addressLine}</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 text-sm">
            <Row label="جمع کالاها" value={formatToman(order.subtotal)} />
            {order.discountAmount > 0 && <Row label="تخفیف" value={`-${formatToman(order.discountAmount)}`} />}
            <Row label="هزینه ارسال" value={formatToman(order.shippingCost)} />
            <div className="border-t border-slate-100 pt-2">
              <Row label="مبلغ نهایی" value={formatToman(order.totalAmount)} bold />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-slate-900" : "text-slate-500"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
