import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { getFeaturedBrandsWithStats } from "@/lib/brands";
import { formatPrice, formatNumber, interpolate } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("brandsPage");
  return { title: t("title"), description: t("subtitle") };
}

export default async function BrandsPage() {
  const locale = await getLocale();
  const brands = await getFeaturedBrandsWithStats(locale);
  const t = await getTranslations("brandsPage");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-extrabold text-slate-900">{t("title")}</h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <div key={brand.name} className="overflow-hidden rounded-2xl border border-slate-100">
            <div className="relative aspect-[16/9] bg-slate-50">
              {brand.sampleImage ? (
                <Image src={brand.sampleImage} alt={brand.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">—</div>
              )}
            </div>
            <div className="p-5">
              <div className="mb-1 flex items-center gap-1.5">
                <BadgeCheck size={16} className="text-brand-500" />
                <h2 className="text-base font-extrabold text-slate-900">{brand.name}</h2>
              </div>
              <p className="mb-4 text-sm leading-7 text-slate-500">{brand.description}</p>

              <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span>{interpolate(t.raw("productsAvailable"), { count: formatNumber(brand.productCount, locale) })}</span>
                {brand.minPrice && <span>{t("from")} {formatPrice(brand.minPrice, locale)}</span>}
              </div>

              <Link
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
              >
                {interpolate(t.raw("viewProducts"), { brand: brand.name })}
                <ArrowLeft size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
