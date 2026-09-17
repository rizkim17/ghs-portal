"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Hanya SUPERADMIN yang bisa membuat akun
export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPERADMIN") {
    return { error: "Anda tidak memiliki izin untuk membuat akun." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const nik = formData.get("nik") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !password || !role) {
    return { error: "Nama, password, dan role wajib diisi." };
  }

  try {
    // Cek duplikat email/nik
    if (email || nik) {
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(nik ? [{ nik }] : []),
          ]
        }
      });
      if (existing) {
        return { error: "Email atau NIK sudah terdaftar!" };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: email || null,
        nik: nik || null,
        password: hashedPassword,
        role: role as any,
      }
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error: any) {
    return { error: `Gagal membuat akun: ${error?.message || "Unknown"}` };
  }
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPERADMIN") {
    return { error: "Anda tidak memiliki izin untuk mengedit akun." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const nik = formData.get("nik") as string;
  const role = formData.get("role") as string;

  if (!name || !role) {
    return { error: "Nama dan role wajib diisi." };
  }

  try {
    if (email || nik) {
      const existing = await prisma.user.findFirst({
        where: {
          id: { not: userId },
          OR: [
            ...(email ? [{ email }] : []),
            ...(nik ? [{ nik }] : []),
          ]
        }
      });
      if (existing) {
        return { error: "Email atau NIK sudah digunakan oleh akun lain!" };
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email: email || null,
        nik: nik || null,
        role: role as any,
      }
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error: any) {
    return { error: `Gagal memperbarui akun: ${error?.message || "Unknown"}` };
  }
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPERADMIN") {
    return { error: "Anda tidak memiliki izin." };
  }

  // Jangan hapus diri sendiri
  if ((session?.user as any)?.id === userId) {
    return { error: "Anda tidak bisa menghapus akun sendiri!" };
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function resetPassword(userId: string, newPassword: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPERADMIN") {
    return { error: "Anda tidak memiliki izin." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}
