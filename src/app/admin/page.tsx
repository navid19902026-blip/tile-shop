import { ShoppingBag, Wallet, Users, Award } from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-stats";
import { formatToman, ORDER_STATUS_LABELS, toPersianDigits } from "@/lib/utils";
import SalesChart from "@/components/admin/sales-chart";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">داشبورد</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<ShoppingBag size={20} />} label="تعداد سفارش‌ها" value={toPersianDigits(stats.orderCount)} />
        <StatCard icon={<Wallet size={20} />} label="فروش کل (پرداخت‌شده)" value={formatToman(stats.totalSales)} />
        <StatCard icon={<Users size={20} />} label="کاربران" value={toPersianDigits(stats.userCount)} />
        <StatCard icon={<Award size={20} />} label="اعضای فعال باشگاه مشتریان" value={toPersianDigits(stats.activeLoyaltyUsers)} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <h2 className="mb-2 text-sm font-bold text-slate-800">فروش ۱۴ روز اخیر</h2>
          <SalesChart data={stats.salesChart} />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-800">پرفروش‌ترین محصولات</h2>
          {stats.bestSellers.length === 0 ? (
            <p className="text-sm text-slate-400">هنوز داده‌ای موجود نیست</p>
          ) : (
            <div className="space-y-3">
              {stats.bestSellers.map((b, i) => (
                <div key={b.name + i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{b.name}</span>
                  <span className="font-bold text-slate-800">{toPersianDigits(b.quantity)} عدد</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">آخرین سفارش‌ها</h2>
          <Link href="/admin/orders" className="text-xs font-medium text-brand-600 hover:underline">مشاهده همه</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-slate-400">هنوز سفارشی ثبت نشده است</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-right text-xs text-slate-400">
                  <th className="pb-2 font-medium">مشتری</th>
                  <th className="pb-2 font-medium">مبلغ</th>
                  <th className="pb-2 font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 text-slate-700">{o.user.name ?? o.user.phone ?? o.user.email}</td>
                    <td className="py-2.5 text-slate-700">{formatToman(o.totalAmount)}</td>
                    <td className="py-2.5 text-slate-500">{ORDER_STATUS_LABELS[o.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{icon}</div>
      <div className="text-lg font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
