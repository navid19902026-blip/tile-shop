import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { FEATURED_BRANDS, brandName, brandFaFromEn } from "@/lib/brands";
import { localizedName, colorName, colorFaFromEn } from "@/lib/product-i18n";
import { formatPrice } from "@/lib/utils";
import { getLoyaltySettings } from "@/lib/loyalty";

export const CATEGORY_SLUGS = ["wall-tile", "floor-tile", "ceramic", "porcelain"] as const;

export type ProductSearchParams = {
  category?: string;
  brand?: string; // English brand name
  color?: string; // English color name
  minPriceToman?: number;
  maxPriceToman?: number;
  query?: string;
  limit?: number;
};

/** Used by the AI chat assistant's `search_products` tool. Never invents data — only returns real DB rows. */
export async function searchProductsForChat(params: ProductSearchParams, locale: string) {
  const brandFa = params.brand ? brandFaFromEn(params.brand) : undefined;
  const colorFa = params.color ? colorFaFromEn(params.color) : undefined;

  const where: Prisma.ProductWhereInput = {
    ...(params.category && (CATEGORY_SLUGS as readonly string[]).includes(params.category)
      ? { category: { slug: params.category } }
      : {}),
    ...(brandFa ? { brand: brandFa } : {}),
    ...(colorFa ? { color: colorFa } : {}),
    ...(params.minPriceToman || params.maxPriceToman
      ? {
          price: {
            ...(params.minPriceToman ? { gte: params.minPriceToman } : {}),
            ...(params.maxPriceToman ? { lte: params.maxPriceToman } : {}),
          },
        }
      : {}),
    ...(params.query
      ? {
          OR: [
            { name: { contains: params.query, mode: "insensitive" } },
            { nameEn: { contains: params.query, mode: "insensitive" } },
            { nameAz: { contains: params.query, mode: "insensitive" } },
            { nameKa: { contains: params.query, mode: "insensitive" } },
            { description: { contains: params.query, mode: "insensitive" } },
            { descriptionEn: { contains: params.query, mode: "insensitive" } },
            { descriptionAz: { contains: params.query, mode: "insensitive" } },
            { descriptionKa: { contains: params.query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const products = await prisma.product.findMany({
    where,
    take: Math.min(Math.max(params.limit ?? 5, 1), 8),
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return products.map((p) => ({
    name: localizedName(p, locale),
    brand: p.brand ? brandName(p.brand, locale) : null,
    price: formatPrice(p.price, locale),
    size: p.size,
    color: p.color ? colorName(p.color, locale) : null,
    inStock: p.stock > 0,
    url: `/products/${p.slug}`,
  }));
}

/** Live store facts (categories, price ranges, loyalty settings) for grounding the AI chat assistant. */
export async function getCatalogSummary() {
  const [categories, loyalty, productCount] = await Promise.all([
    prisma.category.findMany({
      where: { slug: { in: CATEGORY_SLUGS as unknown as string[] } },
      include: { products: { select: { price: true } } },
    }),
    getLoyaltySettings(),
    prisma.product.count(),
  ]);

  return {
    productCount,
    categories: categories.map((c) => ({
      slug: c.slug,
      count: c.products.length,
      minPrice: c.products.length ? Math.min(...c.products.map((p) => p.price)) : null,
      maxPrice: c.products.length ? Math.max(...c.products.map((p) => p.price)) : null,
    })),
    loyalty,
    brands: FEATURED_BRANDS.map((b) => b.nameEn),
  };
}
