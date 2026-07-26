-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "conversion_feedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_version_id" TEXT,
    "original_text" TEXT NOT NULL,
    "system_result" TEXT NOT NULL,
    "suggested_result" TEXT NOT NULL,
    "review_status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversion_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversion_feedback_review_status_idx" ON "conversion_feedback"("review_status");

-- AddForeignKey
ALTER TABLE "conversion_feedback" ADD CONSTRAINT "conversion_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_feedback" ADD CONSTRAINT "conversion_feedback_book_version_id_fkey" FOREIGN KEY ("book_version_id") REFERENCES "book_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
