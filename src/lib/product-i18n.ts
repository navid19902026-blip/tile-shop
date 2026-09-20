// Localization helpers for dynamic (database-backed) product content.
// `fa` fields are canonical; the other locales fall back to Persian when a
// translation is missing.

export type NameTranslatable = {
  name: string;
  nameEn?: string | null;
  nameAz?: string | null;
  nameKa?: string | null;
};

export type DescriptionTranslatable = {
  description: string;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  descriptionKa?: string | null;
};

export function localizedName(item: NameTranslatable, locale: string): string {
  if (locale === "en") return item.nameEn || item.name;
  if (locale === "az") return item.nameAz || item.name;
  if (locale === "ka") return item.nameKa || item.name;
  return item.name;
}

export function localizedDescription(item: DescriptionTranslatable, locale: string): string {
  if (locale === "en") return item.descriptionEn || item.description;
  if (locale === "az") return item.descriptionAz || item.description;
  if (locale === "ka") return item.descriptionKa || item.description;
  return item.description;
}

type Glossary = Record<string, { en: string; az: string; ka: string }>;

const COLOR_LABELS: Glossary = {
  "سفید": { en: "White", az: "Ağ", ka: "თეთრი" },
  "بژ": { en: "Beige", az: "Bej", ka: "ბეჟი" },
  "بژ روشن": { en: "Light Beige", az: "Açıq bej", ka: "ღია ბეჟი" },
  "طوسی": { en: "Gray", az: "Boz", ka: "ნაცრისფერი" },
  "طوسی تیره": { en: "Dark Gray", az: "Tünd boz", ka: "მუქი ნაცრისფერი" },
  "طوسی روشن": { en: "Light Gray", az: "Açıq boz", ka: "ღია ნაცრისფერი" },
  "خاکستری روشن": { en: "Light Gray", az: "Açıq boz", ka: "ღია ნაცრისფერი" },
  "مشکی": { en: "Black", az: "Qara", ka: "შავი" },
  "سفید و مشکی": { en: "Black & White", az: "Ağ-qara", ka: "შავ-თეთრი" },
  "قرمز": { en: "Red", az: "Qırmızı", ka: "წითელი" },
  "کرم": { en: "Cream", az: "Krem", ka: "კრემისფერი" },
  "کرم طلایی": { en: "Golden Cream", az: "Qızılı krem", ka: "ოქროსფერი კრემი" },
  "آبی": { en: "Blue", az: "Mavi", ka: "ლურჯი" },
  "صورتی روشن": { en: "Light Pink", az: "Açıq çəhrayı", ka: "ღია ვარდისფერი" },
  "قهوه‌ای": { en: "Brown", az: "Qəhvəyi", ka: "ყავისფერი" },
  "قهوه‌ای روشن": { en: "Light Brown", az: "Açıq qəhvəyi", ka: "ღია ყავისფერი" },
  "قهوه‌ای تیره": { en: "Dark Brown", az: "Tünd qəhvəyi", ka: "მუქი ყავისფერი" },
  "چندرنگ": { en: "Multicolor", az: "Rəngbərəng", ka: "მრავალფეროვანი" },
  "نقره‌ای": { en: "Silver", az: "Gümüşü", ka: "ვერცხლისფერი" },
  "سبز": { en: "Green", az: "Yaşıl", ka: "მწვანე" },
  "استخوانی": { en: "Bone", az: "Sümük rəngi", ka: "ძვლისფერი" },
  "طلایی": { en: "Gold", az: "Qızılı", ka: "ოქროსფერი" },
};

const MATERIAL_LABELS: Glossary = {
  "سرامیک": { en: "Ceramic", az: "Keramika", ka: "კერამიკა" },
  "پرسلان": { en: "Porcelain", az: "Farfor", ka: "ფაიფური" },
};

const USAGE_LABELS: Glossary = {
  "دیوار": { en: "Wall", az: "Divar", ka: "კედელი" },
  "کف": { en: "Floor", az: "Döşəmə", ka: "იატაკი" },
  "کف و دیوار": { en: "Floor & Wall", az: "Döşəmə və divar", ka: "იატაკი და კედელი" },
};

function lookup(map: Glossary, value: string | null | undefined, locale: string): string {
  if (!value) return "";
  if (locale === "fa") return value;
  const entry = map[value];
  if (!entry) return value;
  return entry[locale as "en" | "az" | "ka"] ?? value;
}

export const colorName = (value: string | null | undefined, locale: string) => lookup(COLOR_LABELS, value, locale);
export const materialName = (value: string | null | undefined, locale: string) => lookup(MATERIAL_LABELS, value, locale);
export const usageName = (value: string | null | undefined, locale: string) => lookup(USAGE_LABELS, value, locale);

// English color name -> the (first matching) Persian DB value. Used by the
// AI chat assistant's product-search tool, which only knows English labels.
const COLOR_EN_TO_FA: Record<string, string> = {};
for (const [fa, { en }] of Object.entries(COLOR_LABELS)) {
  COLOR_EN_TO_FA[en] ??= fa;
}
export const COLOR_EN_VALUES = Array.from(new Set(Object.values(COLOR_LABELS).map((v) => v.en)));
export const colorFaFromEn = (en: string): string | undefined => COLOR_EN_TO_FA[en];
