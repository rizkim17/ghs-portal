"use server";

import { prisma } from "@/lib/prisma";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/storage";
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
  const explanation = (formData.get("explanation") as string) || null;

  if (!babId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    throw new Error("Semua field teks dan opsi soal wajib diisi.");
  }

  // Handle upload file ke VPS
  const imageFile = formData.get("imageFile") as File | null;
  const audioFile = formData.get("audioFile") as File | null;

  let imageUrl: string | null = (formData.get("imageUrl") as string) || null;
  let audioUrl: string | null = (formData.get("audioUrl") as string) || null;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveUploadedFile(imageFile, "images");
  }

  if (audioFile && audioFile.size > 0) {
    audioUrl = await saveUploadedFile(audioFile, "audio");
  }

  const bab = await prisma.bab.findUnique({ where: { id: babId }, select: { pelajaranId: true } });

  await prisma.soal.create({
    data: {
      babId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      section: section as any,
      audioUrl,
      imageUrl,
      explanation,
    },
  });

  revalidatePath(`/dashboard/admin/bank-soal/${bab?.pelajaranId}/${babId}`);
  revalidatePath(`/dashboard/ujian/${babId}`);
  return { success: true };
}

export async function updateSoal(soalId: string, formData: FormData) {
  const questionText = formData.get("questionText") as string;
  const optionA = formData.get("optionA") as string;
  const optionB = formData.get("optionB") as string;
  const optionC = formData.get("optionC") as string;
  const optionD = formData.get("optionD") as string;
  const correctOption = formData.get("correctOption") as string;
  const section = (formData.get("section") as string) || "GENERAL";
  const explanation = (formData.get("explanation") as string) || null;

  if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    throw new Error("Semua field teks dan opsi soal wajib diisi.");
  }

  const existingSoal = await prisma.soal.findUnique({
    where: { id: soalId },
    include: { bab: { select: { id: true, pelajaranId: true } } },
  });

  if (!existingSoal) {
    throw new Error("Soal tidak ditemukan.");
  }

  const removeImage = formData.get("removeImage") === "true";
  const removeAudio = formData.get("removeAudio") === "true";

  const imageFile = formData.get("imageFile") as File | null;
  const audioFile = formData.get("audioFile") as File | null;

  let finalImageUrl = existingSoal.imageUrl;
  let finalAudioUrl = existingSoal.audioUrl;

  // Penanganan Gambar
  if (removeImage) {
    if (existingSoal.imageUrl) {
      await deleteUploadedFile(existingSoal.imageUrl);
    }
    finalImageUrl = null;
  } else if (imageFile && imageFile.size > 0) {
    const uploadedPath = await saveUploadedFile(imageFile, "images");
    if (existingSoal.imageUrl) {
      await deleteUploadedFile(existingSoal.imageUrl);
    }
    finalImageUrl = uploadedPath;
  } else if (formData.has("imageUrl")) {
    const manualUrl = formData.get("imageUrl") as string;
    if (manualUrl !== existingSoal.imageUrl) {
      if (existingSoal.imageUrl) await deleteUploadedFile(existingSoal.imageUrl);
      finalImageUrl = manualUrl || null;
    }
  }

  // Penanganan Audio
  if (removeAudio) {
    if (existingSoal.audioUrl) {
      await deleteUploadedFile(existingSoal.audioUrl);
    }
    finalAudioUrl = null;
  } else if (audioFile && audioFile.size > 0) {
    const uploadedPath = await saveUploadedFile(audioFile, "audio");
    if (existingSoal.audioUrl) {
      await deleteUploadedFile(existingSoal.audioUrl);
    }
    finalAudioUrl = uploadedPath;
  } else if (formData.has("audioUrl")) {
    const manualUrl = formData.get("audioUrl") as string;
    if (manualUrl !== existingSoal.audioUrl) {
      if (existingSoal.audioUrl) await deleteUploadedFile(existingSoal.audioUrl);
      finalAudioUrl = manualUrl || null;
    }
  }

  await prisma.soal.update({
    where: { id: soalId },
    data: {
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      section: section as any,
      audioUrl: finalAudioUrl,
      imageUrl: finalImageUrl,
      explanation,
    },
  });

  revalidatePath(`/dashboard/admin/bank-soal/${existingSoal.bab.pelajaranId}/${existingSoal.bab.id}`);
  revalidatePath(`/dashboard/ujian/${existingSoal.bab.id}`);
  return { success: true };
}

export async function deleteSoal(soalId: string, babId: string) {
  const existingSoal = await prisma.soal.findUnique({
    where: { id: soalId },
    select: { imageUrl: true, audioUrl: true, bab: { select: { pelajaranId: true } } },
  });

  if (existingSoal) {
    // Hapus file fisik di VPS jika ada
    if (existingSoal.imageUrl) await deleteUploadedFile(existingSoal.imageUrl);
    if (existingSoal.audioUrl) await deleteUploadedFile(existingSoal.audioUrl);
  }

  const bab = await prisma.bab.findUnique({ where: { id: babId }, select: { pelajaranId: true } });
  await prisma.soal.delete({ where: { id: soalId } });

  revalidatePath(`/dashboard/admin/bank-soal/${bab?.pelajaranId}/${babId}`);
  revalidatePath(`/dashboard/ujian/${babId}`);
}
