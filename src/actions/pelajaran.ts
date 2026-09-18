"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPelajaran(formData: FormData) {
  const name = formData.get("name") as string;
  const type = (formData.get("type") as string) || "BAB";
  const description = (formData.get("description") as string) || null;

  if (!name) throw new Error("Nama pelajaran wajib diisi.");

  const maxOrderPelajaran = await prisma.pelajaran.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = Math.max(2, maxOrderPelajaran?.order || 2) + 1;

  await prisma.pelajaran.create({
    data: {
      name,
      type: type as any,
      description,
      isDefault: false,
      order: nextOrder,
    },
  });

  revalidatePath("/dashboard/admin/bank-soal");
  revalidatePath("/dashboard/ujian");
}

export async function updatePelajaran(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const status = (formData.get("status") as string) || "PUBLISHED";
  const order = parseInt(formData.get("order") as string, 10);

  if (!name) throw new Error("Nama pelajaran wajib diisi.");

  await prisma.pelajaran.update({
    where: { id },
    data: {
      name,
      description,
      status: status as any,
      ...(isNaN(order) ? {} : { order }),
    },
  });

  revalidatePath("/dashboard/admin/bank-soal");
  revalidatePath(`/dashboard/admin/bank-soal/${id}`);
  revalidatePath("/dashboard/ujian");
  return { success: true };
}

export async function deletePelajaran(id: string) {
  // Cegah hapus pelajaran default (JFT/SSW)
  const p = await prisma.pelajaran.findUnique({ where: { id }, select: { isDefault: true } });
  if (p?.isDefault) throw new Error("Tidak bisa menghapus kategori default.");

  await prisma.pelajaran.delete({ where: { id } });
  revalidatePath("/dashboard/admin/bank-soal");
  revalidatePath("/dashboard/ujian");
}

export async function togglePelajaranStatus(id: string) {
  const p = await prisma.pelajaran.findUnique({ where: { id }, select: { status: true } });
  if (!p) throw new Error("Pelajaran tidak ditemukan.");

  await prisma.pelajaran.update({
    where: { id },
    data: { status: p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });
  revalidatePath("/dashboard/admin/bank-soal");
  revalidatePath(`/dashboard/admin/bank-soal/${id}`);
  revalidatePath("/dashboard/ujian");
}
