"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { fetchUploadedMedia, uploadMediaDirect, deleteUploadedMediaItem } from "@/actions/soal";
import type { StoredMediaItem } from "@/lib/storage";

type MediaLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentSelectedUrl?: string | null;
  type?: "image" | "audio";
  title?: string;
};

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  currentSelectedUrl = null,
  type = "image",
  title,
}: MediaLibraryModalProps) {
  const isImage = type === "image";
  const defaultTitle = isImage ? "Pilih Gambar Tersimpan" : "Pilih Audio Tersimpan";
  const modalTitle = title || defaultTitle;

  const [items, setItems] = useState<StoredMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentSelectedUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentSelectedUrl || null);
      setErrorMsg("");
      setSearchQuery("");
      loadMedia();
    }
  }, [isOpen, currentSelectedUrl, type]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await fetchUploadedMedia(isImage ? "images" : "audio");
      setItems(data);
    } catch (err: any) {
      setErrorMsg(err?.message || `Gagal memuat daftar ${isImage ? "gambar" : "audio"}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const newItem = await uploadMediaDirect(formData, isImage ? "images" : "audio");
      setItems((prev) => [newItem, ...prev]);
      setSelectedUrl(newItem.url);
    } catch (err: any) {
      setErrorMsg(err?.message || `Gagal mengunggah ${isImage ? "gambar" : "audio"} baru.`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, item: StoredMediaItem) => {
    e.stopPropagation();
    if (!confirm(`Yakin ingin menghapus ${isImage ? "gambar" : "audio"} "${item.filename}"?`)) {
      return;
    }

    try {
      await deleteUploadedMediaItem(item.url);
      setItems((prev) => prev.filter((it) => it.url !== item.url));
      if (selectedUrl === item.url) {
        setSelectedUrl(null);
      }
    } catch (err: any) {
      alert(err?.message || "Gagal menghapus file.");
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((it) => it.filename.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const selectedItem = useMemo(() => {
    return items.find((it) => it.url === selectedUrl);
  }, [items, selectedUrl]);

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Modal */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{modalTitle}</h3>
            <p className="text-xs text-gray-500">
              {isImage
                ? "Pilih gambar yang sudah pernah diunggah atau unggah file baru."
                : "Pilih file audio yang sudah pernah diunggah atau unggah audio baru."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar (Pencarian & Tombol Unggah Baru) */}
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Input Pencarian */}
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari nama file ${isImage ? "gambar" : "audio"}...`}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Tombol Unggah Baru */}
          <div className="flex items-center gap-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept={
                isImage
                  ? "image/jpeg,image/png,image/webp,image/gif"
                  : "audio/mpeg,audio/wav,audio/x-m4a,audio/aac,audio/ogg,audio/webm"
              }
              onChange={handleUploadNew}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-3.5 py-1.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary-hover shadow-xs transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              {uploading ? (
                <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              )}
              <span>{uploading ? "Mengunggah..." : "+ Unggah Baru"}</span>
            </button>
          </div>
        </div>

        {/* Notifikasi Error */}
        {errorMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg("")} className="text-red-500 font-bold ml-2">
              &times;
            </button>
          </div>
        )}

        {/* Konten Galeri Media */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[260px] max-h-[50vh]">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse p-2 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                {isImage ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800">
                {searchQuery ? "Tidak ada file yang cocok." : `Belum ada ${isImage ? "gambar" : "audio"} yang diunggah.`}
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                {searchQuery
                  ? "Coba gunakan kata kunci pencarian yang lain."
                  : `Klik tombol '+ Unggah Baru' di atas untuk menambahkan ${isImage ? "gambar" : "audio"} pertama.`}
              </p>
            </div>
          ) : isImage ? (
            /* Mode Grid Gambar */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
              {filteredItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.url}
                    onClick={() => setSelectedUrl(item.url)}
                    onDoubleClick={handleConfirm}
                    className={`relative p-2 rounded-xl border-2 transition-all cursor-pointer flex flex-col group ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    <div className="aspect-square w-full rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden mb-2 border border-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-gray-800 truncate" title={item.filename}>
                        {item.filename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
                        <span>{formatFileSize(item.size)}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(e, item)}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity p-0.5"
                          title="Hapus file (hanya jika tidak dipakai)"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Mode List Audio */
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.url}
                    onClick={() => setSelectedUrl(item.url)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2 group ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-900 truncate" title={item.filename}>
                            {item.filename}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && (
                          <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            Dipilih
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(e, item)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity p-1"
                          title="Hapus file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Audio Player Preview */}
                    <audio controls className="w-full h-8" preload="none">
                      <source src={item.url} />
                    </audio>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Modal (Info Terpilih & Aksi) */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {selectedItem ? (
              <>
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.filename}
                    className="w-9 h-9 rounded-lg object-cover border border-gray-200 bg-white shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {selectedItem.filename}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {formatFileSize(selectedItem.size)} &bull; Klik gunakan untuk memasang
                  </p>
                </div>
              </>
            ) : (
              <span className="text-xs text-gray-400 italic">
                Belum ada {isImage ? "gambar" : "audio"} yang dipilih
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={!selectedUrl}
              onClick={handleConfirm}
              className="px-5 py-2 bg-primary text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary-hover shadow-xs transition-colors disabled:opacity-50"
            >
              {isImage ? "Gunakan Gambar Ini" : "Gunakan Audio Ini"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
