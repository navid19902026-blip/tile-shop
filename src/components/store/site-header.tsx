import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import CartButton from "./cart-button";
import UserMenu from "./user-menu";
import SearchBar from "./search-bar";
import MobileNav from "./mobile-nav";
import LanguageSwitcher from "./language-switcher";

const KNOWN_CATEGORY_SLUGS = ["wall-tile", "floor-tile", "ceramic", "porcelain"];

export default async function SiteHeader() {
  const t = await getTranslations("nav");
  const tCategories = await getTranslations("categories");

  // A nav-category hiccup shouldn't take down every page on the site.
  const categories = await prisma.category
    .findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
      take: 8,
    })
    .catch(() => []);

  function categoryLabel(slug: string, fallback: string) {
    return KNOWN_CATEGORY_SLUGS.includes(slug) ? tCategories(slug) : fallback;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <MobileNav categories={categories} />

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg font-bold text-white">P</span>
          <span className="hidden text-lg font-bold text-slate-900 sm:inline">{t("brand")}</span>
        </Link>

        <SearchBar className="hidden flex-1 md:block" />

        <div className="mr-auto flex items-center gap-1 md:mr-0">
          <LanguageSwitcher />
          <UserMenu />
          <CartButton />
        </div>
      </div>

      <nav className="hidden border-t border-slate-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2.5 text-sm">
          <Link href="/products" className="font-medium text-slate-700 hover:text-brand-600">
            {t("allProducts")}
          </Link>
          <Link href="/brands" className="font-medium text-slate-700 hover:text-brand-600">
            {t("brands")}
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/products?category=${c.slug}`} className="text-slate-600 hover:text-brand-600">
              {categoryLabel(c.slug, c.name)}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-100 px-4 py-2.5 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
