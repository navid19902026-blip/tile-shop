import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

for (const line of readFileSync(join(root, ".env"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, "");
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const [categories, products] = await Promise.all([
  prisma.category.findMany({ orderBy: { name: "asc" } }),
  prisma.product.findMany({
    include: { images: { orderBy: { order: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  }),
]);

const outDir = join(root, "mobile-app", "www", "data");
mkdirSync(outDir, { recursive: true });

const assetsDir = join(root, "mobile-app", "www", "images");
mkdirSync(assetsDir, { recursive: true });

const data = {
  categories: categories.map((c) => ({
    slug: c.slug,
    name: c.name,
  })),
  products: products.map((p) => {
    const images = p.images.map((img) => "images/" + img.url.split("/").pop());
    for (const img of p.images) {
      const filename = img.url.split("/").pop();
      const src = join(root, "public", "uploads", "brands", filename);
      const dest = join(assetsDir, filename);
      try {
        copyFileSync(src, dest);
      } catch {
        // image missing on disk, skip
      }
    }
    return {
      slug: p.slug,
      name: p.name,
      nameEn: p.nameEn,
      nameAz: p.nameAz,
      nameKa: p.nameKa,
      description: p.description,
      descriptionEn: p.descriptionEn,
      descriptionAz: p.descriptionAz,
      descriptionKa: p.descriptionKa,
      category: p.category.slug,
      brand: p.brand,
      size: p.size,
      color: p.color,
      material: p.material,
      usage: p.usage,
      antiSlip: p.antiSlip,
      price: p.price,
      unit: p.unit,
      images,
    };
  }),
};

writeFileSync(join(outDir, "catalog.json"), JSON.stringify(data, null, 2));

console.log(`Exported ${data.products.length} products, ${data.categories.length} categories.`);
console.log(`Copied images to ${assetsDir}`);
await prisma.$disconnect();
