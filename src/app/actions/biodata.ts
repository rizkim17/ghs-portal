"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function saveBiodata(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  const fullNameKanji = formData.get("fullNameKanji") as string;
  const fullNameKatakana = formData.get("fullNameKatakana") as string;
  const placeOfBirth = formData.get("placeOfBirth") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;
  const bloodType = formData.get("bloodType") as string;
  const height = parseInt(formData.get("height") as string, 10);
  const weight = parseInt(formData.get("weight") as string, 10);
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;

  await prisma.biodata.upsert({
    where: { userId },
    update: {
      fullNameKanji,
      fullNameKatakana,
      placeOfBirth,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      bloodType,
      height: isNaN(height) ? null : height,
      weight: isNaN(weight) ? null : weight,
      address,
      phone
    },
    create: {
      userId,
      fullNameKanji,
      fullNameKatakana,
      placeOfBirth,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      bloodType,
      height: isNaN(height) ? null : height,
      weight: isNaN(weight) ? null : weight,
      address,
      phone
    }
  });

  revalidatePath("/dashboard/biodata");
  return { success: true };
}
