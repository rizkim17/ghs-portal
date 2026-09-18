"use client";

import React, { useState, useRef, useEffect } from "react";
import ImageLibraryModal from "@/components/admin/ImageLibraryModal";

type OptionItemRowProps = {
  label: "A" | "B" | "C" | "D";
  defaultValue?: string;
  initialImageUrl?: string | null;
  isCorrect: boolean;
  onSelectCorrect: () => void;
  placeholder?: string;
  isOptional?: boolean;
  textInputName: string;
  imageInputName: string;
  removeImageInputName: string;
};

export default function OptionItemRow({
  label,
  defaultValue = "",
  initialImageUrl = null,
  isCorrect,
  onSelectCorrect,
  placeholder,
  isOptional = false,
  textInputName,
  imageInputName,
  removeImageInputName,
}: OptionItemRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSavedImageUrl(null);
      setIsImageRemoved(false);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setSavedImageUrl(url);
    setIsImageRemoved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setSavedImageUrl(null);
    setIsImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const activeImageUrl =
    selectedFile && previewUrl
      ? previewUrl
      : savedImageUrl
      ? savedImageUrl
      : !isImageRemoved
      ? initialImageUrl
      : null;

  const currentSavedValue = savedImageUrl || (!selectedFile && !isImageRemoved && initialImageUrl ? initialImageUrl : "");

  return (
    <div className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
      isCorrect ? "border-green-400 bg-green-50/20" : "border-gray-200 bg-white hover:border-gray-300"
    }`}>
      {/* Hidden file input & remove image flag */}
      <input
        ref={fileInputRef}
        type="file"
        name={imageInputName}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="hidden"
        name={`option${label}Image`}
        value={currentSavedValue}
      />
      <input
        type="hidden"
        name={removeImageInputName}
        value={isImageRemoved ? "true" : "false"}
      />

      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Radio Button Kunci Jawaban */}
        <label
          onClick={onSelectCorrect}
          className="flex items-center gap-1.5 cursor-pointer select-none shrink-0"
          title={`Pilih ${label} sebagai kunci jawaban benar`}
        >
          <input
            type="radio"
            name="correctOption"
            value={label}
            checked={isCorrect}
            onChange={onSelectCorrect}
            className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
          />
          <span className={`font-bold text-xs sm:text-sm w-4 text-center ${isCorrect ? "text-green-700" : "text-gray-700"}`}>
            {label}.
          </span>
        </label>

        {/* Input Teks Pilihan */}
        <div className="flex-1 min-w-0 relative">
          <input
            type="text"
            name={textInputName}
            defaultValue={defaultValue}
            placeholder={
              placeholder ||
              (isOptional
                ? `Teks pilihan ${label} (opsional)`
                : `Teks pilihan ${label} (wajib jika tanpa gambar)`)
            }
            className="w-full px-2.5 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:border-primary focus:ring-primary bg-transparent text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Tombol Lampirkan Gambar / Thumbnail Preview */}
        {activeImageUrl ? (
          <div className="relative group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImageUrl}
              alt={`Gambar Opsi ${label}`}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm hover:bg-red-700 transition-colors"
              title="Hapus gambar pilihan ini"
            >
              &times;
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 shrink-0">
            {/* Tombol Pilih Gambar yang Sudah Diunggah */}
            <button
              type="button"
              onClick={() => setIsLibraryOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg border border-gray-200 hover:border-primary text-xs flex items-center gap-1 transition-colors"
              title={`Pilih gambar yang sudah diunggah untuk pilihan ${label}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline text-[11px] font-medium">Pilih</span>
            </button>

            {/* Tombol Unggah Langsung dari Komputer */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg border border-dashed border-gray-300 hover:border-primary text-xs flex items-center gap-1 transition-colors"
              title={`Unggah gambar baru dari perangkat untuk pilihan ${label}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="hidden sm:inline text-[11px] font-medium">+ Unggah</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Galeri Gambar Tersimpan */}
      <ImageLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={handleSelectFromLibrary}
        currentSelectedUrl={savedImageUrl}
        title={`Pilih Gambar — Pilihan ${label}`}
      />
    </div>
  );
}
