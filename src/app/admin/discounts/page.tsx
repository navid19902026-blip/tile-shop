import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/utils";
import DiscountForm from "@/components/admin/discount-form";
import DiscountToggle from "@/components/admin/discount-toggle";
import DeleteButton from "@/components/admin/delete-button";
import { deleteDiscountCode } from "@/actions/admin/discounts";

export default async function AdminDiscountsPage() {
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">کدهای تخفیف</h1>

      <div className="mb-6">
        <DiscountForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-right text-xs text-slate-400">
              <th className="p-3 font-medium">کد</th>
              <th className="p-3 font-medium">مقدار</th>
              <th className="p-3 font-medium">استفاده‌شده</th>
              <th className="p-3 font-medium">وضعیت</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="p-3 font-mono font-bold text-slate-700">{c.code}</td>
                <td className="p-3 text-slate-600">{c.type === "PERCENT" ? `${toPersianDigits(c.value)}٪` : formatToman(c.value)}</td>
                <td className="p-3 text-slate-500">
                  {toPersianDigits(c.usedCount)}{c.maxUses ? ` / ${toPersianDigits(c.maxUses)}` : ""}
                </td>
                <td className="p-3">
                  <DiscountToggle id={c.id} isActive={c.isActive} />
                </td>
                <td className="p-3">
                  <DeleteButton action={deleteDiscountCode.bind(null, c.id)} confirmMessage={`کد «${c.code}» حذف شود؟`} />
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">کد تخفیفی ثبت نشده است</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
