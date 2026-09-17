"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBab(formData: FormData) {
  const pelajaranId = formData.get("pelajaranId") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const order = parseInt(formData.get("order") as string, 10);
  const maxSoalShown = parseInt(formData.get("maxSoalShown") as string, 10) || 20;
  const durationMinutes = parseInt(formData.get("durationMinutes") as string, 10) || 0;
  const passingScore = parseInt(formData.get("passingScore") as string, 10) || 70;
  const maxScore = parseInt(formData.get("maxScore") as string, 10) || 100;
  const sswSector = (formData.get("sswSector") as string) || "NONE";

  if (!pelajaranId || !title || isNaN(order)) {
    throw new Error("Pelajaran, judul, dan urutan wajib diisi.");
  }

  await prisma.bab.create({
    data: {
      pelajaranId,
      title,
      description,
      order,
      maxSoalShown,
      durationMinutes,
      passingScore,
      maxScore,
      sswSector: sswSector as any,
    },
  });

  revalidatePath(`/dashboard/admin/bank-soal/${pelajaranId}`);
  revalidatePath("/dashboard/ujian");
}

export async function updateBab(babId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const order = parseInt(formData.get("order") as string, 10);
  const maxSoalShown = parseInt(formData.get("maxSoalShown") as string, 10) || 20;
  const durationMinutes = parseInt(formData.get("durationMinutes") as string, 10) || 0;
  const passingScore = parseInt(formData.get("passingScore") as string, 10) || 70;
  const maxScore = parseInt(formData.get("maxScore") as string, 10) || 100;
  const sswSector = (formData.get("sswSector") as string) || "NONE";
  const status = (formData.get("status") as string) || "PUBLISHED";

  if (!title || isNaN(order)) {
    throw new Error("Judul dan urutan wajib diisi.");
  }

  const updated = await prisma.bab.update({
    where: { id: babId },
    data: {
      title,
      description,
      order,
      maxSoalShown,
      durationMinutes,
      passingScore,
      maxScore,
      sswSector: sswSector as any,
      status: status as any,
    },
    select: { pelajaranId: true },
  });

  revalidatePath(`/dashboard/admin/bank-soal/${updated.pelajaranId}`);
  revalidatePath(`/dashboard/admin/bank-soal/${updated.pelajaranId}/${babId}`);
  revalidatePath("/dashboard/ujian");
  return { success: true };
}

export async function deleteBab(babId: string) {
  const bab = await prisma.bab.findUnique({ where: { id: babId }, select: { pelajaranId: true } });
  await prisma.bab.delete({ where: { id: babId } });
  revalidatePath(`/dashboard/admin/bank-soal/${bab?.pelajaranId}`);
  revalidatePath("/dashboard/admin/bank-soal");
  revalidatePath("/dashboard/ujian");
}
