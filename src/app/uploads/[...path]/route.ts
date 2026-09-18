import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/m4a",
  ".aac": "audio/aac",
  ".ogg": "audio/ogg",
  ".webm": "audio/webm",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;

  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const relativePath = pathSegments.join("/");
  const fullPath = path.join(process.cwd(), "public", "uploads", relativePath);

  // Pencegahan Directory Traversal
  const baseUploads = path.resolve(process.cwd(), "public", "uploads");
  const resolvedPath = path.resolve(fullPath);

  if (!resolvedPath.startsWith(baseUploads)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(resolvedPath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const stat = fs.statSync(resolvedPath);
  const fileSize = stat.size;

  const range = request.headers.get("range");

  // Dukungan HTTP 206 Partial Content untuk audio streaming & seeking
  if (range && contentType.startsWith("audio/")) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${fileSize}`,
        },
      });
    }

    const chunkSize = end - start + 1;
    const nodeStream = fs.createReadStream(resolvedPath, { start, end });
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new Response(webStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Pengiriman file utuh (Status 200)
  const nodeStream = fs.createReadStream(resolvedPath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new Response(webStream, {
    status: 200,
    headers: {
      "Content-Length": fileSize.toString(),
      "Accept-Ranges": "bytes",
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
