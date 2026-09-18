import { redirect } from "next/navigation";
import { Award, TrendingUp, Gift } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLoyaltySettings, tierDiscountPercent } from "@/lib/loyalty";
import { formatToman, TIER_LABELS, toPersianDigits } from "@/lib/utils";

const TIER_ORDER = ["BRONZE", "SILVER", "GOLD"] as const;

export default async function LoyaltyPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const [user, settings, transactions] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
    getLoyaltySettings(),
    prisma.loyaltyTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const tierPercent = tierDiscountPercent(user.tier, settings);
  const currentIndex = TIER_ORDER.indexOf(user.tier);
  const nextTier = TIER_ORDER[currentIndex + 1];
  const nextThreshold = nextTier === "SILVER" ? settings.silverThreshold : nextTier === "GOLD" ? settings.goldThreshold : null;
  const progress = nextThreshold ? Math.min(100, Math.round((user.totalPurchase / nextThreshold) * 100)) : 100;

  return (
    <div>
      <h1 className="mb-6 text-lg font-extrabold text-slate-900">باشگاه مشتریان</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={<Award size={20} />} label="سطح فعلی" value={TIER_LABELS[user.tier]} />
        <StatCard icon={<Gift size={20} />} label="امتیاز فعلی" value={`${toPersianDigits(user.loyaltyPoints)} امتیاز`} />
        <StatCard icon={<TrendingUp size={20} />} label="مجموع خرید" value={formatToman(user.totalPurchase)} />
      </div>

      <div className="mb-6 rounded-2xl border border-slate-100 p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-bold text-slate-800">
            {nextTier
              ? `تا سطح ${TIER_LABELS[nextTier]}`
              : "شما به بالاترین سطح رسیده‌اید"}
          </span>
          {nextThreshold && (
            <span className="text-slate-400">
              {formatToman(user.totalPurchase)} از {formatToman(nextThreshold)}
            </span>
          )}
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        {tierPercent > 0 && (
          <p className="mt-3 text-xs text-emerald-600">
            به‌عنوان مشتری {TIER_LABELS[user.tier]}، {toPersianDigits(tierPercent)}٪ تخفیف ویژه در هر خرید دریافت می‌کنید.
          </p>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50/40 p-4 text-sm text-slate-600">
        به ازای هر {formatToman(settings.pointsPerToman)} خرید، ۱ امتیاز دریافت می‌کنید. هر امتیاز معادل {formatToman(settings.pointValueInToman)}{" "}
        تخفیف است و می‌توانید در زمان تسویه‌حساب از آن استفاده کنید.
      </div>

      <h2 className="mb-3 text-sm font-bold text-slate-800">تاریخچه امتیازها</h2>
      <div className="space-y-2">
        {transactions.length === 0 && <p className="text-sm text-slate-400">هنوز تراکنش امتیازی ثبت نشده است.</p>}
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm">
            <div>
              <div className="text-slate-700">{tx.description ?? (tx.type === "EARN" ? "کسب امتیاز" : "مصرف امتیاز")}</div>
              <div className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString("fa-IR")}</div>
            </div>
            <div className={`font-bold ${tx.type === "EARN" ? "text-emerald-600" : "text-red-500"}`}>
              {tx.type === "EARN" ? "+" : "-"}
              {toPersianDigits(tx.points)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{icon}</div>
      <div className="text-base font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
