-- CreateTable
CREATE TABLE "document_chapters" (
    "id" TEXT NOT NULL,
    "book_version_id" TEXT NOT NULL,
    "chapter_index" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "document_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "document_chapters_book_version_id_chapter_index_idx" ON "document_chapters"("book_version_id", "chapter_index");

-- AddForeignKey
ALTER TABLE "document_chapters" ADD CONSTRAINT "document_chapters_book_version_id_fkey" FOREIGN KEY ("book_version_id") REFERENCES "book_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
