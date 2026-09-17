import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import ClearCartOnSuccess from "@/components/store/clear-cart-on-success";

type SearchParams = { orderId?: string; status?: string; message?: string };

export default async function PaymentResultPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { orderId, status, message } = await searchParams;

  if (status === "success") {
    return (
      <Result
        icon={<CheckCircle2 size={56} className="text-emerald-500" />}
        title="پرداخت با موفقیت انجام شد"
        description="سفارش شما ثبت شد و در حال پردازش است."
        primary={orderId ? { href: `/account/orders/${orderId}`, label: "مشاهده سفارش" } : { href: "/account/orders", label: "سفارش‌های من" }}
      >
        <ClearCartOnSuccess />
      </Result>
    );
  }

  if (status === "canceled") {
    return (
      <Result
        icon={<XCircle size={56} className="text-red-500" />}
        title="پرداخت لغو شد"
        description="در صورت تمایل می‌توانید دوباره تلاش کنید."
        primary={orderId ? { href: `/payment/start?orderId=${orderId}`, label: "تلاش دوباره" } : { href: "/cart", label: "بازگشت به سبد خرید" }}
      />
    );
  }

  return (
    <Result
      icon={<AlertTriangle size={56} className="text-amber-500" />}
      title="خطا در پرداخت"
      description={message ?? "مشکلی در ارتباط با درگاه پرداخت رخ داد."}
      primary={orderId ? { href: `/payment/start?orderId=${orderId}`, label: "تلاش دوباره" } : { href: "/cart", label: "بازگشت به سبد خرید" }}
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
  primary: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {children}
      <div className="mb-4">{icon}</div>
      <h1 className="mb-2 text-lg font-extrabold text-slate-900">{title}</h1>
      <p className="mb-6 text-sm text-slate-500">{description}</p>
      <Link href={primary.href} className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600">
        {primary.label}
      </Link>
    </div>
  );
}
