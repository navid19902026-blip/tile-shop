import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  MessageCircle,
  Award,
  ArrowRight,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/users", label: "کاربران و باشگاه مشتریان", icon: Users },
  { href: "/admin/loyalty", label: "تنظیمات باشگاه مشتریان", icon: Award },
  { href: "/admin/discounts", label: "کدهای تخفیف", icon: Tag },
  { href: "/admin/chats", label: "گفتگوهای پشتیبانی", icon: MessageCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 border-l border-slate-100 bg-white md:block">
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">آ</span>
          <span className="text-sm font-bold text-slate-800">پنل مدیریت</span>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-600"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-4 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-50"
          >
            <ArrowRight size={17} />
            بازگشت به سایت
          </Link>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-5 md:hidden">
          <span className="text-sm font-bold text-slate-800">پنل مدیریت</span>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
