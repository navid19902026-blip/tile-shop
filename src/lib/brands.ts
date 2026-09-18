import { prisma } from "@/lib/prisma";

// `name` (fa) is the canonical value stored on Product.brand in the database;
// the other locales are display-only translations/transliterations.
export const FEATURED_BRANDS = [
  {
    name: "الوند",
    nameEn: "Alvand",
    nameAz: "Alvand",
    nameKa: "ალვანდი",
    description:
      "یکی از قدیمی‌ترین و معتبرترین تولیدکنندگان کاشی و سرامیک ایران با بیش از دو دهه سابقه، شناخته‌شده برای طراحی‌های متنوع و کیفیت پرسلان.",
    descriptionEn:
      "One of Iran's oldest and most trusted tile and ceramic manufacturers, with over two decades of experience, known for its diverse designs and porcelain quality.",
    descriptionAz:
      "İranın ən köhnə və etibarlı kafel və keramika istehsalçılarından biri, 20 ildən artıq təcrübə ilə, müxtəlif dizaynları və farfor keyfiyyəti ilə tanınır.",
    descriptionKa:
      "ერთ-ერთი ყველაზე ძველი და სანდო ირანული ფილისა და კერამიკის მწარმოებელი, ორ ათწლეულზე მეტი გამოცდილებით, ცნობილი მრავალფეროვანი დიზაინითა და ფაიფურის ხარისხით.",
  },
  {
    name: "تبریز",
    nameEn: "Tabriz",
    nameAz: "Təbriz",
    nameKa: "თბრიზი",
    description:
      "از قدیمی‌ترین و نامدارترین برندهای صنعت کاشی کشور، با سابقه صادراتی گسترده به کشورهای منطقه از جمله قفقاز.",
    descriptionEn:
      "One of the oldest and most renowned names in Iran's tile industry, with a long export history to regional markets including the Caucasus.",
    descriptionAz:
      "İranın kafel sənayesinin ən köhnə və məşhur brendlərindən biri, Qafqaz da daxil olmaqla regional bazarlara geniş ixracat təcrübəsi ilə.",
    descriptionKa:
      "ირანის ფილის ინდუსტრიის ერთ-ერთი ყველაზე ძველი და ცნობილი ბრენდი, კავკასიის ჩათვლით რეგიონულ ბაზრებზე ექსპორტის დიდი გამოცდილებით.",
  },
  {
    name: "مرجان",
    nameEn: "Marjan",
    nameAz: "Mərcan",
    nameKa: "მარჯანი",
    description:
      "شناخته‌شده در تولید کاشی بدنه قرمز، لعاب‌دار و ضداسید؛ گزینه‌ای محبوب برای پروژه‌های تجاری و پارکینگ.",
    descriptionEn:
      "Known for red-body, glazed, acid-resistant tiles — a popular choice for commercial projects and parking areas.",
    descriptionAz:
      "Qırmızı gövdəli, şirli, turşuya davamlı kafel istehsalı ilə tanınır; kommersiya layihələri və avtodayanacaqlar üçün məşhur seçim.",
    descriptionKa:
      "ცნობილია წითელი ტანის, მოჭიქული, მჟავმედეგი ფილებით — პოპულარული არჩევანი კომერციული პროექტებისა და პარკინგისთვის.",
  },
  {
    name: "پرسپولیس",
    nameEn: "Persepolis",
    nameAz: "Persepolis",
    nameKa: "ფერსეპოლისი",
    description: "تولیدکننده کاشی و سرامیک با طرح‌های فانتزی و مدرن، مناسب دکوراسیون امروزی خانه.",
    descriptionEn: "A tile and ceramic manufacturer with fantasy and modern designs, suited to contemporary home decor.",
    descriptionAz: "Fantastik və müasir dizaynlı kafel və keramika istehsalçısı, müasir ev dekoru üçün uyğundur.",
    descriptionKa: "ფილისა და კერამიკის მწარმოებელი ფანტასტიკური და თანამედროვე დიზაინებით, თანამედროვე სახლის დეკორისთვის.",
  },
  {
    name: "نیلو",
    nameEn: "Nilou",
    nameAz: "Nilu",
    nameKa: "ნილუ",
    description: "برند نیلوی کاشان، شناخته‌شده برای پرسلان‌های باکیفیت صادراتی و طرح‌های کلاسیک.",
    descriptionEn: "The Nilou brand of Kashan, known for high-quality export-grade porcelain and classic designs.",
    descriptionAz: "Kaşanın Nilu brendi, keyfiyyətli ixrac farforu və klassik dizaynları ilə tanınır.",
    descriptionKa: "ქაშანის ბრენდი ნილუ, ცნობილია მაღალი ხარისხის საექსპორტო ფაიფურითა და კლასიკური დიზაინებით.",
  },
  {
    name: "سینا",
    nameEn: "Sina",
    nameAz: "Sina",
    nameKa: "სინა",
    description: "شرکت کاشی و سرامیک سینا (سهامی عام)، از تولیدکنندگان قدیمی کاشی دیوار دوپخت با تنوع بالا در طرح و رنگ.",
    descriptionEn: "Sina Tile & Ceramic Co. (public), a long-established maker of twice-fired wall tile with a wide range of designs and colors.",
    descriptionAz: "Sina Kafel və Keramika Şirkəti (səhmdar), geniş dizayn və rəng çeşidinə malik ikiqat bişirilmiş divar kafelinin köhnə istehsalçılarından biri.",
    descriptionKa: "სინა ფილისა და კერამიკის კომპანია (საჯარო), ორმაგად გამომწვარი კედლის ფილის ერთ-ერთი დამკვიდრებული მწარმოებელი, ფართო დიზაინისა და ფერის არჩევანით.",
  },
  {
    name: "گلدیس",
    nameEn: "Goldis",
    nameAz: "Goldis",
    nameKa: "გოლდისი",
    description: "برندی خاص در طرح‌های مدرن و لوکس مانند کالکشن‌های آتن، آراگونیت و آریس، محبوب در پروژه‌های دکوراسیون امروزی.",
    descriptionEn: "A distinctive brand for modern, luxury designs such as the Athens, Aragonite and Aris collections, popular in contemporary decor projects.",
    descriptionAz: "Athens, Aragonite və Aris kolleksiyaları kimi müasir, lüks dizaynları ilə seçilən brend, müasir dekor layihələrində məşhurdur.",
    descriptionKa: "გამორჩეული ბრენდი თანამედროვე, ლუქს დიზაინებით, როგორიცაა კოლექციები Athens, Aragonite და Aris — პოპულარული თანამედროვე დეკორის პროექტებში.",
  },
  {
    name: "نوین‌سرام",
    nameEn: "Novin Ceram",
    nameAz: "Novin Ceram",
    nameKa: "ნოვინ სერამი",
    description: "تولیدکننده یزدی با ظرفیت تولید بالا، شناخته‌شده برای پرسلان‌های نانو پولیش بزرگ‌ابعاد.",
    descriptionEn: "A high-capacity manufacturer from Yazd, known for large-format nano-polished porcelain.",
    descriptionAz: "Yazddan yüksək istehsal gücünə malik istehsalçı, böyük ölçülü nano-cilalı farfor ilə tanınır.",
    descriptionKa: "მაღალი წარმადობის მწარმოებელი იაზდიდან, ცნობილია მსხვილფორმატიანი ნანო-გაპრიალებული ფაიფურით.",
  },
  {
    name: "پاسارگاد",
    nameEn: "Pasargad",
    nameAz: "Pasarqad",
    nameKa: "ფასარგადი",
    description: "مجموعه کاشی و سرامیک پاسارگاد آباده، با تمرکز ویژه بر صادرات به کشورهای حوزه خلیج فارس و اروپا.",
    descriptionEn: "The Pasargad Abadeh tile and ceramic group, with a strong focus on exports to the Persian Gulf region and Europe.",
    descriptionAz: "Pasarqad Abade kafel və keramika qrupu, İran körfəzi ölkələrinə və Avropaya ixracata xüsusi diqqət yetirir.",
    descriptionKa: "ფასარგად აბადეს ფილისა და კერამიკის ჯგუფი, განსაკუთრებული ყურადღებით სპარსეთის ყურის ქვეყნებსა და ევროპაში ექსპორტზე.",
  },
  {
    name: "تک‌سرام",
    nameEn: "Tak Ceram",
    nameAz: "Tak Ceram",
    nameKa: "თაქ სერამი",
    description: "تولیدکننده اصفهانی کاشی و سرامیک با تنوع بالا در طرح‌های کف و دیوار.",
    descriptionEn: "An Isfahan-based tile and ceramic manufacturer with a wide range of floor and wall designs.",
    descriptionAz: "İsfahanlı kafel və keramika istehsalçısı, döşəmə və divar dizaynlarında geniş çeşidi ilə.",
    descriptionKa: "ისპაჰანელი ფილისა და კერამიკის მწარმოებელი, იატაკისა და კედლის დიზაინების ფართო არჩევანით.",
  },
] as const;

