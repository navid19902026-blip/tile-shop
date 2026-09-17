import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "@/actions/admin/categories";
import DeleteButton from "@/components/admin/delete-button";
import CategoryForm from "@/components/admin/category-form";
import { toPersianDigits } from "@/lib/utils";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } }, parent: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">دسته‌بندی‌ها</h1>

      <div className="mb-6">
        <CategoryForm categories={categories} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-right text-xs text-slate-400">
              <th className="p-3 font-medium">نام</th>
              <th className="p-3 font-medium">والد</th>
              <th className="p-3 font-medium">تعداد محصولات</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-slate-50">
                      {c.image && <Image src={c.image} alt="" fill sizes="36px" className="object-cover" />}
                    </div>
                    <span className="font-medium text-slate-700">{c.name}</span>
                  </div>
                </td>
                <td className="p-3 text-slate-500">{c.parent?.name ?? "—"}</td>
                <td className="p-3 text-slate-500">{toPersianDigits(c._count.products)}</td>
                <td className="p-3">
                  <DeleteButton action={deleteCategory.bind(null, c.id)} confirmMessage={`دسته‌بندی «${c.name}» حذف شود؟`} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">دسته‌بندی‌ای ثبت نشده است</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
