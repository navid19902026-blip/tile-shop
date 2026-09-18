import Link from "next/link";
import { PackageSearch, MapPin, Award, User } from "lucide-react";

const NAV = [
  { href: "/account/orders", label: "سفارش‌های من", icon: PackageSearch },
  { href: "/account/addresses", label: "آدرس‌های من", icon: MapPin },
  { href: "/account/loyalty", label: "باشگاه مشتریان", icon: Award },
  { href: "/account/profile", label: "اطلاعات حساب", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <aside className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-600"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
