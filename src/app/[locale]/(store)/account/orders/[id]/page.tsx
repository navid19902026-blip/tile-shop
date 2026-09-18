import { notFound, redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatNumber, formatDate } from "@/lib/utils";
import { localizedName } from "@/lib/product-i18n";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { include: { product: { include: { images: { take: 1 } } } } }, address: true },
  });
  if (!order) notFound();

  const t = await getTranslations();
  const locale = await getLocale();
  const separator = locale === "fa" ? "، " : ", ";

  const steps = ["PENDING_PAYMENT", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div>
      <Link href="/account/orders" className="mb-4 inline-block text-xs text-slate-400 hover:text-brand-600">
        {t("account.backToOrders")}
      </Link>
      <h1 className="mb-1 text-lg font-extrabold text-slate-900">{t("account.orderNumber", { id: order.id.slice(-6) })}</h1>
      <p className="mb-6 text-xs text-slate-400">{t("account.orderedOn", { date: formatDate(order.createdAt, locale) })}</p>

      {order.status !== "CANCELED" && (
        <div className="mb-8 flex items-center">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i <= currentStep ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                {formatNumber(i + 1, locale)}
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < currentStep ? "bg-brand-500" : "bg-slate-100"}`} />}
            </div>
          ))}
        </div>
      )}
      <div className="mb-8 grid grid-cols-4 gap-1 text-center text-[11px] text-slate-400">
        {steps.map((s) => (
          <span key={s}>{t(`orderStatus.${s}`)}</span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 text-sm">
              <div>
                <div className="font-medium text-slate-800">{localizedName(item.product, locale)}</div>
                <div className="text-xs text-slate-400">
                  {formatNumber(item.quantity, locale)} × {formatPrice(item.unitPrice, locale)} ({t(`units.${item.product.unit}`)})
                </div>
              </div>
              <div className="font-bold text-slate-800">{formatPrice(item.totalPrice, locale)}</div>
            </div>
          ))}
        </div>

        <div className="h-fit space-y-3 rounded-2xl border border-slate-100 p-4 text-sm">
          <Row label={t("checkout.items")} value={formatPrice(order.subtotal, locale)} />
          {order.discountAmount > 0 && <Row label={t("checkout.discount")} value={`-${formatPrice(order.discountAmount, locale)}`} />}
          <Row label={t("checkout.shippingCost")} value={formatPrice(order.shippingCost, locale)} />
          <div className="border-t border-slate-100 pt-3">
            <Row label={t("account.finalAmount")} value={formatPrice(order.totalAmount, locale)} bold />
          </div>
          {order.pointsEarned > 0 && (
            <p className="text-xs text-emerald-600">{t("account.pointsEarnedNote", { points: formatNumber(order.pointsEarned, locale) })}</p>
          )}
          <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
            <div className="mb-1 font-bold text-slate-700">{t("account.shippingAddress")}</div>
            {order.address.fullName} — {[order.address.province, order.address.city].join(separator)}
            <br />
            {order.address.addressLine}
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
