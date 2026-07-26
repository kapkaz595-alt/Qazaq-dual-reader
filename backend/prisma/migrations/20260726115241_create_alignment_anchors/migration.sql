-- CreateTable
CREATE TABLE "alignment_anchors" (
    "id" TEXT NOT NULL,
    "book_work_id" TEXT NOT NULL,
    "cyrillic_chapter_id" TEXT NOT NULL,
    "arabic_chapter_id" TEXT NOT NULL,
    "segment_index" INTEGER NOT NULL,
    "cyrillic_segment_ref" TEXT NOT NULL,
    "arabic_segment_ref" TEXT NOT NULL,

    CONSTRAINT "alignment_anchors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "alignment_anchors_book_work_id_segment_index_idx" ON "alignment_anchors"("book_work_id", "segment_index");

-- AddForeignKey
ALTER TABLE "alignment_anchors" ADD CONSTRAINT "alignment_anchors_book_work_id_fkey" FOREIGN KEY ("book_work_id") REFERENCES "book_works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alignment_anchors" ADD CONSTRAINT "alignment_anchors_cyrillic_chapter_id_fkey" FOREIGN KEY ("cyrillic_chapter_id") REFERENCES "document_chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alignment_anchors" ADD CONSTRAINT "alignment_anchors_arabic_chapter_id_fkey" FOREIGN KEY ("arabic_chapter_id") REFERENCES "document_chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
