import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

export default async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="mt-16 border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg font-bold text-white">P</span>
            <span className="text-lg font-bold text-slate-900">{t("nav.brand")}</span>
          </div>
          <p className="text-sm leading-6 text-slate-500">{t("footer.description")}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/products" className="hover:text-brand-600">{t("nav.allProducts")}</Link></li>
            <li><Link href="/cart" className="hover:text-brand-600">{t("nav.cart")}</Link></li>
            <li><Link href="/account/orders" className="hover:text-brand-600">{t("footer.trackOrder")}</Link></li>
            <li><Link href="/account/loyalty" className="hover:text-brand-600">{t("nav.loyaltyClub")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">{t("footer.categories")}</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/products?category=wall-tile" className="hover:text-brand-600">{t("categories.wall-tile")}</Link></li>
            <li><Link href="/products?category=floor-tile" className="hover:text-brand-600">{t("categories.floor-tile")}</Link></li>
            <li><Link href="/products?category=ceramic" className="hover:text-brand-600">{t("categories.ceramic")}</Link></li>
            <li><Link href="/products?category=porcelain" className="hover:text-brand-600">{t("categories.porcelain")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">{t("footer.contact")}</h3>
          <ul className="space-y-2.5 text-sm text-slate-500">
            <li className="flex items-center gap-2"><Phone size={15} /> {t("footer.phone")}</li>
            <li className="flex items-center gap-2"><Mail size={15} /> info@parsianceram.example</li>
            <li className="flex items-center gap-2"><MapPin size={15} /> {t("footer.address")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {t("footer.rights")}
      </div>
    </footer>
  );
}
