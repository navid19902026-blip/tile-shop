import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, BadgePercent, Headset, Sparkles, Package, BadgeCheck, Globe2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getFeaturedProducts, getNewProducts } from "@/lib/products";
import { FEATURED_BRANDS } from "@/lib/brands";
import ProductCard from "@/components/store/product-card";
import CategoryCard from "@/components/store/category-card";
import HeroBanner, { type BannerSlide } from "@/components/store/hero-banner";
import { toPersianDigits } from "@/lib/utils";

const HERO_SLIDES: BannerSlide[] = [
  {
    id: "main",
    eyebrow: "ارسال به سراسر کشور و صادرات به قفقاز",
    title: "Parsian Ceram",
    description: "مرجع تخصصی خرید آنلاین انواع کاشی دیوار، کاشی کف، سرامیک و پرسلان با گارانتی اصالت کالا و مشاوره رایگان.",
    ctaLabel: "مشاهده محصولات",
    ctaHref: "/products",
    image: "/uploads/brands/alvand-1.jpg",
    gradient: "from-brand-600 to-brand-400",
  },
  {
    id: "brands",
    eyebrow: "نمایندگی رسمی",
    title: "۱۰ برند برتر کاشی و سرامیک ایران، زیر یک سقف",
    description: "الوند، تبریز، مرجان، پرسپولیس، نیلو، سینا، گلدیس، نوین‌سرام، پاسارگاد و تک‌سرام؛ تمام محصولات با ضمانت اصالت کالا.",
    ctaLabel: "مشاهده برندها",
    ctaHref: "/brands",
    image: "/uploads/brands/marjan-1.jpg",
    gradient: "from-slate-900 to-slate-700",
  },
  {
    id: "loyalty",
    eyebrow: "باشگاه مشتریان",
    title: "با هر خرید، امتیاز بگیرید و تخفیف ویژه دریافت کنید",
    description: "اعضای سطح طلایی باشگاه مشتریان تا ۷٪ تخفیف خودکار روی هر سفارش دریافت می‌کنند.",
    ctaLabel: "عضویت در باشگاه مشتریان",
    ctaHref: "/auth/register",
    image: "/uploads/brands/goldis-4.jpg",
    gradient: "from-emerald-700 to-teal-500",
  },
];

export default async function HomePage() {
  const [categories, featured, latest, productCount] = await Promise.all([
    prisma.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" }, take: 8 }),
    getFeaturedProducts(8),
    getNewProducts(8),
    prisma.product.count().catch(() => 0),
  ]);

  return (
    <div>
      <HeroBanner slides={HERO_SLIDES} />

      <div className="border-b border-slate-100 bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-4 sm:grid-cols-4 [&>*]:border-white/10">
          <StatItem icon={<BadgeCheck size={18} />} value={`+${toPersianDigits(FEATURED_BRANDS.length)}`} label="برند معتبر" />
          <StatItem icon={<Package size={18} />} value={`+${toPersianDigits(productCount)}`} label="محصول متنوع" />
          <StatItem icon={<Globe2 size={18} />} value="قفقاز" label="صادرات به" />
          <StatItem icon={<Sparkles size={18} />} value="۱۰۰٪" label="اصالت کالا" />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Feature icon={<ShieldCheck size={22} />} title="ضمانت اصالت کالا" desc="۱۰۰٪ اورجینال" />
          <Feature icon={<Truck size={22} />} title="ارسال سریع" desc="به سراسر کشور" />
          <Feature icon={<BadgePercent size={22} />} title="باشگاه مشتریان" desc="تخفیف و امتیاز" />
          <Feature icon={<Headset size={22} />} title="پشتیبانی آنلاین" desc="پاسخ‌گویی سریع" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-l from-slate-900 to-slate-700 p-6 text-center text-white sm:flex-row sm:text-right">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-500/90 px-3 py-1 text-xs font-bold">
              <Sparkles size={14} />
              جشنواره پاییزه
            </span>
            <h2 className="text-lg font-extrabold">نمایندگی رسمی ۱۰ برند برتر کاشی و سرامیک ایران، زیر یک سقف</h2>
            <p className="mt-1 text-sm text-white/70">با عضویت در باشگاه مشتریان، تا ۷٪ تخفیف ویژه روی خرید بعدی دریافت کنید.</p>
          </div>
          <Link
            href="/products"
            className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <SectionHeader title="دسته‌بندی محصولات" href="/products" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionHeader title={`برندهای معتبر (${toPersianDigits(FEATURED_BRANDS.length)} برند)`} href="/brands" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {FEATURED_BRANDS.map((b) => (
            <Link
              key={b.name}
              href={`/products?brand=${encodeURIComponent(b.name)}`}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 py-6 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-extrabold text-brand-600">
                {b.name[0]}
              </span>
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <SectionHeader title="محصولات پرفروش" href="/products?sort=popular" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <SectionHeader title="جدیدترین محصولات" href="/products?sort=newest" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {categories.length === 0 && featured.length === 0 && latest.length === 0 && (
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-400">
          هنوز محصولی ثبت نشده است. از پنل مدیریت محصولات را اضافه کنید.
        </div>
      )}
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-4 text-center">
      <span className="flex items-center gap-1.5 text-white/80">{icon}</span>
      <span className="text-lg font-extrabold text-white">{value}</span>
      <span className="text-[11px] text-white/70">{label}</span>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{icon}</span>
      <div>
        <div className="text-sm font-bold text-slate-800">{title}</div>
        <div className="text-xs text-slate-400">{desc}</div>
      </div>
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      <Link href={href} className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
        مشاهده همه
        <ArrowLeft size={14} />
      </Link>
    </div>
  );
}
