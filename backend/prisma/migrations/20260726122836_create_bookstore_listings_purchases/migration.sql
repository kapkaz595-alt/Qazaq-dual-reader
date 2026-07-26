-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('pending_review', 'listed', 'delisted');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('success', 'failed', 'processing');

-- CreateTable
CREATE TABLE "bookstore_listings" (
    "id" TEXT NOT NULL,
    "book_work_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "listing_status" "ListingStatus" NOT NULL DEFAULT 'pending_review',
    "submitted_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookstore_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bookstore_listing_id" TEXT NOT NULL,
    "purchase_status" "PurchaseStatus" NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bookstore_listings_listing_status_idx" ON "bookstore_listings"("listing_status");

-- CreateIndex
CREATE INDEX "purchases_user_id_bookstore_listing_id_idx" ON "purchases"("user_id", "bookstore_listing_id");

-- CreateIndex
CREATE INDEX "purchases_purchase_status_idx" ON "purchases"("purchase_status");

-- AddForeignKey
ALTER TABLE "bookstore_listings" ADD CONSTRAINT "bookstore_listings_book_work_id_fkey" FOREIGN KEY ("book_work_id") REFERENCES "book_works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookstore_listings" ADD CONSTRAINT "bookstore_listings_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_bookstore_listing_id_fkey" FOREIGN KEY ("bookstore_listing_id") REFERENCES "bookstore_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
