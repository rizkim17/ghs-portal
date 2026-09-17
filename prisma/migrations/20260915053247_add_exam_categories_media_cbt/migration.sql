-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'GURU', 'SISWA');

-- CreateEnum
CREATE TYPE "ExamCategory" AS ENUM ('KANA_HIRAGANA_KATAKANA', 'MINNA_NO_NIHONGO_1', 'MINNA_NO_NIHONGO_2', 'IRODORI', 'JFT_BASIC', 'SSW_SKILL');

-- CreateEnum
CREATE TYPE "SSWSector" AS ENUM ('NONE', 'KAIGO', 'INSHOKURYOHIN_SEIZO', 'GAISHOKU', 'NOGYO', 'KENSETSU');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('GENERAL', 'JFT_MOJI_KOTOBA', 'JFT_KAIWA_HYOUGEN', 'JFT_CHOUKAI', 'JFT_DOKKAI', 'SSW_GAKKA', 'SSW_JITSUGI');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "nik" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SISWA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bab" (
    "id" TEXT NOT NULL,
    "category" "ExamCategory" NOT NULL DEFAULT 'MINNA_NO_NIHONGO_1',
    "sswSector" "SSWSector" NOT NULL DEFAULT 'NONE',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Soal" (
    "id" TEXT NOT NULL,
    "babId" TEXT NOT NULL,
    "section" "SectionType" NOT NULL DEFAULT 'GENERAL',
    "questionText" TEXT NOT NULL,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctOption" TEXT NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Soal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NilaiUjian" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "babId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "timeSpentSeconds" INTEGER,
    "sectionScores" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NilaiUjian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biodata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullNameKanji" TEXT,
    "fullNameKatakana" TEXT,
    "placeOfBirth" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "bloodType" TEXT,
    "height" INTEGER,
    "weight" INTEGER,
    "address" TEXT,
    "phone" TEXT,
    "educationHistory" JSONB,
    "workExperience" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Biodata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_key" ON "User"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "NilaiUjian_userId_babId_key" ON "NilaiUjian"("userId", "babId");

-- CreateIndex
CREATE UNIQUE INDEX "Biodata_userId_key" ON "Biodata"("userId");

-- AddForeignKey
ALTER TABLE "Soal" ADD CONSTRAINT "Soal_babId_fkey" FOREIGN KEY ("babId") REFERENCES "Bab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiUjian" ADD CONSTRAINT "NilaiUjian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiUjian" ADD CONSTRAINT "NilaiUjian_babId_fkey" FOREIGN KEY ("babId") REFERENCES "Bab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
