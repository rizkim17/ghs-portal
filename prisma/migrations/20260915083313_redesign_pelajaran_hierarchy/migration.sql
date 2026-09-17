/*
  Warnings:

  - You are about to drop the column `category` on the `Bab` table. All the data in the column will be lost.
  - Added the required column `pelajaranId` to the `Bab` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('JFT', 'SSW', 'BAB');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('PUBLISHED', 'DRAFT');

-- AlterTable
ALTER TABLE "Bab" DROP COLUMN "category",
ADD COLUMN     "maxSoalShown" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "pelajaranId" TEXT NOT NULL,
ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED';

-- DropEnum
DROP TYPE "ExamCategory";

-- CreateTable
CREATE TABLE "Pelajaran" (
    "id" TEXT NOT NULL,
    "type" "ExamType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pelajaran_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bab" ADD CONSTRAINT "Bab_pelajaranId_fkey" FOREIGN KEY ("pelajaranId") REFERENCES "Pelajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;
