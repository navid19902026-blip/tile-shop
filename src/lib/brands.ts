import { prisma } from "@/lib/prisma";

export const FEATURED_BRANDS = [
  {
    name: "الوند",
    description:
      "یکی از قدیمی‌ترین و معتبرترین تولیدکنندگان کاشی و سرامیک ایران با بیش از دو دهه سابقه، شناخته‌شده برای طراحی‌های متنوع و کیفیت پرسلان.",
  },
  {
    name: "تبریز",
    description:
      "از قدیمی‌ترین و نامدارترین برندهای صنعت کاشی کشور، با سابقه صادراتی گسترده به کشورهای منطقه از جمله قفقاز.",
  },
  {
    name: "مرجان",
    description:
      "شناخته‌شده در تولید کاشی بدنه قرمز، لعاب‌دار و ضداسید؛ گزینه‌ای محبوب برای پروژه‌های تجاری و پارکینگ.",
  },
  {
    name: "پرسپولیس",
    description: "تولیدکننده کاشی و سرامیک با طرح‌های فانتزی و مدرن، مناسب دکوراسیون امروزی خانه.",
  },
  {
    name: "نیلو",
    description: "برند نیلوی کاشان، شناخته‌شده برای پرسلان‌های باکیفیت صادراتی و طرح‌های کلاسیک.",
  },
  {
    name: "سینا",
    description: "شرکت کاشی و سرامیک سینا (سهامی عام)، از تولیدکنندگان قدیمی کاشی دیوار دوپخت با تنوع بالا در طرح و رنگ.",
  },
  {
    name: "گلدیس",
    description: "برندی خاص در طرح‌های مدرن و لوکس مانند کالکشن‌های آتن، آراگونیت و آریس، محبوب در پروژه‌های دکوراسیون امروزی.",
  },
  {
    name: "نوین‌سرام",
    description: "تولیدکننده یزدی با ظرفیت تولید بالا، شناخته‌شده برای پرسلان‌های نانو پولیش بزرگ‌ابعاد.",
  },
  {
    name: "پاسارگاد",
    description: "مجموعه کاشی و سرامیک پاسارگاد آباده، با تمرکز ویژه بر صادرات به کشورهای حوزه خلیج فارس و اروپا.",
  },
  {
    name: "تک‌سرام",
    description: "تولیدکننده اصفهانی کاشی و سرامیک با تنوع بالا در طرح‌های کف و دیوار.",
  },
] as const;

export async function getFeaturedBrandsWithStats() {
  const names = FEATURED_BRANDS.map((b) => b.name);

  const products = await prisma.product.findMany({
    where: { brand: { in: names } },
    include: { images: { take: 1, orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return FEATURED_BRANDS.map((brand) => {
    const brandProducts = products.filter((p) => p.brand === brand.name);
    return {
      ...brand,
      productCount: brandProducts.length,
      sampleImage: brandProducts.find((p) => p.images[0])?.images[0]?.url ?? null,
      minPrice: brandProducts.length ? Math.min(...brandProducts.map((p) => p.price)) : null,
    };
  });
}
