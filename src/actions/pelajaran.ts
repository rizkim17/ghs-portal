"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPelajaran(formData: FormData) {
  const name = formData.get("name") as string;
  const type = (formData.get("type") as string) || "BAB";
  const description = (formData.get("description") as string) || null;

  if (!name) throw new Error("Nama pelajaran wajib diisi.");

  await prisma.pelajaran.create({
    data: {
      name,
      type: type as any,
      description,
      isDefault: false,
    },
  });

  revalidatePath("/dashboard/admin/bank-soal");
}

export async function deletePelajaran(id: string) {
  // Cegah hapus pelajaran default (JFT/SSW)
  const p = await prisma.pelajaran.findUnique({ where: { id }, select: { isDefault: true } });
  if (p?.isDefault) throw new Error("Tidak bisa menghapus kategori default.");

  await prisma.pelajaran.delete({ where: { id } });
  revalidatePath("/dashboard/admin/bank-soal");
}

export async function togglePelajaranStatus(id: string) {
  const p = await prisma.pelajaran.findUnique({ where: { id }, select: { status: true } });
  if (!p) throw new Error("Pelajaran tidak ditemukan.");

  await prisma.pelajaran.update({
    where: { id },
    data: { status: p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });
  revalidatePath("/dashboard/admin/bank-soal");
}
