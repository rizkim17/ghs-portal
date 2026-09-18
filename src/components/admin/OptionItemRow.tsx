"use client";

import React, { useState, useRef, useEffect } from "react";

type OptionItemRowProps = {
  label: "A" | "B" | "C" | "D";
  defaultValue?: string;
  initialImageUrl?: string | null;
  isCorrect: boolean;
  onSelectCorrect: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
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
  canDelete = false,
  onDelete,
  textInputName,
  imageInputName,
  removeImageInputName,
}: OptionItemRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

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
      setIsImageRemoved(false);
    }
  };

  const removeImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const activeImageUrl = selectedFile && previewUrl ? previewUrl : !isImageRemoved ? initialImageUrl : null;

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
        <input
          type="text"
          name={textInputName}
          defaultValue={defaultValue}
          placeholder={`Teks pilihan ${label} (opsional jika ada gambar)`}
          className="flex-1 min-w-0 px-2.5 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:border-primary focus:ring-primary bg-transparent text-gray-900"
        />

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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 sm:px-2 sm:py-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg border border-dashed border-gray-300 hover:border-primary text-xs flex items-center gap-1 shrink-0 transition-colors"
            title={`Lampirkan gambar untuk pilihan ${label}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline text-[11px] font-medium">+ Gambar</span>
          </button>
        )}

        {/* Tombol Hapus Opsi (khusus C & D) */}
        {canDelete && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
            title={`Hapus pilihan ${label}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
