import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TIER_LABELS } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  return (
    <div>
      <h1 className="mb-6 text-lg font-extrabold text-slate-900">اطلاعات حساب</h1>
      <div className="max-w-md space-y-4 rounded-2xl border border-slate-100 p-5">
        <InfoRow label="نام و نام خانوادگی" value={user.name ?? "—"} />
        <InfoRow label="ایمیل" value={user.email ?? "—"} />
        <InfoRow label="شماره موبایل" value={user.phone ?? "—"} />
        <InfoRow label="سطح باشگاه مشتریان" value={TIER_LABELS[user.tier]} />
        <InfoRow label="تاریخ عضویت" value={new Date(user.createdAt).toLocaleDateString("fa-IR")} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-3 text-sm last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}
