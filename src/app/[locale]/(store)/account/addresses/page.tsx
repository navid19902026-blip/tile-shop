import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddressForm from "@/components/account/address-form";
import AddressActions from "@/components/account/address-actions";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  const t = await getTranslations();
  const locale = await getLocale();
  const separator = locale === "fa" ? "، " : ", ";

  return (
    <div>
      <h1 className="mb-6 text-lg font-extrabold text-slate-900">{t("nav.myAddresses")}</h1>

      <div className="mb-6 space-y-3">
        {addresses.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
            <MapPin size={32} className="mb-2 text-slate-200" />
            {t("account.noAddresses")}
          </div>
        )}
        {addresses.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{a.fullName}</span>
                {a.isDefault && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">{t("account.default")}</span>}
              </div>
              <p className="mt-1 text-xs text-slate-500">{[a.province, a.city, a.addressLine].join(separator)}</p>
              <p className="mt-1 text-xs text-slate-400">
                {t("account.postalCode")}: {a.postalCode} | {t("account.contact")}: {a.phone}
              </p>
            </div>
            <AddressActions addressId={a.id} isDefault={a.isDefault} />
          </div>
        ))}
      </div>

      <AddressForm />
    </div>
  );
}
