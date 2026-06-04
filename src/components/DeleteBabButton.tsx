"use client";

import { deleteBab } from "@/app/actions/ujian";

export default function DeleteBabButton({ babId }: { babId: string }) {
  const handleDelete = async () => {
    if (confirm("Hapus bab ini beserta semua soalnya? Aksi ini tidak bisa dibatalkan.")) {
      await deleteBab(babId);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="text-red-500 hover:text-red-700 font-medium text-sm"
    >
      Hapus
    </button>
  );
}
