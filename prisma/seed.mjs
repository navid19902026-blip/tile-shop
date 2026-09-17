// Seed sample data: categories, products, test users (with loyalty points), a discount code.
// Run with: npx prisma db seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function img(seed) {
  return `https://picsum.photos/seed/${seed}/900/900`;
}

async function main() {
  await prisma.loyaltySettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });

  const categories = await Promise.all(
    [
      { name: "کاشی دیوار", slug: "wall-tile", description: "انواع کاشی دیوار برای آشپزخانه، حمام و نما" },
      { name: "کاشی کف", slug: "floor-tile", description: "کاشی مقاوم و ضدلغزش برای کف اماکن مسکونی و تجاری" },
      { name: "سرامیک", slug: "ceramic", description: "سرامیک‌های باکیفیت با طرح‌های متنوع" },
      { name: "پرسلان", slug: "porcelain", description: "پرسلان‌های مقاوم با جذب آب پایین" },
    ].map((c) => prisma.category.upsert({ where: { slug: c.slug }, create: c, update: c }))
  );

  const [wall, floor, ceramic, porcelain] = categories;

  const products = [
    {
      name: "کاشی دیوار طرح مرمر سفید ۳۰×۶۰",
      slug: "wall-tile-white-marble-30x60",
      description: "کاشی دیوار با طرح مرمر سفید، مناسب آشپزخانه و حمام، سطح براق و درخشان.",
      categoryId: wall.id,
      brand: "الوند کاشی",
      size: "30x60",
      color: "سفید",
      material: "سرامیک",
      usage: "دیوار",
      antiSlip: false,
      price: 380000,
      unit: "SQUARE_METER",
      stock: 240,
      isFeatured: true,
      isNew: false,
      images: [img("wall1"), img("wall1b")],
    },
    {
      name: "کاشی دیوار طرح چوب بژ ۲۵×۴۰",
      slug: "wall-tile-beige-wood-25x40",
      description: "کاشی دیوار با طراحی الهام‌گرفته از چوب طبیعی، رنگ بژ گرم، مناسب فضای نشیمن.",
      categoryId: wall.id,
      brand: "نگین کاشی",
      size: "25x40",
      color: "بژ",
      material: "سرامیک",
      usage: "دیوار",
      antiSlip: false,
      price: 295000,
      unit: "SQUARE_METER",
      stock: 180,
      isFeatured: false,
      isNew: true,
      images: [img("wall2")],
    },
    {
      name: "کاشی کف طرح گرانیت طوسی ۶۰×۶۰",
      slug: "floor-tile-gray-granite-60x60",
      description: "کاشی کف با طرح گرانیت طوسی، مقاوم در برابر سایش، مناسب راهرو و پذیرایی.",
      categoryId: floor.id,
      brand: "الوند کاشی",
      size: "60x60",
      color: "طوسی",
      material: "پرسلان",
      usage: "کف",
      antiSlip: true,
      price: 520000,
      unit: "SQUARE_METER",
      stock: 150,
      isFeatured: true,
      isNew: false,
      images: [img("floor1"), img("floor1b")],
    },
    {
      name: "کاشی کف ضدلغزش طرح سنگ تیره ۴۰×۴۰",
      slug: "floor-tile-dark-stone-antislip-40x40",
      description: "کاشی کف ضدلغزش با طرح سنگ طبیعی تیره، مناسب حیاط، تراس و پارکینگ.",
      categoryId: floor.id,
      brand: "پرشین سرام",
      size: "40x40",
      color: "طوسی تیره",
      material: "پرسلان",
      usage: "کف",
      antiSlip: true,
      price: 410000,
      unit: "SQUARE_METER",
      stock: 200,
      isFeatured: false,
      isNew: true,
      images: [img("floor2")],
    },
    {
      name: "سرامیک طرح گل سنتی ۲۰×۲۰",
      slug: "ceramic-traditional-flower-20x20",
      description: "سرامیک با طرح سنتی گل، مناسب دکوراسیون ایرانی و سنتی.",
      categoryId: ceramic.id,
      brand: "نگین کاشی",
      size: "20x20",
      color: "چندرنگ",
      material: "سرامیک",
      usage: "دیوار",
      antiSlip: false,
      price: 260000,
      unit: "SQUARE_METER",
      stock: 90,
      isFeatured: false,
      isNew: false,
      images: [img("ceramic1")],
    },
    {
      name: "سرامیک کف آشپزخانه طرح هگزاگونال",
      slug: "ceramic-hexagon-kitchen-floor",
      description: "سرامیک کف با طرح شش‌ضلعی مدرن، مناسب آشپزخانه‌های امروزی.",
      categoryId: ceramic.id,
      brand: "پرشین سرام",
      size: "20x23",
      color: "سفید و مشکی",
      material: "سرامیک",
      usage: "کف",
      antiSlip: true,
      price: 340000,
      unit: "SQUARE_METER",
      stock: 130,
      isFeatured: true,
      isNew: true,
      images: [img("ceramic2")],
    },
    {
      name: "پرسلان مات طرح سیمانی ۸۰×۸۰",
      slug: "porcelain-matte-cement-80x80",
      description: "پرسلان مات با طرح سیمانی مدرن، جذب آب بسیار پایین، مناسب فضاهای صنعتی و مدرن.",
      categoryId: porcelain.id,
      brand: "الوند کاشی",
      size: "80x80",
      color: "خاکستری روشن",
      material: "پرسلان",
      usage: "کف و دیوار",
      antiSlip: true,
      price: 690000,
      unit: "SQUARE_METER",
      stock: 75,
      isFeatured: true,
      isNew: false,
      images: [img("porcelain1"), img("porcelain1b")],
    },
    {
      name: "پرسلان براق طرح مرمر طلایی ۶۰×۱۲۰",
      slug: "porcelain-gold-marble-60x120",
      description: "پرسلان بزرگ‌ابعاد با طرح مرمر طلایی، مناسب لابی و فضاهای لوکس.",
      categoryId: porcelain.id,
      brand: "پرشین سرام",
      size: "60x120",
      color: "کرم طلایی",
      material: "پرسلان",
      usage: "کف و دیوار",
      antiSlip: false,
      price: 890000,
      unit: "SQUARE_METER",
      stock: 40,
      isFeatured: false,
      isNew: true,
      images: [img("porcelain2")],
    },
  ];

  for (const p of products) {
    const { images, ...data } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      create: data,
      update: data,
    });
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: images.map((url, order) => ({ productId: product.id, url, order })),
    });
  }

  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@armani-tile.example" },
    create: {
      name: "مدیر فروشگاه",
      email: "admin@armani-tile.example",
      password: passwordHash,
      role: "ADMIN",
    },
    update: {},
  });

  const testUsers = [
    { name: "نوید احمدی", email: "navid@example.com", totalPurchase: 2500000, loyaltyPoints: 25, tier: "BRONZE" },
    { name: "سارا محمدی", email: "sara@example.com", totalPurchase: 8500000, loyaltyPoints: 85, tier: "SILVER" },
    { name: "علی رضایی", email: "ali@example.com", totalPurchase: 24000000, loyaltyPoints: 240, tier: "GOLD" },
  ];

  for (const u of testUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      create: { ...u, password: passwordHash, role: "CUSTOMER" },
      update: u,
    });
  }

  await prisma.discountCode.upsert({
    where: { code: "WELCOME10" },
    create: {
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      minOrderAmount: 500000,
      maxUses: 100,
      isActive: true,
    },
    update: {},
  });

  console.log("Seed completed:");
  console.log("- admin login: admin@armani-tile.example / password123");
  console.log("- customer logins: navid@example.com, sara@example.com, ali@example.com / password123");
  console.log("- discount code: WELCOME10 (10% off, min 500,000 toman)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
