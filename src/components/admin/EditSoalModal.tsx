"use client";

import { useState } from "react";
import { updateSoal } from "@/actions/soal";
import { SECTION_TYPE_LABELS } from "@/constants/exam";
import MediaUploader from "@/components/admin/MediaUploader";
import OptionItemRow from "@/components/admin/OptionItemRow";

type SoalProps = {
  id: string;
  section: string;
  questionText: string;
  audioUrl?: string | null;
  imageUrl?: string | null;
  optionA?: string | null;
  optionB?: string | null;
  optionC?: string | null;
  optionD?: string | null;
  optionAImage?: string | null;
  optionBImage?: string | null;
  optionCImage?: string | null;
  optionDImage?: string | null;
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

  const getInitialOptions = (): Array<"A" | "B" | "C" | "D"> => {
    const opts: Array<"A" | "B" | "C" | "D"> = ["A", "B"];
    if (soal.optionC || soal.optionCImage) opts.push("C");
    if (soal.optionD || soal.optionDImage) {
      if (!opts.includes("C")) opts.push("C");
      opts.push("D");
    }
    return opts;
  };

  const [activeOptions, setActiveOptions] = useState<Array<"A" | "B" | "C" | "D">>(getInitialOptions());
  const [correctOption, setCorrectOption] = useState<string>(soal.correctOption || "A");

  const isJFT = pelajaranType === "JFT";
  const isCBT = isJFT || pelajaranType === "SSW";

  const handleAddOption = () => {
    if (activeOptions.length === 2) {
      setActiveOptions(["A", "B", "C"]);
    } else if (activeOptions.length === 3) {
      setActiveOptions(["A", "B", "C", "D"]);
    }
  };

  const handleRemoveOption = (opt: "C" | "D") => {
    if (opt === "D") {
      setActiveOptions((prev) => prev.filter((o) => o !== "D") as any);
      if (correctOption === "D") setCorrectOption("A");
    } else if (opt === "C") {
      setActiveOptions(["A", "B"]);
      if (correctOption === "C" || correctOption === "D") setCorrectOption("A");
    }
  };

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
        onClick={() => {
          setActiveOptions(getInitialOptions());
          setCorrectOption(soal.correctOption || "A");
          setIsOpen(true);
        }}
        className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
        title="Edit Soal"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Edit Soal</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                  {error}
                </div>
              )}

              {isJFT && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Seksi Ujian JFT *
                  </label>
                  <select
                    name="section"
                    required
                    defaultValue={soal.section}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary bg-white"
                  >
                    {Object.entries(SECTION_TYPE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pertanyaan / Teks Soal *
                </label>
                <textarea
                  name="questionText"
                  required
                  rows={3}
                  defaultValue={soal.questionText}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
                  placeholder="Ketik pertanyaan di sini..."
                />
              </div>

              {/* Upload Media Soal (Gambar & Audio Utama) */}
              {(isCBT || isJFT) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {isCBT && (
                    <MediaUploader
                      type="image"
                      fileInputName="imageFile"
                      removeInputName="removeImage"
                      currentUrl={soal.imageUrl}
                      label="Gambar Soal"
                    />
                  )}

                  {isJFT && (
                    <MediaUploader
                      type="audio"
                      fileInputName="audioFile"
                      removeInputName="removeAudio"
                      currentUrl={soal.audioUrl}
                      label="Audio Choukai"
                    />
                  )}
                </div>
              )}

              {/* Pilihan Jawaban Fleksibel & Gambar Opsi */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-700">
                    Pilihan Jawaban & Kunci Benar <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {activeOptions.length} Pilihan
                  </span>
                </div>

                <div className="space-y-2">
                  {activeOptions.map((opt) => (
                    <OptionItemRow
                      key={opt}
                      label={opt}
                      defaultValue={soal[`option${opt}`] || ""}
                      initialImageUrl={soal[`option${opt}Image`]}
                      isCorrect={correctOption === opt}
                      onSelectCorrect={() => setCorrectOption(opt)}
                      canDelete={opt === "C" || opt === "D"}
                      onDelete={opt === "C" || opt === "D" ? () => handleRemoveOption(opt) : undefined}
                      textInputName={`option${opt}`}
                      imageInputName={`option${opt}ImageFile`}
                      removeImageInputName={`removeOption${opt}Image`}
                    />
                  ))}
                </div>

                {activeOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="w-full py-1.5 border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 rounded-xl text-xs font-semibold text-primary inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tambah Pilihan {activeOptions.length === 2 ? "C" : "D"}</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Penjelasan <span className="text-[11px] font-normal text-gray-400">(Opsional)</span>
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
