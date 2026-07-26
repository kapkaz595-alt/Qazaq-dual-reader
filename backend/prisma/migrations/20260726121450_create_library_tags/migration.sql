-- CreateEnum
CREATE TYPE "AcquisitionType" AS ENUM ('imported', 'purchased');

-- CreateTable
CREATE TABLE "library_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_work_id" TEXT NOT NULL,
    "acquisition_type" "AcquisitionType" NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_tags" (
    "library_entry_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "book_tags_pkey" PRIMARY KEY ("library_entry_id","tag_id")
);

-- CreateIndex
CREATE INDEX "library_entries_user_id_idx" ON "library_entries"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_entries_user_id_book_work_id_key" ON "library_entries"("user_id", "book_work_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_user_id_name_key" ON "tags"("user_id", "name");

-- CreateIndex
CREATE INDEX "book_tags_tag_id_idx" ON "book_tags"("tag_id");

-- AddForeignKey
ALTER TABLE "library_entries" ADD CONSTRAINT "library_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entries" ADD CONSTRAINT "library_entries_book_work_id_fkey" FOREIGN KEY ("book_work_id") REFERENCES "book_works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_tags" ADD CONSTRAINT "book_tags_library_entry_id_fkey" FOREIGN KEY ("library_entry_id") REFERENCES "library_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_tags" ADD CONSTRAINT "book_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
