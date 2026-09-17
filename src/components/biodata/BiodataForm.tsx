"use client";

import { useState } from "react";
import { saveBiodata } from "@/actions/biodata";

export default function BiodataForm({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    try {
      await saveBiodata(formData);
      setMessage("Data berhasil disimpan!");
    } catch (error) {
      setMessage("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {message && (
        <div className={`p-3 sm:p-4 rounded-xl text-sm font-medium ${message.includes("berhasil") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Lengkap (Kanji) *Opsional</label>
          <input type="text" name="fullNameKanji" defaultValue={initialData?.fullNameKanji || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="contoh: 山田 太郎" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Lengkap (Katakana)</label>
          <input type="text" name="fullNameKatakana" defaultValue={initialData?.fullNameKatakana || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="contoh: ヤマダ タロウ" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
          <input type="text" name="placeOfBirth" defaultValue={initialData?.placeOfBirth || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="Kota Kelahiran" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
          <input type="date" name="dateOfBirth" defaultValue={formatDate(initialData?.dateOfBirth)} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
          <select name="gender" defaultValue={initialData?.gender || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
            <option value="">Pilih...</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Golongan Darah</label>
          <select name="bloodType" defaultValue={initialData?.bloodType || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
            <option value="">Pilih...</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
          <input type="number" name="height" defaultValue={initialData?.height || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="170" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
          <input type="number" name="weight" defaultValue={initialData?.weight || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="65" />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Alamat Lengkap (Sesuai KTP)</label>
        <textarea name="address" rows={3} defaultValue={initialData?.address || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="Alamat lengkap..."></textarea>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">No. Telepon / WhatsApp</label>
        <input type="text" name="phone" defaultValue={initialData?.phone || ""} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="08xxxxxxxxxx" />
      </div>

      <button type="submit" disabled={isSaving} className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 text-sm sm:text-base">
        {isSaving ? "Menyimpan..." : "Simpan Data Diri"}
      </button>
    </form>
  );
}
