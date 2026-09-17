import { prisma } from "@/lib/prisma";
import { createProduct } from "@/actions/admin/products";
import ProductForm from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">افزودن محصول جدید</h1>
      <div className="max-w-3xl rounded-2xl border border-slate-100 bg-white p-6">
        <ProductForm action={createProduct} categories={categories} submitLabel="افزودن محصول" />
      </div>
    </div>
  );
}
