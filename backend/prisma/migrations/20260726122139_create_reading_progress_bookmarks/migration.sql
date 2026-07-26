-- CreateTable
CREATE TABLE "reading_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_work_id" TEXT NOT NULL,
    "current_script" "ScriptType" NOT NULL,
    "position_ref" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_work_id" TEXT NOT NULL,
    "position_ref" TEXT NOT NULL,
    "note_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reading_progress_user_id_book_work_id_key" ON "reading_progress"("user_id", "book_work_id");

-- CreateIndex
CREATE INDEX "bookmarks_user_id_book_work_id_idx" ON "bookmarks"("user_id", "book_work_id");

-- AddForeignKey
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_book_work_id_fkey" FOREIGN KEY ("book_work_id") REFERENCES "book_works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_book_work_id_fkey" FOREIGN KEY ("book_work_id") REFERENCES "book_works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
