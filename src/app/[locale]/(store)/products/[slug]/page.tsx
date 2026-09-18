import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Star, Truck, ShieldCheck } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { formatPrice, formatNumber } from "@/lib/utils";
import ProductGallery from "@/components/store/product-gallery";
import AddToCartButton from "@/components/store/add-to-cart-button";
import ProductCard from "@/components/store/product-card";
import ReviewForm from "@/components/store/review-form";
import CoverageCalculator from "@/components/store/coverage-calculator";

const KNOWN_CATEGORY_SLUGS = ["wall-tile", "floor-tile", "ceramic", "porcelain"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 150),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const t = await getTranslations();
  const locale = await getLocale();

  const categoryLabel = KNOWN_CATEGORY_SLUGS.includes(product.category.slug)
    ? t(`categories.${product.category.slug}`)
    : product.category.name;

  const specs: { label: string; value: string }[] = [
    product.brand ? { label: t("product.brand"), value: product.brand } : null,
    product.size ? { label: t("product.size"), value: product.size } : null,
    product.color ? { label: t("product.color"), value: product.color } : null,
    product.material ? { label: t("product.material"), value: product.material } : null,
    product.usage ? { label: t("product.usage"), value: product.usage } : null,
    { label: t("product.antiSlip"), value: product.antiSlip ? t("product.yes") : t("product.no") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="text-sm text-brand-600">{categoryLabel}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{product.name}</h1>

          {product.reviewCount ? (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.avgRating?.toFixed(1)}</span>
              <span>({t("product.reviewsCount", { count: formatNumber(product.reviewCount, locale) })})</span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-400">{t("product.noRatingYet")}</p>
          )}

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="text-2xl font-extrabold text-slate-900">{formatPrice(product.price, locale)}</div>
            <div className="text-xs text-slate-400">
              {t("product.perUnit")} {t(`units.${product.unit}`)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {product.stock > 0
                ? `${t("product.stock")}: ${formatNumber(product.stock, locale)} ${t(`units.${product.unit}`)}`
                : t("product.outOfStock")}
            </div>
          </div>

          <div className="mt-4">
            <AddToCartButton
              product={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0]?.url ?? null,
                price: product.price,
                unit: product.unit,
                stock: product.stock,
              }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2"><Truck size={15} /> {t("product.shipping")}</div>
            <div className="flex items-center gap-2"><ShieldCheck size={15} /> {t("product.authenticity")}</div>
          </div>

          {specs.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-bold text-slate-800">{t("product.specs")}</h2>
              <dl className="grid grid-cols-2 gap-y-2 rounded-2xl border border-slate-100 p-4 text-sm">
                {specs.map((s) => (
                  <div key={s.label} className="contents">
                    <dt className="text-slate-400">{s.label}</dt>
                    <dd className="font-medium text-slate-700">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-6">
            <CoverageCalculator
              product={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0]?.url ?? null,
                price: product.price,
                unit: product.unit,
                stock: product.stock,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-extrabold text-slate-900">{t("product.description")}</h2>
        <p className="whitespace-pre-line text-sm leading-8 text-slate-600">{product.description}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-3 text-lg font-extrabold text-slate-900">
            {t("product.reviews")} ({formatNumber(product.reviewCount, locale)})
          </h2>
          <div className="space-y-3">
            {product.reviews.length === 0 && <p className="text-sm text-slate-400">{t("product.noReviews")}</p>}
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{r.user.name ?? t("product.anonymousUser")}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-slate-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">{t("product.newReview")}</h3>
          <ReviewForm productId={product.id} productSlug={product.slug} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-extrabold text-slate-900">{t("product.relatedProducts")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
