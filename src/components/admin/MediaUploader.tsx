"use client";

import React, { useState, useRef, useEffect } from "react";

type MediaUploaderProps = {
  type: "image" | "audio";
  fileInputName: string;
  removeInputName?: string;
  currentUrl?: string | null;
  label?: string;
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
      setErrorMessage(`Ukuran file melebihi ${maxMb}MB.`);
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
      const isFileTypeValid = isImage
        ? file.type.startsWith("image/")
        : file.type.startsWith("audio/");
      if (!isFileTypeValid) {
        setErrorMessage(
          `Harap pilih file ${isImage ? "gambar (JPG/PNG)" : "audio (MP3/WAV)"}.`
        );
        return;
      }
      validateAndSetFile(file);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasActiveFile = (selectedFile && previewUrl) || (currentUrl && !isRemoved);
  const activeUrl = selectedFile && previewUrl ? previewUrl : currentUrl;

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-700">
            {label}
          </label>
          {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
        </div>
      )}

      {/* Hidden File Input & Remove Input */}
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

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Mode 1: File Sudah Dipilih / Tersimpan */}
      {hasActiveFile ? (
        <div className="flex items-center justify-between gap-3 p-2 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeUrl || ""}
                alt="Preview"
                className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-white shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {selectedFile ? selectedFile.name : isImage ? "Gambar Terlampir" : "Audio Terlampir"}
                </p>
                {selectedFile && (
                  <span className="text-[10px] text-gray-400 shrink-0">
                    ({formatFileSize(selectedFile.size)})
                  </span>
                )}
              </div>
              {!isImage && activeUrl && (
                <audio controls className="w-full max-w-[220px] sm:max-w-xs h-6 mt-1">
                  <source src={activeUrl} />
                </audio>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Ganti File"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={selectedFile ? clearSelectedFile : handleRemoveCurrent}
              className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
              title="Hapus File"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: Belum Ada File (Simple Compact Button) */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-dashed cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary hover:bg-gray-50 bg-white"
          }`}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            {isImage ? (
              <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
            <span className="font-medium text-gray-800">
              {isImage ? "Unggah Gambar" : "Unggah Audio Choukai"}
            </span>
            <span className="text-[11px] text-gray-400">
              ({isImage ? "Maks 5MB" : "Maks 25MB"})
            </span>
          </div>

          <span className="text-xs font-semibold text-primary hover:underline shrink-0">
            Pilih
          </span>
        </div>
      )}
    </div>
  );
}
