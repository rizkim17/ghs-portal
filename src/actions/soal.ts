"use server";

import { prisma } from "@/lib/prisma";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export async function createSoal(formData: FormData) {
  const babId = formData.get("babId") as string;
  const questionText = ((formData.get("questionText") as string) || "").trim();
  const correctOption = formData.get("correctOption") as string;
  const section = (formData.get("section") as string) || "GENERAL";
  const explanation = (formData.get("explanation") as string) || null;

  if (!babId || !questionText || !correctOption) {
    throw new Error("Teks pertanyaan dan kunci jawaban benar wajib diisi.");
  }

  // Handle upload media utama soal (gambar & audio)
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

  // Handle teks opsi pilihan
  const optionA = ((formData.get("optionA") as string) || "").trim();
  const optionB = ((formData.get("optionB") as string) || "").trim();
  const optionC = ((formData.get("optionC") as string) || "").trim();
  const optionD = ((formData.get("optionD") as string) || "").trim();

  // Handle upload gambar pada masing-masing opsi
  const optionAImageFile = formData.get("optionAImageFile") as File | null;
  const optionBImageFile = formData.get("optionBImageFile") as File | null;
  const optionCImageFile = formData.get("optionCImageFile") as File | null;
  const optionDImageFile = formData.get("optionDImageFile") as File | null;

  let optionAImage: string | null = (formData.get("optionAImage") as string) || null;
  let optionBImage: string | null = (formData.get("optionBImage") as string) || null;
  let optionCImage: string | null = (formData.get("optionCImage") as string) || null;
  let optionDImage: string | null = (formData.get("optionDImage") as string) || null;

  if (optionAImageFile && optionAImageFile.size > 0) {
    optionAImage = await saveUploadedFile(optionAImageFile, "images");
  }
  if (optionBImageFile && optionBImageFile.size > 0) {
    optionBImage = await saveUploadedFile(optionBImageFile, "images");
  }
  if (optionCImageFile && optionCImageFile.size > 0) {
    optionCImage = await saveUploadedFile(optionCImageFile, "images");
  }
  if (optionDImageFile && optionDImageFile.size > 0) {
    optionDImage = await saveUploadedFile(optionDImageFile, "images");
  }

  const hasOptionA = optionA.length > 0 || !!optionAImage;
  const hasOptionB = optionB.length > 0 || !!optionBImage;
  const hasOptionC = optionC.length > 0 || !!optionCImage;
  const hasOptionD = optionD.length > 0 || !!optionDImage;

  if (!hasOptionA || !hasOptionB) {
    throw new Error("Minimal harus ada 2 pilihan jawaban (Pilihan A dan B wajib memiliki teks atau gambar).");
  }

  const activeOptions = ["A", "B"];
  if (hasOptionC) activeOptions.push("C");
  if (hasOptionD) activeOptions.push("D");

  if (!activeOptions.includes(correctOption)) {
    throw new Error(`Kunci jawaban benar (${correctOption}) harus merupakan salah satu pilihan yang aktif (${activeOptions.join(", ")}).`);
  }

  const bab = await prisma.bab.findUnique({ where: { id: babId }, select: { pelajaranId: true } });

  await prisma.soal.create({
    data: {
      babId,
      questionText,
      optionA: hasOptionA ? optionA : null,
      optionB: hasOptionB ? optionB : null,
      optionC: hasOptionC ? optionC : null,
      optionD: hasOptionD ? optionD : null,
      optionAImage: hasOptionA ? optionAImage : null,
      optionBImage: hasOptionB ? optionBImage : null,
      optionCImage: hasOptionC ? optionCImage : null,
      optionDImage: hasOptionD ? optionDImage : null,
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
  const questionText = ((formData.get("questionText") as string) || "").trim();
  const correctOption = formData.get("correctOption") as string;
  const section = (formData.get("section") as string) || "GENERAL";
  const explanation = (formData.get("explanation") as string) || null;

  if (!questionText || !correctOption) {
    throw new Error("Teks pertanyaan dan kunci jawaban benar wajib diisi.");
  }

  const existingSoal = await prisma.soal.findUnique({
    where: { id: soalId },
    include: { bab: { select: { id: true, pelajaranId: true } } },
  });

  if (!existingSoal) {
    throw new Error("Soal tidak ditemukan.");
  }

  // Handle media utama soal
  const removeImage = formData.get("removeImage") === "true";
  const removeAudio = formData.get("removeAudio") === "true";

  const imageFile = formData.get("imageFile") as File | null;
  const audioFile = formData.get("audioFile") as File | null;

  let finalImageUrl = existingSoal.imageUrl;
  let finalAudioUrl = existingSoal.audioUrl;

  if (removeImage) {
    if (existingSoal.imageUrl) await deleteUploadedFile(existingSoal.imageUrl);
    finalImageUrl = null;
  } else if (imageFile && imageFile.size > 0) {
    const uploadedPath = await saveUploadedFile(imageFile, "images");
    if (existingSoal.imageUrl) await deleteUploadedFile(existingSoal.imageUrl);
    finalImageUrl = uploadedPath;
  }

  if (removeAudio) {
    if (existingSoal.audioUrl) await deleteUploadedFile(existingSoal.audioUrl);
    finalAudioUrl = null;
  } else if (audioFile && audioFile.size > 0) {
    const uploadedPath = await saveUploadedFile(audioFile, "audio");
    if (existingSoal.audioUrl) await deleteUploadedFile(existingSoal.audioUrl);
    finalAudioUrl = uploadedPath;
  }

  // Handle teks opsi
  const optionA = ((formData.get("optionA") as string) || "").trim();
  const optionB = ((formData.get("optionB") as string) || "").trim();
  const optionC = ((formData.get("optionC") as string) || "").trim();
  const optionD = ((formData.get("optionD") as string) || "").trim();

  // Helper untuk update gambar opsi A-D
  const processOptionImage = async (
    optKey: "optionAImage" | "optionBImage" | "optionCImage" | "optionDImage",
    fileKey: string,
    removeKey: string
  ) => {
    const shouldRemove = formData.get(removeKey) === "true";
    const file = formData.get(fileKey) as File | null;
    const oldUrl = existingSoal[optKey];

    if (shouldRemove) {
      if (oldUrl) await deleteUploadedFile(oldUrl);
      return null;
    }
    if (file && file.size > 0) {
      const newUrl = await saveUploadedFile(file, "images");
      if (oldUrl) await deleteUploadedFile(oldUrl);
      return newUrl;
    }
    return oldUrl;
  };

  const finalOptionAImage = await processOptionImage("optionAImage", "optionAImageFile", "removeOptionAImage");
  const finalOptionBImage = await processOptionImage("optionBImage", "optionBImageFile", "removeOptionBImage");
  const finalOptionCImage = await processOptionImage("optionCImage", "optionCImageFile", "removeOptionCImage");
  const finalOptionDImage = await processOptionImage("optionDImage", "optionDImageFile", "removeOptionDImage");

  const hasOptionA = optionA.length > 0 || !!finalOptionAImage;
  const hasOptionB = optionB.length > 0 || !!finalOptionBImage;
  const hasOptionC = optionC.length > 0 || !!finalOptionCImage;
  const hasOptionD = optionD.length > 0 || !!finalOptionDImage;

  if (!hasOptionA || !hasOptionB) {
    throw new Error("Minimal harus ada 2 pilihan jawaban (Pilihan A dan B wajib memiliki teks atau gambar).");
  }

  const activeOptions = ["A", "B"];
  if (hasOptionC) activeOptions.push("C");
  if (hasOptionD) activeOptions.push("D");

  if (!activeOptions.includes(correctOption)) {
    throw new Error(`Kunci jawaban benar (${correctOption}) harus merupakan salah satu pilihan yang aktif (${activeOptions.join(", ")}).`);
  }

  // Jika opsi C atau D dinonaktifkan / dihapus sama sekali, bersihkan file gambarnya di disk
  if (!hasOptionC && existingSoal.optionCImage) {
    await deleteUploadedFile(existingSoal.optionCImage);
  }
  if (!hasOptionD && existingSoal.optionDImage) {
    await deleteUploadedFile(existingSoal.optionDImage);
  }

  await prisma.soal.update({
    where: { id: soalId },
    data: {
      questionText,
      optionA: hasOptionA ? optionA : null,
      optionB: hasOptionB ? optionB : null,
      optionC: hasOptionC ? optionC : null,
      optionD: hasOptionD ? optionD : null,
      optionAImage: hasOptionA ? finalOptionAImage : null,
      optionBImage: hasOptionB ? finalOptionBImage : null,
      optionCImage: hasOptionC ? finalOptionCImage : null,
      optionDImage: hasOptionD ? finalOptionDImage : null,
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
    select: {
      imageUrl: true,
      audioUrl: true,
      optionAImage: true,
      optionBImage: true,
      optionCImage: true,
      optionDImage: true,
      bab: { select: { pelajaranId: true } },
    },
  });

  if (existingSoal) {
    // Hapus file fisik di VPS
    if (existingSoal.imageUrl) await deleteUploadedFile(existingSoal.imageUrl);
    if (existingSoal.audioUrl) await deleteUploadedFile(existingSoal.audioUrl);
    if (existingSoal.optionAImage) await deleteUploadedFile(existingSoal.optionAImage);
    if (existingSoal.optionBImage) await deleteUploadedFile(existingSoal.optionBImage);
    if (existingSoal.optionCImage) await deleteUploadedFile(existingSoal.optionCImage);
    if (existingSoal.optionDImage) await deleteUploadedFile(existingSoal.optionDImage);
  }

  const bab = await prisma.bab.findUnique({ where: { id: babId }, select: { pelajaranId: true } });
  await prisma.soal.delete({ where: { id: soalId } });

  revalidatePath(`/dashboard/admin/bank-soal/${bab?.pelajaranId}/${babId}`);
  revalidatePath(`/dashboard/ujian/${babId}`);
}
