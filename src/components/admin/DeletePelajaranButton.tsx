"use client";

import { deletePelajaran } from "@/actions/pelajaran";
import { useState } from "react";

export default function DeletePelajaranButton({ id, name }: { id: string; name?: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Hapus pelajaran "${name || id}" beserta semua bab dan soal di dalamnya?`)) return;
    setLoading(true);
    try {
      await deletePelajaran(id);
    } catch (err: any) {
      alert(err?.message || "Gagal menghapus pelajaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus Pelajaran"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span>{loading ? "..." : "Hapus"}</span>
    </button>
  );
}
