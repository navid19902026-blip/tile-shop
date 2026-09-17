import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/actions/admin/products";
import ProductForm from "@/components/admin/product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">ویرایش محصول</h1>
      <div className="max-w-3xl rounded-2xl border border-slate-100 bg-white p-6">
        <ProductForm
          action={updateProduct.bind(null, id)}
          categories={categories}
          defaults={{
            name: product.name,
            categoryId: product.categoryId,
            description: product.description,
            brand: product.brand ?? undefined,
            size: product.size ?? undefined,
            color: product.color ?? undefined,
            material: product.material ?? undefined,
            usage: product.usage ?? undefined,
            antiSlip: product.antiSlip,
            price: product.price,
            unit: product.unit,
            stock: product.stock,
            isFeatured: product.isFeatured,
            isNew: product.isNew,
            images: product.images.map((i) => i.url),
          }}
        />
      </div>
    </div>
  );
}
