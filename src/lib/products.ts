import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const productCardInclude = {
  images: { orderBy: { order: "asc" as const }, take: 1 },
  reviews: { select: { rating: true } },
};

export function withRatings<T extends { reviews: { rating: number }[] }>(product: T) {
  const reviewCount = product.reviews.length;
  const avgRating = reviewCount ? product.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : undefined;
  return { ...product, avgRating, reviewCount };
}

export async function getFeaturedProducts(take = 8) {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: productCardInclude,
    take,
    orderBy: { createdAt: "desc" },
  });
  return products.map(withRatings);
}

export async function getNewProducts(take = 8) {
  const products = await prisma.product.findMany({
    where: { isNew: true },
    include: productCardInclude,
    take,
    orderBy: { createdAt: "desc" },
  });
  return products.map(withRatings);
}

export type ProductFilters = {
  q?: string;
  category?: string;
  brand?: string[];
  color?: string[];
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  antiSlip?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  pageSize?: number;
};

export async function getFilteredProducts(filters: ProductFilters) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;

  const where: Prisma.ProductWhereInput = {
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: "insensitive" } },
            { description: { contains: filters.q, mode: "insensitive" } },
            { brand: { contains: filters.q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.brand?.length ? { brand: { in: filters.brand } } : {}),
    ...(filters.color?.length ? { color: { in: filters.color } } : {}),
    ...(filters.size?.length ? { size: { in: filters.size } } : {}),
    ...(filters.antiSlip ? { antiSlip: true } : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            ...(filters.minPrice ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price_asc"
      ? { price: "asc" }
      : filters.sort === "price_desc"
        ? { price: "desc" }
        : filters.sort === "popular"
          ? { reviews: { _count: "desc" } }
          : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productCardInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(withRatings),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product) return null;
  return withRatings(product);
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  const products = await prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: productCardInclude,
    take,
  });
  return products.map(withRatings);
}

export async function getFilterOptions(categorySlug?: string) {
  const where: Prisma.ProductWhereInput = categorySlug ? { category: { slug: categorySlug } } : {};
  const [brands, colors, sizes, priceAgg] = await Promise.all([
    prisma.product.findMany({ where, distinct: ["brand"], select: { brand: true } }),
    prisma.product.findMany({ where, distinct: ["color"], select: { color: true } }),
    prisma.product.findMany({ where, distinct: ["size"], select: { size: true } }),
    prisma.product.aggregate({ where, _min: { price: true }, _max: { price: true } }),
  ]);

  return {
    brands: brands.map((b) => b.brand).filter((b): b is string => !!b),
    colors: colors.map((c) => c.color).filter((c): c is string => !!c),
    sizes: sizes.map((s) => s.size).filter((s): s is string => !!s),
    minPrice: priceAgg._min.price ?? 0,
    maxPrice: priceAgg._max.price ?? 0,
  };
}
