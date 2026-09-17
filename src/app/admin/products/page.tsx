import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/utils";
import { deleteProduct } from "@/actions/admin/products";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const products = await prisma.product.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-900">محصولات</h1>
        <Link href="/admin/products/new" className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-600">
          <Plus size={16} />
          محصول جدید
        </Link>
      </div>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="جستجوی محصول..."
          className="w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-right text-xs text-slate-400">
              <th className="p-3 font-medium">محصول</th>
              <th className="p-3 font-medium">دسته‌بندی</th>
              <th className="p-3 font-medium">قیمت</th>
              <th className="p-3 font-medium">موجودی</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-50">
                      {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="40px" className="object-cover" />}
                    </div>
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-slate-700 hover:text-brand-600">
                      {p.name}
                    </Link>
                  </div>
                </td>
                <td className="p-3 text-slate-500">{p.category.name}</td>
                <td className="p-3 text-slate-700">{formatToman(p.price)}</td>
                <td className="p-3 text-slate-500">{toPersianDigits(p.stock)}</td>
                <td className="p-3">
                  <DeleteButton action={deleteProduct.bind(null, p.id)} confirmMessage={`محصول «${p.name}» حذف شود؟`} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">محصولی یافت نشد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
