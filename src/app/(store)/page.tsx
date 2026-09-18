import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, BadgePercent, Headset } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getFeaturedProducts, getNewProducts } from "@/lib/products";
import { FEATURED_BRANDS } from "@/lib/brands";
import ProductCard from "@/components/store/product-card";
import CategoryCard from "@/components/store/category-card";

export default async function HomePage() {
  const [categories, featured, latest] = await Promise.all([
    prisma.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" }, take: 8 }),
    getFeaturedProducts(8),
    getNewProducts(8),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-l from-brand-600 to-brand-400 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              ارسال به سراسر کشور
            </span>
            <h1 className="text-3xl font-extrabold leading-relaxed md:text-4xl">
              کاشی و سرامیک آرمانی
              <br />
              زیبایی و دوام، برای خانه‌ی شما
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/90">
              مرجع تخصصی خرید آنلاین انواع کاشی دیوار، کاشی کف، سرامیک و پرسلان با گارانتی اصالت کالا و مشاوره رایگان.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-600 transition hover:bg-brand-50"
            >
              مشاهده محصولات
              <ArrowLeft size={16} />
            </Link>
          </div>
          <div className="hidden justify-self-end md:block">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-36 w-36 rounded-2xl bg-white/10 backdrop-blur" />
              <div className="mt-6 h-36 w-36 rounded-2xl bg-white/10 backdrop-blur" />
              <div className="h-36 w-36 rounded-2xl bg-white/10 backdrop-blur" />
              <div className="mt-6 h-36 w-36 rounded-2xl bg-white/10 backdrop-blur" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Feature icon={<ShieldCheck size={22} />} title="ضمانت اصالت کالا" desc="۱۰۰٪ اورجینال" />
          <Feature icon={<Truck size={22} />} title="ارسال سریع" desc="به سراسر کشور" />
          <Feature icon={<BadgePercent size={22} />} title="باشگاه مشتریان" desc="تخفیف و امتیاز" />
          <Feature icon={<Headset size={22} />} title="پشتیبانی آنلاین" desc="پاسخ‌گویی سریع" />
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
        <SectionHeader title="برندهای معتبر" href="/brands" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {FEATURED_BRANDS.map((b) => (
            <Link
              key={b.name}
              href={`/products?brand=${encodeURIComponent(b.name)}`}
              className="flex items-center justify-center rounded-2xl border border-slate-100 py-6 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-600"
            >
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
