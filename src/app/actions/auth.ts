"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const nik = formData.get("nik") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !nik || !password) {
    return { error: "Semua data wajib diisi" };
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nik }]
      }
    });

    if (existingUser) {
      return { error: "Email atau NIK sudah terdaftar!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        nik,
        password: hashedPassword,
        // Role otomatis SISWA karena set di schema default=SISWA
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat mendaftar" };
  }
}
