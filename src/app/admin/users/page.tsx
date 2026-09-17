import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/utils";
import UserTierSelect from "@/components/admin/user-tier-select";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">کاربران و باشگاه مشتریان</h1>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-right text-xs text-slate-400">
              <th className="p-3 font-medium">کاربر</th>
              <th className="p-3 font-medium">مجموع خرید</th>
              <th className="p-3 font-medium">امتیاز</th>
              <th className="p-3 font-medium">سطح</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="p-3">
                  <div className="font-medium text-slate-700">{u.name ?? "بدون نام"}</div>
                  <div className="text-xs text-slate-400">{u.phone ?? u.email}</div>
                </td>
                <td className="p-3 text-slate-600">{formatToman(u.totalPurchase)}</td>
                <td className="p-3 text-slate-600">{toPersianDigits(u.loyaltyPoints)}</td>
                <td className="p-3">
                  <UserTierSelect userId={u.id} tier={u.tier} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">کاربری ثبت نشده است</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
