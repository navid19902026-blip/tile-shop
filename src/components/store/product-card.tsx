import Image from "next/image";
import { Star } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { localizedName } from "@/lib/product-i18n";
import AddToCartButton from "./add-to-cart-button";

export type ProductCardData = {
  id: string;
  name: string;
  nameEn?: string | null;
  nameAz?: string | null;
  nameKa?: string | null;
  slug: string;
  price: number;
  unit: string;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  images: { url: string; alt: string | null }[];
  avgRating?: number;
  reviewCount?: number;
};

export default async function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const t = await getTranslations();
  const locale = await getLocale();
  const name = localizedName(product, locale);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-300">—</div>
        )}
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">{t("badges.new")}</span>
          )}
          {product.isFeatured && (
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white">{t("badges.featured")}</span>
          )}
          {product.stock <= 0 && (
            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[11px] font-bold text-white">{t("badges.outOfStock")}</span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-slate-800 hover:text-brand-600">
          {name}
        </Link>

        {typeof product.avgRating === "number" && product.reviewCount ? (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{product.avgRating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <div className="text-[13px] font-bold text-slate-900">{formatPrice(product.price, locale)}</div>
            <div className="text-[11px] text-slate-400">
              {t("product.perUnit")} {t(`units.${product.unit}`)}
            </div>
          </div>
          <AddToCartButton
            product={{
              productId: product.id,
              name,
              slug: product.slug,
              image: image?.url ?? null,
              price: product.price,
              unit: product.unit,
              stock: product.stock,
            }}
            compact
          />
        </div>
      </div>
    </div>
  );
}
