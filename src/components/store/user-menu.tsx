"use client";

import { useSession, signOut } from "next-auth/react";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu } from "@headlessui/react";
import { User, LogOut, PackageSearch, MapPin, Award, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations("nav");

  if (status === "loading") {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />;
  }

  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-600"
      >
        <User size={18} />
        <span className="hidden sm:inline">{t("login")}</span>
      </Link>
    );
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-1 rounded-full px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-600">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          {session.user?.name?.[0] ?? <User size={16} />}
        </span>
        <ChevronDown size={14} className="hidden sm:block" />
      </Menu.Button>
      <Menu.Items className="absolute left-0 z-50 mt-2 w-56 origin-top-left rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg focus:outline-none">
        <div className="px-3 py-2 text-sm font-semibold text-slate-800">
          {session.user?.name || session.user?.email}
        </div>
        <MenuLink href="/account/orders" icon={<PackageSearch size={16} />} label={t("myOrders")} />
        <MenuLink href="/account/addresses" icon={<MapPin size={16} />} label={t("myAddresses")} />
        <MenuLink href="/account/loyalty" icon={<Award size={16} />} label={t("loyaltyClub")} />
        {session.user?.role === "ADMIN" && (
          <Menu.Item>
            <NextLink href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600">
              <User size={16} />
              {t("adminPanel")}
            </NextLink>
          </Menu.Item>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          {t("logout")}
        </button>
      </Menu.Items>
    </Menu>
  );
}

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Menu.Item>
      <Link href={href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600">
        {icon}
        {label}
      </Link>
    </Menu.Item>
  );
}
