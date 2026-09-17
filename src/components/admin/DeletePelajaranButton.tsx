"use client";

import { deletePelajaran } from "@/actions/pelajaran";

export default function DeletePelajaranButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("Hapus pelajaran ini beserta semua bab dan soalnya?")) return;
    await deletePelajaran(id);
  };

  return (
    <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
      Hapus
    </button>
  );
}
