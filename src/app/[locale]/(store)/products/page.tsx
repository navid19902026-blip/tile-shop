import { getTranslations } from "next-intl/server";
import { getFilteredProducts, getFilterOptions, type ProductFilters } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/product-card";
import ProductFiltersPanel from "@/components/store/product-filters";
import SortSelect from "@/components/store/sort-select";
import Pagination from "@/components/store/pagination";

export async function generateMetadata() {
  const t = await getTranslations("products");
  return { title: t("title") };
}

const KNOWN_CATEGORY_SLUGS = ["wall-tile", "floor-tile", "ceramic", "porcelain"];

type SearchParams = { [key: string]: string | string[] | undefined };

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const t = await getTranslations("products");
  const tCategories = await getTranslations("categories");

  const filters: ProductFilters = {
    q: typeof sp.q === "string" ? sp.q : undefined,
    category: typeof sp.category === "string" ? sp.category : undefined,
    brand: toArray(sp.brand),
    color: toArray(sp.color),
    size: toArray(sp.size),
    antiSlip: sp.antiSlip === "1",
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    sort: (sp.sort as ProductFilters["sort"]) ?? "newest",
    page: sp.page ? Number(sp.page) : 1,
  };

  const [result, options, category] = await Promise.all([
    getFilteredProducts(filters),
    getFilterOptions(filters.category),
    filters.category ? prisma.category.findUnique({ where: { slug: filters.category } }) : null,
  ]);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    Object.entries(sp).forEach(([key, value]) => {
      if (key === "page" || !value) return;
      toArray(value).forEach((v) => params.append(key, v));
    });
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  }

  const categoryLabel = category
    ? KNOWN_CATEGORY_SLUGS.includes(category.slug)
      ? tCategories(category.slug)
      : category.name
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-1 text-xl font-extrabold text-slate-900">
        {categoryLabel ?? (filters.q ? t("searchResultsFor", { query: filters.q }) : t("title"))}
      </h1>
      <p className="mb-6 text-sm text-slate-400">{t("resultsCount", { count: result.total })}</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <aside>
          <ProductFiltersPanel options={options} />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-end">
            <SortSelect />
          </div>

          {result.products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center text-sm text-slate-400">
              {t("noResults")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {result.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
