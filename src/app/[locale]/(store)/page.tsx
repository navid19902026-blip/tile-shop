import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ShieldCheck, Truck, BadgePercent, Headset, Sparkles, Package, BadgeCheck, Globe2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getFeaturedProducts, getNewProducts } from "@/lib/products";
import { FEATURED_BRANDS, brandName } from "@/lib/brands";
import ProductCard from "@/components/store/product-card";
import CategoryCard from "@/components/store/category-card";
import HeroBanner, { type BannerSlide } from "@/components/store/hero-banner";
import { formatNumber } from "@/lib/utils";

export default async function HomePage() {
  const t = await getTranslations();
  const locale = await getLocale();

  const [categories, featured, latest, productCount] = await Promise.all([
    prisma.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" }, take: 8 }),
    getFeaturedProducts(8),
    getNewProducts(8),
    prisma.product.count().catch(() => 0),
  ]);

  const HERO_SLIDES: BannerSlide[] = [
    {
      id: "main",
      eyebrow: t("home.hero.mainEyebrow"),
      title: t("home.hero.mainTitle"),
      description: t("home.hero.mainDescription"),
      ctaLabel: t("home.hero.mainCta"),
      ctaHref: "/products",
      image: "/uploads/brands/alvand-1.jpg",
      gradient: "from-brand-600 to-brand-400",
    },
    {
      id: "brands",
      eyebrow: t("home.hero.brandsEyebrow"),
      title: t("home.hero.brandsTitle"),
      description: t("home.hero.brandsDescription"),
      ctaLabel: t("home.hero.brandsCta"),
      ctaHref: "/brands",
      image: "/uploads/brands/marjan-1.jpg",
      gradient: "from-slate-900 to-slate-700",
    },
    {
      id: "loyalty",
      eyebrow: t("home.hero.loyaltyEyebrow"),
      title: t("home.hero.loyaltyTitle"),
      description: t("home.hero.loyaltyDescription"),
      ctaLabel: t("home.hero.loyaltyCta"),
      ctaHref: "/auth/register",
      image: "/uploads/brands/goldis-4.jpg",
      gradient: "from-emerald-700 to-teal-500",
    },
  ];

  return (
    <div>
      <HeroBanner slides={HERO_SLIDES} />

      <div className="border-b border-slate-100 bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-4 sm:grid-cols-4 [&>*]:border-white/10">
          <StatItem icon={<BadgeCheck size={18} />} value={`+${formatNumber(FEATURED_BRANDS.length, locale)}`} label={t("home.stats.brands")} />
          <StatItem icon={<Package size={18} />} value={`+${formatNumber(productCount, locale)}`} label={t("home.stats.products")} />
          <StatItem icon={<Globe2 size={18} />} value={t("home.stats.exportRegion")} label={t("home.stats.exportTo")} />
          <StatItem icon={<Sparkles size={18} />} value={locale === "fa" ? "۱۰۰٪" : "100%"} label={t("home.stats.authenticity")} />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Feature icon={<ShieldCheck size={22} />} title={t("home.features.authenticity")} desc={t("home.features.authenticityDesc")} />
          <Feature icon={<Truck size={22} />} title={t("home.features.shipping")} desc={t("home.features.shippingDesc")} />
          <Feature icon={<BadgePercent size={22} />} title={t("home.features.loyalty")} desc={t("home.features.loyaltyDesc")} />
          <Feature icon={<Headset size={22} />} title={t("home.features.support")} desc={t("home.features.supportDesc")} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-l from-slate-900 to-slate-700 p-6 text-center text-white sm:flex-row sm:text-right">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-500/90 px-3 py-1 text-xs font-bold">
              <Sparkles size={14} />
              {t("home.promo.badge")}
            </span>
            <h2 className="text-lg font-extrabold">{t("home.promo.title")}</h2>
            <p className="mt-1 text-sm text-white/70">{t("home.promo.description")}</p>
          </div>
          <Link
            href="/products"
            className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
          >
            {t("home.promo.cta")}
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <SectionHeader title={t("home.categoriesTitle")} href="/products" viewAllLabel={t("home.viewAll")} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionHeader
          title={`${t("home.brandsTitle")} (${formatNumber(FEATURED_BRANDS.length, locale)})`}
          href="/brands"
          viewAllLabel={t("home.viewAll")}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {FEATURED_BRANDS.map((b) => {
            const label = brandName(b.name, locale);
            return (
              <Link
                key={b.name}
                href={`/products?brand=${encodeURIComponent(b.name)}`}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 py-6 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-600"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-extrabold text-brand-600">
                  {label[0]}
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <SectionHeader title={t("home.featuredTitle")} href="/products?sort=popular" viewAllLabel={t("home.viewAll")} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <SectionHeader title={t("home.newestTitle")} href="/products?sort=newest" viewAllLabel={t("home.viewAll")} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {categories.length === 0 && featured.length === 0 && latest.length === 0 && (
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-400">{t("home.emptyState")}</div>
      )}
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-4 text-center">
      <span className="flex items-center gap-1.5 text-white/80">{icon}</span>
      <span className="text-lg font-extrabold text-white">{value}</span>
      <span className="text-[11px] text-white/70">{label}</span>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{icon}</span>
      <div>
        <div className="text-sm font-bold text-slate-800">{title}</div>
        <div className="text-xs text-slate-400">{desc}</div>
      </div>
    </div>
  );
}

function SectionHeader({ title, href, viewAllLabel }: { title: string; href: string; viewAllLabel: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      <Link href={href} className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
        {viewAllLabel}
        <ArrowLeft size={14} />
      </Link>
    </div>
  );
}
