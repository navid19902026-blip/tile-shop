import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div>
      <h1 className="mb-6 text-lg font-extrabold text-slate-900">{t("nav.profile")}</h1>
      <div className="max-w-md space-y-4 rounded-2xl border border-slate-100 p-5">
        <InfoRow label={t("account.fullName")} value={user.name ?? "—"} />
        <InfoRow label={t("account.email")} value={user.email ?? "—"} />
        <InfoRow label={t("account.phone")} value={user.phone ?? "—"} />
        <InfoRow label={t("account.loyaltyTier")} value={t(`tiers.${user.tier}`)} />
        <InfoRow label={t("account.joinDate")} value={formatDate(user.createdAt, locale)} />
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
