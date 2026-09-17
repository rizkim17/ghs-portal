"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitExam(
  babId: string,
  userId: string,
  answers: Record<string, string>,
  timeSpentSeconds?: number
) {
  const bab = await prisma.bab.findUnique({
    where: { id: babId },
    select: { maxScore: true, passingScore: true, pelajaran: { select: { type: true } } },
  });
  if (!bab) throw new Error("Bab tidak ditemukan.");

  const soalIds = Object.keys(answers);
  if (soalIds.length === 0) {
    return { score: 0, isPassed: false, correctCount: 0, totalSoal: 0, timeSpentSeconds: 0, maxScore: bab.maxScore, passingScore: bab.passingScore };
  }

  const soalDb = await prisma.soal.findMany({
    where: { id: { in: soalIds } },
    select: { id: true, correctOption: true, section: true },
  });

  let correctCount = 0;
  const sectionCorrect: Record<string, number> = {};
  const sectionTotal: Record<string, number> = {};

  soalDb.forEach((s) => {
    const sec = s.section;
    if (!sectionTotal[sec]) { sectionTotal[sec] = 0; sectionCorrect[sec] = 0; }
    sectionTotal[sec]++;
    if (answers[s.id] === s.correctOption) { correctCount++; sectionCorrect[sec]++; }
  });

  const totalSoal = soalIds.length;
  const score = Math.round((correctCount / totalSoal) * bab.maxScore);
  const isPassed = score >= bab.passingScore;

  let sectionScores: Record<string, number> | undefined;
  const uniqueSections = Object.keys(sectionTotal);
  if (uniqueSections.length > 1 || (uniqueSections.length === 1 && uniqueSections[0] !== "GENERAL")) {
    sectionScores = {};
    for (const sec of uniqueSections) {
      sectionScores[sec] = Math.round((sectionCorrect[sec] / sectionTotal[sec]) * 100);
    }
  }

  await prisma.nilaiUjian.upsert({
    where: { userId_babId: { userId, babId } },
    update: { score, isPassed, timeSpentSeconds: timeSpentSeconds ?? null, sectionScores: sectionScores ?? undefined },
    create: { userId, babId, score, isPassed, timeSpentSeconds: timeSpentSeconds ?? null, sectionScores: sectionScores ?? Prisma.DbNull },
  });

  revalidatePath("/dashboard/ujian");
  return { score, isPassed, correctCount, totalSoal, timeSpentSeconds: timeSpentSeconds ?? 0, sectionScores, maxScore: bab.maxScore, passingScore: bab.passingScore };
}
