"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- BAB MANAGEMENT ---

export async function createBab(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const order = parseInt(formData.get("order") as string, 10);

  if (!title || isNaN(order)) {
    throw new Error("Judul dan urutan bab wajib diisi.");
  }

  await prisma.bab.create({
    data: {
      title,
      description,
      order,
    },
  });

  revalidatePath("/dashboard/admin/bank-soal");
}

export async function deleteBab(babId: string) {
  await prisma.bab.delete({
    where: { id: babId },
  });
  revalidatePath("/dashboard/admin/bank-soal");
}

// --- SOAL MANAGEMENT ---

export async function createSoal(formData: FormData) {
  const babId = formData.get("babId") as string;
  const questionText = formData.get("questionText") as string;
  const optionA = formData.get("optionA") as string;
  const optionB = formData.get("optionB") as string;
  const optionC = formData.get("optionC") as string;
  const optionD = formData.get("optionD") as string;
  const correctOption = formData.get("correctOption") as string;

  if (!babId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    throw new Error("Semua field soal wajib diisi.");
  }

  await prisma.soal.create({
    data: {
      babId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
    },
  });

  revalidatePath(`/dashboard/admin/bank-soal/${babId}`);
}

export async function deleteSoal(soalId: string, babId: string) {
  await prisma.soal.delete({
    where: { id: soalId },
  });
  revalidatePath(`/dashboard/admin/bank-soal/${babId}`);
}

// --- ENGINE UJIAN ---

export async function submitExam(babId: string, userId: string, answers: Record<string, string>) {
  // 1. Ambil jawaban benar dari database untuk soal-soal yang diujikan
  const soalIds = Object.keys(answers);
  if (soalIds.length === 0) return { score: 0, passed: false };

  const soalDb = await prisma.soal.findMany({
    where: { id: { in: soalIds } },
    select: { id: true, correctOption: true }
  });

  // 2. Hitung jumlah benar
  let correctCount = 0;
  soalDb.forEach((s) => {
    if (answers[s.id] === s.correctOption) {
      correctCount++;
    }
  });

  // 3. Hitung persentase nilai (dari 0-100)
  // Misalnya, ada 20 soal. Jika benar 15, skor = (15 / 20) * 100 = 75
  const totalSoal = soalIds.length;
  const score = Math.round((correctCount / totalSoal) * 100);
  const isPassed = score >= 70; // Passing grade = 70

  // 4. Simpan ke database (Upsert agar jika sudah ada, di-update dengan nilai terbaru)
  await prisma.nilaiUjian.upsert({
    where: {
      userId_babId: {
        userId,
        babId
      }
    },
    update: {
      score,
      isPassed,
      // Logika: Hanya simpan jika nilai barunya lebih tinggi
      // Tetapi upsert update akan otomatis overwrite, mari kita override.
    },
    create: {
      userId,
      babId,
      score,
      isPassed
    }
  });

  revalidatePath("/dashboard/ujian");
  return { score, isPassed, correctCount, totalSoal };
}
