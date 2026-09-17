-- Hand-written DDL matching prisma/schema.prisma, used only for local dev verification
-- via PGlite (since the Prisma CLI's native schema-engine binary cannot run in this sandbox).
-- Column/table names match the Prisma schema exactly (Prisma quotes identifiers as-is).

CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');
CREATE TYPE "LoyaltyTierLevel" AS ENUM ('BRONZE', 'SILVER', 'GOLD');
CREATE TYPE "ProductUnit" AS ENUM ('SQUARE_METER', 'CARTON', 'PIECE');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED');
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'FAILED');
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED');
CREATE TYPE "LoyaltyTxType" AS ENUM ('EARN', 'REDEEM');
CREATE TYPE "ConversationStatus" AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE "SenderType" AS ENUM ('USER', 'ADMIN');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE,
  "phone" TEXT UNIQUE,
  "emailVerified" TIMESTAMP(3),
  "password" TEXT,
  "image" TEXT,
  "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  "totalPurchase" INTEGER NOT NULL DEFAULT 0,
  "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
  "tier" "LoyaltyTierLevel" NOT NULL DEFAULT 'BRONZE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL,
  UNIQUE ("identifier", "token")
);

CREATE TABLE "Category" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "image" TEXT,
  "parentId" TEXT REFERENCES "Category"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL REFERENCES "Category"("id"),
  "brand" TEXT,
  "size" TEXT,
  "color" TEXT,
  "material" TEXT,
  "antiSlip" BOOLEAN NOT NULL DEFAULT false,
  "usage" TEXT,
  "price" INTEGER NOT NULL,
  "unit" "ProductUnit" NOT NULL DEFAULT 'SQUARE_METER',
  "stock" INTEGER NOT NULL DEFAULT 0,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isNew" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

CREATE TABLE "ProductImage" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "alt" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

CREATE TABLE "Cart" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CartItem" (
  "id" TEXT PRIMARY KEY,
  "cartId" TEXT NOT NULL REFERENCES "Cart"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  UNIQUE ("cartId", "productId")
);

CREATE TABLE "Address" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "addressLine" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DiscountCode" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "type" "DiscountType" NOT NULL,
  "value" INTEGER NOT NULL,
  "minOrderAmount" INTEGER NOT NULL DEFAULT 0,
  "maxUses" INTEGER,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "addressId" TEXT NOT NULL REFERENCES "Address"("id"),
  "subtotal" INTEGER NOT NULL,
  "discountAmount" INTEGER NOT NULL DEFAULT 0,
  "shippingCost" INTEGER NOT NULL DEFAULT 0,
  "totalAmount" INTEGER NOT NULL,
  "discountCodeId" TEXT REFERENCES "DiscountCode"("id"),
  "pointsUsed" INTEGER NOT NULL DEFAULT 0,
  "pointsEarned" INTEGER NOT NULL DEFAULT 0,
  "shippingMethod" TEXT NOT NULL DEFAULT 'post',
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
  "paymentAuthority" TEXT,
  "paymentRefId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "quantity" INTEGER NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "totalPrice" INTEGER NOT NULL
);

CREATE TABLE "LoyaltyTransaction" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type" "LoyaltyTxType" NOT NULL,
  "points" INTEGER NOT NULL,
  "orderId" TEXT REFERENCES "Order"("id"),
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "LoyaltyTransaction_userId_idx" ON "LoyaltyTransaction"("userId");

CREATE TABLE "LoyaltySettings" (
  "id" TEXT PRIMARY KEY DEFAULT 'default',
  "pointsPerToman" INTEGER NOT NULL DEFAULT 100000,
  "pointValueInToman" INTEGER NOT NULL DEFAULT 1000,
  "silverThreshold" INTEGER NOT NULL DEFAULT 5000000,
  "goldThreshold" INTEGER NOT NULL DEFAULT 20000000,
  "silverDiscountPercent" INTEGER NOT NULL DEFAULT 3,
  "goldDiscountPercent" INTEGER NOT NULL DEFAULT 7,
  "bronzeDiscountPercent" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ChatConversation" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "guestName" TEXT,
  "guestId" TEXT,
  "status" "ConversationStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ChatConversation_userId_idx" ON "ChatConversation"("userId");
CREATE INDEX "ChatConversation_status_idx" ON "ChatConversation"("status");

CREATE TABLE "ChatMessage" (
  "id" TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL REFERENCES "ChatConversation"("id") ON DELETE CASCADE,
  "senderType" "SenderType" NOT NULL,
  "senderId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ChatMessage_conversationId_idx" ON "ChatMessage"("conversationId");
