import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg font-bold text-white">P</span>
            <span className="text-lg font-bold text-slate-900">Parsian Ceram</span>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            عرضه‌کننده انواع کاشی دیوار، کاشی کف، سرامیک و پرسلان با کیفیت برتر و ارسال به سراسر کشور.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">دسترسی سریع</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/products" className="hover:text-brand-600">همه محصولات</Link></li>
            <li><Link href="/cart" className="hover:text-brand-600">سبد خرید</Link></li>
            <li><Link href="/account/orders" className="hover:text-brand-600">پیگیری سفارش</Link></li>
            <li><Link href="/account/loyalty" className="hover:text-brand-600">باشگاه مشتریان</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">دسته‌بندی محصولات</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/products?category=wall-tile" className="hover:text-brand-600">کاشی دیوار</Link></li>
            <li><Link href="/products?category=floor-tile" className="hover:text-brand-600">کاشی کف</Link></li>
            <li><Link href="/products?category=ceramic" className="hover:text-brand-600">سرامیک</Link></li>
            <li><Link href="/products?category=porcelain" className="hover:text-brand-600">پرسلان</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">تماس با ما</h3>
          <ul className="space-y-2.5 text-sm text-slate-500">
            <li className="flex items-center gap-2"><Phone size={15} /> ۰۲۱-۱۲۳۴۵۶۷۸</li>
            <li className="flex items-center gap-2"><Mail size={15} /> info@parsianceram.example</li>
            <li className="flex items-center gap-2"><MapPin size={15} /> تهران، خیابان کاشی‌سازان، پلاک ۱</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} تمامی حقوق برای فروشگاه Parsian Ceram محفوظ است.
      </div>
    </footer>
  );
}
