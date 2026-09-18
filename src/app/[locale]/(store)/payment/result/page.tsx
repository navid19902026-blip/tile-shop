import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import ClearCartOnSuccess from "@/components/store/clear-cart-on-success";

type SearchParams = { orderId?: string; status?: string; message?: string };

export default async function PaymentResultPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { orderId, status, message } = await searchParams;
  const t = await getTranslations("payment");

  if (status === "success") {
    return (
      <Result
        icon={<CheckCircle2 size={56} className="text-emerald-500" />}
        title={t("successTitle")}
        description={t("successDesc")}
        primary={orderId ? { href: `/account/orders/${orderId}`, label: t("viewOrder"), external: false } : { href: "/account/orders", label: t("viewOrder"), external: false }}
      >
        <ClearCartOnSuccess />
      </Result>
    );
  }

  if (status === "canceled") {
    return (
      <Result
        icon={<XCircle size={56} className="text-red-500" />}
        title={t("canceledTitle")}
        description={t("canceledDesc")}
        primary={orderId ? { href: `/payment/start?orderId=${orderId}`, label: t("retry"), external: true } : { href: "/cart", label: t("backToCart"), external: false }}
      />
    );
  }

  return (
    <Result
      icon={<AlertTriangle size={56} className="text-amber-500" />}
      title={t("errorTitle")}
      description={message ?? t("errorDesc")}
      primary={orderId ? { href: `/payment/start?orderId=${orderId}`, label: t("retry"), external: true } : { href: "/cart", label: t("backToCart"), external: false }}
    />
  );
}

function Result({
  icon,
  title,
  description,
  primary,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  primary: { href: string; label: string; external: boolean };
  children?: React.ReactNode;
}) {
  const buttonClass = "rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600";
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {children}
      <div className="mb-4">{icon}</div>
      <h1 className="mb-2 text-lg font-extrabold text-slate-900">{title}</h1>
      <p className="mb-6 text-sm text-slate-500">{description}</p>
      {primary.external ? (
        <NextLink href={primary.href} className={buttonClass}>
          {primary.label}
        </NextLink>
      ) : (
        <Link href={primary.href} className={buttonClass}>
          {primary.label}
        </Link>
      )}
    </div>
  );
}
