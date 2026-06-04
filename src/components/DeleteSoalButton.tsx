"use client";

import { deleteSoal } from "@/app/actions/ujian";

export default function DeleteSoalButton({ soalId, babId }: { soalId: string; babId: string }) {
  const handleDelete = async () => {
    if (confirm("Hapus soal ini? Aksi ini tidak bisa dibatalkan.")) {
      await deleteSoal(soalId, babId);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg"
    >
      Hapus
    </button>
  );
}
