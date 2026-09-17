"use client";

import { useState } from "react";
import { updateBab } from "@/actions/bab";
import { SSW_SECTOR_LABELS } from "@/constants/exam";

type BabProps = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  maxSoalShown: number;
  durationMinutes: number;
  passingScore: number;
  maxScore: number;
  sswSector: string;
  status: "PUBLISHED" | "DRAFT";
};

export default function EditBabModal({
  bab,
  pelajaranType,
}: {
  bab: BabProps;
  pelajaranType: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCBT = pelajaranType === "JFT" || pelajaranType === "SSW";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await updateBab(bab.id, formData);
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.message || "Gagal memperbarui ujian/bab.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors inline-flex items-center gap-1"
        title="Edit Ujian/Bab"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span>Edit</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Edit {pelajaranType === "BAB" ? "Bab" : "Ujian"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-xs sm:text-sm font-medium bg-red-50 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Judul / Nama {pelajaranType === "BAB" ? "Bab" : "Ujian"} *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={bab.title}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={bab.description || ""}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Urutan *
                  </label>
                  <input
                    type="number"
                    name="order"
                    required
                    defaultValue={bab.order}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    name="status"
                    defaultValue={bab.status}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary bg-white"
                  >
                    <option value="PUBLISHED">Published (Bisa diakses)</option>
                    <option value="DRAFT">Draft (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              {pelajaranType === "SSW" && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Sektor SSW *
                  </label>
                  <select
                    name="sswSector"
                    defaultValue={bab.sswSector}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary bg-white"
                  >
                    {Object.entries(SSW_SECTOR_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isCBT && (
                  <>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Durasi (Menit)
                      </label>
                      <input
                        type="number"
                        name="durationMinutes"
                        required
                        defaultValue={bab.durationMinutes}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Skor Maksimal
                      </label>
                      <input
                        type="number"
                        name="maxScore"
                        required
                        defaultValue={bab.maxScore}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Passing Score (Batas Lulus)
                      </label>
                      <input
                        type="number"
                        name="passingScore"
                        required
                        defaultValue={bab.passingScore}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </>
                )}
                <div className={isCBT ? "" : "sm:col-span-2"}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {pelajaranType === "JFT" ? "Soal per Seksi" : "Maksimal Soal Ditampilkan"}
                  </label>
                  <input
                    type="number"
                    name="maxSoalShown"
                    defaultValue={bab.maxSoalShown}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2 bg-primary text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
