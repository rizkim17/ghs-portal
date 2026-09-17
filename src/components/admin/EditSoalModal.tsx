"use client";

import { useState } from "react";
import { updateSoal } from "@/actions/soal";
import { SECTION_TYPE_LABELS } from "@/constants/exam";

type SoalProps = {
  id: string;
  section: string;
  questionText: string;
  audioUrl?: string | null;
  imageUrl?: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string | null;
};

export default function EditSoalModal({
  soal,
  pelajaranType,
}: {
  soal: SoalProps;
  pelajaranType: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isJFT = pelajaranType === "JFT";
  const isCBT = isJFT || pelajaranType === "SSW";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await updateSoal(soal.id, formData);
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.message || "Gagal memperbarui soal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
        title="Edit Soal"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Edit Soal</h3>
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
              {isJFT && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Seksi (Section) *
                  </label>
                  <select
                    name="section"
                    required
                    defaultValue={soal.section}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary bg-white"
                  >
                    {Object.entries(SECTION_TYPE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Pertanyaan / Teks Soal *
                </label>
                <textarea
                  name="questionText"
                  required
                  rows={4}
                  defaultValue={soal.questionText}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                  placeholder="Ketik pertanyaan di sini..."
                />
              </div>

              {isCBT && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    URL Gambar (Opsional)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={soal.imageUrl || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>
              )}

              {isJFT && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    URL Audio (Opsional, untuk Choukai)
                  </label>
                  <input
                    type="url"
                    name="audioUrl"
                    defaultValue={soal.audioUrl || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="space-y-3 bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500">Pilihan Jawaban</h4>
                {[
                  { opt: "A", val: soal.optionA },
                  { opt: "B", val: soal.optionB },
                  { opt: "C", val: soal.optionC },
                  { opt: "D", val: soal.optionD },
                ].map(({ opt, val }) => (
                  <div key={opt} className="flex gap-2 items-center">
                    <span className="font-bold text-xs w-5 text-gray-600">{opt}.</span>
                    <input
                      type="text"
                      name={`option${opt}`}
                      required
                      defaultValue={val}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-primary focus:ring-primary"
                      placeholder={`Opsi ${opt}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Kunci Jawaban Benar *
                </label>
                <select
                  name="correctOption"
                  required
                  defaultValue={soal.correctOption}
                  className="w-full px-3 py-2 border border-green-200 rounded-xl bg-green-50 text-green-900 font-bold text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Penjelasan (Opsional)
                </label>
                <textarea
                  name="explanation"
                  rows={2}
                  defaultValue={soal.explanation || ""}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                  placeholder="Penjelasan jawaban benar..."
                />
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
