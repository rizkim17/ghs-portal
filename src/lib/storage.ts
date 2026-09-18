import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "soal");

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const ALLOWED_AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "audio/m4a": ".m4a",
  "audio/x-m4a": ".m4a",
  "audio/aac": ".aac",
  "audio/ogg": ".ogg",
  "audio/webm": ".webm",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25 MB

/**
 * Menyimpan file yang diunggah ke penyimpanan lokal VPS / server
 * Mengembalikan URL publik relatif, contoh: /uploads/soal/images/img_12345.jpg
 */
export async function saveUploadedFile(
  file: File,
  type: "images" | "audio"
): Promise<string> {
  if (!file || !(file instanceof File) || file.size === 0) {
    return "";
  }

  const isImage = type === "images";
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_AUDIO_SIZE;
  const maxMb = isImage ? 5 : 25;

  if (file.size > maxSize) {
    throw new Error(
      `Ukuran file ${isImage ? "gambar" : "audio"} melebihi batas maksimal ${maxMb}MB.`
    );
  }

  // Tentukan ekstensi file berdasarkan nama asli dan MIME type
  const originalExt = path.extname(file.name).toLowerCase();
  const mimeType = file.type.toLowerCase();

  const allowedMap = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES;
  let ext = originalExt;

  // Jika ekstensi tidak cocok, periksa MIME type
  const validExts = Object.values(allowedMap);
  if (!validExts.includes(ext)) {
    if (allowedMap[mimeType]) {
      ext = allowedMap[mimeType];
    } else {
      throw new Error(
        `Format file ${isImage ? "gambar" : "audio"} tidak didukung. Format yang didukung: ${validExts.join(", ")}`
      );
    }
  }

  const randomSuffix = crypto.randomBytes(4).toString("hex");
  const filename = `${isImage ? "img" : "audio"}_${Date.now()}_${randomSuffix}${ext}`;

  const targetDir = path.join(UPLOAD_ROOT, type);
  await fs.promises.mkdir(targetDir, { recursive: true });

  const destination = path.join(targetDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.promises.writeFile(destination, buffer);

  return `/uploads/soal/${type}/${filename}`;
}

/**
 * Menghapus file yang tersimpan di disk VPS jika file tersebut adalah file lokal (/uploads/...)
 */
export async function deleteUploadedFile(fileUrl?: string | null): Promise<void> {
  if (!fileUrl || typeof fileUrl !== "string") return;

  // Hanya proses jika path relatif ke /uploads/
  if (!fileUrl.startsWith("/uploads/")) return;

  try {
    const cleanPath = fileUrl.replace(/^\//, "").split("?")[0];
    const fullPath = path.join(process.cwd(), "public", cleanPath);

    // Keamanan: pastikan file berada di dalam folder public/uploads
    const resolvedPublicUploads = path.resolve(process.cwd(), "public", "uploads");
    const resolvedTarget = path.resolve(fullPath);

    if (!resolvedTarget.startsWith(resolvedPublicUploads)) {
      console.warn("Security warning: Upward directory traversal attempt detected:", fileUrl);
      return;
    }

    if (fs.existsSync(resolvedTarget)) {
      await fs.promises.unlink(resolvedTarget);
    }
  } catch (err) {
    console.error("Gagal menghapus file lama dari VPS:", err);
  }
}
