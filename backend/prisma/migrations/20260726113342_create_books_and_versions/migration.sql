-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('user_import', 'official_publish');

-- CreateEnum
CREATE TYPE "GenerationMethod" AS ENUM ('original_upload', 'system_converted');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('ltr', 'rtl');

-- CreateTable
CREATE TABLE "book_works" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "description" TEXT,
    "source_type" "SourceType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_versions" (
    "id" TEXT NOT NULL,
    "book_work_id" TEXT NOT NULL,
    "script_type" "ScriptType" NOT NULL,
    "generation_method" "GenerationMethod" NOT NULL,
    "content_ref" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_versions_book_work_id_script_type_key" ON "book_versions"("book_work_id", "script_type");

-- AddForeignKey
ALTER TABLE "book_versions" ADD CONSTRAINT "book_versions_book_work_id_fkey" FOREIGN KEY ("book_work_id") REFERENCES "book_works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
