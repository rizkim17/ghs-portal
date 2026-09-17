"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSoal(formData: FormData) {
  const babId = formData.get("babId") as string;
  const questionText = formData.get("questionText") as string;
  const optionA = formData.get("optionA") as string;
  const optionB = formData.get("optionB") as string;
  const optionC = formData.get("optionC") as string;
  const optionD = formData.get("optionD") as string;
  const correctOption = formData.get("correctOption") as string;
  const section = (formData.get("section") as string) || "GENERAL";
  const audioUrl = (formData.get("audioUrl") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const explanation = (formData.get("explanation") as string) || null;

  if (!babId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    throw new Error("Semua field soal wajib diisi.");
  }

  const bab = await prisma.bab.findUnique({ where: { id: babId }, select: { pelajaranId: true } });

  await prisma.soal.create({
    data: { babId, questionText, optionA, optionB, optionC, optionD, correctOption, section: section as any, audioUrl, imageUrl, explanation },
  });

  revalidatePath(`/dashboard/admin/bank-soal/${bab?.pelajaranId}/${babId}`);
}

export async function deleteSoal(soalId: string, babId: string) {
  const bab = await prisma.bab.findUnique({ where: { id: babId }, select: { pelajaranId: true } });
  await prisma.soal.delete({ where: { id: soalId } });
  revalidatePath(`/dashboard/admin/bank-soal/${bab?.pelajaranId}/${babId}`);
}
