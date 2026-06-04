"use client";

import { useState } from "react";
import { saveBiodata } from "@/app/actions/biodata";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.includes("berhasil") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap (Kanji) *Opsional</label>
          <input type="text" name="fullNameKanji" defaultValue={initialData?.fullNameKanji || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="contoh: 山田 太郎" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap (Katakana)</label>
          <input type="text" name="fullNameKatakana" defaultValue={initialData?.fullNameKatakana || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="contoh: ヤマダ タロウ" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
          <input type="text" name="placeOfBirth" defaultValue={initialData?.placeOfBirth || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
          <input type="date" name="dateOfBirth" defaultValue={formatDate(initialData?.dateOfBirth)} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
          <select name="gender" defaultValue={initialData?.gender || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
            <option value="">Pilih...</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Golongan Darah</label>
          <select name="bloodType" defaultValue={initialData?.bloodType || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
            <option value="">Pilih...</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tinggi Badan (cm)</label>
          <input type="number" name="height" defaultValue={initialData?.height || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Berat Badan (kg)</label>
          <input type="number" name="weight" defaultValue={initialData?.weight || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Alamat Lengkap (Sesuai KTP)</label>
        <textarea name="address" rows={3} defaultValue={initialData?.address || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">No. Telepon / WhatsApp</label>
        <input type="text" name="phone" defaultValue={initialData?.phone || ""} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
      </div>

      <button type="submit" disabled={isSaving} className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50">
        {isSaving ? "Menyimpan..." : "Simpan Data Diri"}
      </button>
    </form>
  );
}
