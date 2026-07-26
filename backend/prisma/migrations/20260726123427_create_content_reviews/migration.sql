-- CreateEnum
CREATE TYPE "ReviewDecision" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "content_reviews" (
    "id" TEXT NOT NULL,
    "bookstore_listing_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "decision" "ReviewDecision" NOT NULL DEFAULT 'pending',
    "remark" TEXT,
    "decided_at" TIMESTAMP(3),

    CONSTRAINT "content_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "content_reviews_bookstore_listing_id_idx" ON "content_reviews"("bookstore_listing_id");

-- CreateIndex
CREATE INDEX "content_reviews_decision_idx" ON "content_reviews"("decision");

-- AddForeignKey
ALTER TABLE "content_reviews" ADD CONSTRAINT "content_reviews_bookstore_listing_id_fkey" FOREIGN KEY ("bookstore_listing_id") REFERENCES "bookstore_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reviews" ADD CONSTRAINT "content_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
