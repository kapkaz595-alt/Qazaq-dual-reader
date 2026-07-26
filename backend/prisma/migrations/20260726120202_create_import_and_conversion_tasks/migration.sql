-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('txt', 'epub', 'pdf');

-- CreateEnum
CREATE TYPE "ImportTaskStatus" AS ENUM ('pending', 'parsing', 'converting', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "ConversionTaskStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "import_tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "file_type" "FileType" NOT NULL,
    "status" "ImportTaskStatus" NOT NULL DEFAULT 'pending',
    "failure_reason" TEXT,
    "resulting_book_work_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_tasks" (
    "id" TEXT NOT NULL,
    "source_book_version_id" TEXT NOT NULL,
    "target_script_type" "ScriptType" NOT NULL,
    "status" "ConversionTaskStatus" NOT NULL DEFAULT 'pending',
    "resulting_book_version_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversion_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_tasks_user_id_idx" ON "import_tasks"("user_id");

-- CreateIndex
CREATE INDEX "import_tasks_status_idx" ON "import_tasks"("status");

-- CreateIndex
CREATE INDEX "conversion_tasks_status_idx" ON "conversion_tasks"("status");

-- AddForeignKey
ALTER TABLE "import_tasks" ADD CONSTRAINT "import_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_tasks" ADD CONSTRAINT "import_tasks_resulting_book_work_id_fkey" FOREIGN KEY ("resulting_book_work_id") REFERENCES "book_works"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_tasks" ADD CONSTRAINT "conversion_tasks_source_book_version_id_fkey" FOREIGN KEY ("source_book_version_id") REFERENCES "book_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_tasks" ADD CONSTRAINT "conversion_tasks_resulting_book_version_id_fkey" FOREIGN KEY ("resulting_book_version_id") REFERENCES "book_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
