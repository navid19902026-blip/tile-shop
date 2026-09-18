import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const KNOWN_CATEGORY_SLUGS = ["wall-tile", "floor-tile", "ceramic", "porcelain"];

export default async function CategoryCard({
  category,
}: {
  category: { name: string; slug: string; image: string | null };
}) {
  const tCategories = await getTranslations("categories");
  const label = KNOWN_CATEGORY_SLUGS.includes(category.slug) ? tCategories(category.slug) : category.name;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl bg-slate-100"
    >
      {category.image ? (
        <Image
          src={category.image}
          alt={label}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-200 to-brand-400" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <span className="relative z-10 p-4 text-base font-bold text-white">{label}</span>
    </Link>
  );
}