const NAME_KEY: Record<string, "nameEn" | "nameAz" | "nameKa"> = {
  en: "nameEn",
  az: "nameAz",
  ka: "nameKa",
};

const DESCRIPTION_KEY: Record<string, "descriptionEn" | "descriptionAz" | "descriptionKa"> = {
  en: "descriptionEn",
  az: "descriptionAz",
  ka: "descriptionKa",
};

/** Localized brand display name; falls back to the Persian (DB) value. */
export function brandName(faName: string, locale: string): string {
  if (locale === "fa" || !NAME_KEY[locale]) return faName;
  const brand = FEATURED_BRANDS.find((b) => b.name === faName);
  return brand ? brand[NAME_KEY[locale]] : faName;
}

export async function getFeaturedBrandsWithStats(locale: string) {
  const names = FEATURED_BRANDS.map((b) => b.name);

  const products = await prisma.product.findMany({
    where: { brand: { in: names } },
    include: { images: { take: 1, orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return FEATURED_BRANDS.map((brand) => {
    const brandProducts = products.filter((p) => p.brand === brand.name);
    return {
      name: locale === "fa" ? brand.name : brand[NAME_KEY[locale]],
      description: locale === "fa" ? brand.description : brand[DESCRIPTION_KEY[locale]],
      productCount: brandProducts.length,
      sampleImage: brandProducts.find((p) => p.images[0])?.images[0]?.url ?? null,
      minPrice: brandProducts.length ? Math.min(...brandProducts.map((p) => p.price)) : null,
    };
  });
}
