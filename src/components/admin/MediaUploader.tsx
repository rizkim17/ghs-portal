"use client";

import React, { useState, useRef, useEffect } from "react";

type MediaUploaderProps = {
  type: "image" | "audio";
  fileInputName: string;
  removeInputName?: string;
  currentUrl?: string | null;
  label: string;
  hint?: string;
};

export default function MediaUploader({
  type,
  fileInputName,
  removeInputName,
  currentUrl,
  label,
  hint,
}: MediaUploaderProps) {
  const isImage = type === "image";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const acceptedTypes = isImage
    ? "image/jpeg,image/png,image/webp,image/gif"
    : "audio/mpeg,audio/wav,audio/x-m4a,audio/aac,audio/ogg,audio/webm";

  const maxBytes = isImage ? 5 * 1024 * 1024 : 25 * 1024 * 1024;
  const maxMb = isImage ? 5 : 25;

  // Cleanup object URL preview saat komponen unmount atau file berganti
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateAndSetFile = (file: File) => {
    setErrorMessage("");
    if (file.size > maxBytes) {
      setErrorMessage(`Ukuran file melebihi batas maksimal ${maxMb}MB.`);
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setIsRemoved(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Pastikan jenis file sesuai
      const isFileTypeValid = isImage
        ? file.type.startsWith("image/")
        : file.type.startsWith("audio/");
      if (!isFileTypeValid) {
        setErrorMessage(
          `Format file tidak sesuai. Harap unggah file ${isImage ? "gambar" : "audio"}.`
        );
        return;
      }
      validateAndSetFile(file);
      // Sinkronkan ke input ref jika ada
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearSelectedFile = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveCurrent = () => {
    clearSelectedFile();
    setIsRemoved(true);
  };

  const handleRestoreCurrent = () => {
    setIsRemoved(false);
    clearSelectedFile();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          {label}
        </label>
        {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
      </div>

      {/* Hidden inputs untuk FormData Server Action */}
      <input
        ref={fileInputRef}
        type="file"
        name={fileInputName}
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
      {removeInputName && (
        <input
          type="hidden"
          name={removeInputName}
          value={isRemoved ? "true" : "false"}
        />
      )}

      {/* Tampilan Error jika ada */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-1.5">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Kondisi 1: Menampilkan File yang Baru Dipilih (Preview Instan) */}
      {selectedFile && previewUrl ? (
        <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary">
                File siap diunggah ke VPS
              </span>
            </div>
            <button
              type="button"
              onClick={clearSelectedFile}
              className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Batal
            </button>
          </div>

          {isImage ? (
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-200 bg-white shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatFileSize(selectedFile.size)}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Ganti file
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-900 truncate max-w-[220px] sm:max-w-xs">
                  {selectedFile.name}
                </span>
                <span className="text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
              <audio controls className="w-full h-8">
                <source src={previewUrl} type={selectedFile.type} />
                Browser tidak mendukung audio.
              </audio>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Pilih audio lain
              </button>
            </div>
          )}
        </div>
      ) : currentUrl && !isRemoved ? (
        /* Kondisi 2: File Tersimpan Sebelumnya di VPS (Mode Edit) */
        <div className="p-3 sm:p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-200 text-gray-700">
              <svg
                className="w-3 h-3 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Tersimpan di VPS
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Ganti File
              </button>
              {removeInputName && (
                <button
                  type="button"
                  onClick={handleRemoveCurrent}
                  className="text-xs font-semibold text-red-600 hover:underline inline-flex items-center gap-1"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>

          {isImage ? (
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUrl}
                alt="Media soal"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-200 bg-white shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-mono truncate">
                  {currentUrl}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Klik &quot;Ganti File&quot; untuk mengunggah gambar baru
                  langsung ke VPS.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <audio controls className="w-full h-8">
                <source src={currentUrl} />
                Browser tidak mendukung audio.
              </audio>
              <p className="text-xs text-gray-500 font-mono truncate">
                {currentUrl}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Kondisi 3: Dropzone Area untuk Memilih / Mengunggah File */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-gray-200 hover:border-primary/50 hover:bg-gray-50/75 bg-white"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              {isImage ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </div>

            <div className="text-xs sm:text-sm text-gray-700">
              <span className="font-semibold text-primary hover:underline">
                Pilih file {isImage ? "gambar" : "audio"}
              </span>{" "}
              atau seret ke sini
            </div>

            <p className="text-[11px] text-gray-400">
              {isImage
                ? "JPG, PNG, WebP, GIF (Maksimal 5MB)"
                : "MP3, WAV, M4A, OGG, AAC (Maksimal 25MB)"}
            </p>

            {isRemoved && currentUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestoreCurrent();
                }}
                className="mt-1 text-xs text-gray-600 hover:text-gray-900 underline"
              >
                Kembalikan file sebelumnya
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
