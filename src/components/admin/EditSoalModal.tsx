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

  const [correctOption, setCorrectOption] = useState<string>(soal.correctOption || "A");

  const isJFT = pelajaranType === "JFT";
  const isCBT = isJFT || pelajaranType === "SSW";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const optA = ((formData.get("optionA") as string) || "").trim();
    const optB = ((formData.get("optionB") as string) || "").trim();
    const optC = ((formData.get("optionC") as string) || "").trim();
    const optD = ((formData.get("optionD") as string) || "").trim();
    const optAImg = formData.get("optionAImageFile") as File | null;
    const optBImg = formData.get("optionBImageFile") as File | null;
    const optCImg = formData.get("optionCImageFile") as File | null;
    const optDImg = formData.get("optionDImageFile") as File | null;
    const remA = formData.get("removeOptionAImage") === "true";
    const remB = formData.get("removeOptionBImage") === "true";
    const remC = formData.get("removeOptionCImage") === "true";
    const remD = formData.get("removeOptionDImage") === "true";

    const optAUrl = (formData.get("optionAImage") as string) || "";
    const optBUrl = (formData.get("optionBImage") as string) || "";
    const optCUrl = (formData.get("optionCImage") as string) || "";
    const optDUrl = (formData.get("optionDImage") as string) || "";

    const hasA = optA.length > 0 || (optAImg && optAImg.size > 0) || (optAUrl.length > 0 && !remA);
    const hasB = optB.length > 0 || (optBImg && optBImg.size > 0) || (optBUrl.length > 0 && !remB);
    const hasC = optC.length > 0 || (optCImg && optCImg.size > 0) || (optCUrl.length > 0 && !remC);
    const hasD = optD.length > 0 || (optDImg && optDImg.size > 0) || (optDUrl.length > 0 && !remD);

    if (!hasA || !hasB) {
      setError("Pilihan A dan B wajib diisi (berupa teks atau gambar).");
      setLoading(false);
      return;
    }

    if (hasD && !hasC) {
      setError("Pilihan C harus diisi terlebih dahulu jika ingin menggunakan pilihan D.");
      setLoading(false);
      return;
    }

    if (correctOption === "C" && !hasC) {
      setError("Pilihan C dipilih sebagai kunci jawaban, tetapi pilihan C belum diisi.");
      setLoading(false);
      return;
    }

    if (correctOption === "D" && !hasD) {
      setError("Pilihan D dipilih sebagai kunci jawaban, tetapi pilihan D belum diisi.");
      setLoading(false);
      return;
    }

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

              {/* Pilihan Jawaban (A & B Wajib, C & D Opsional) */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-700">
                    Pilihan Jawaban & Kunci Benar <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md shrink-0">
                    A & B Wajib &bull; C & D Opsional
                  </span>
                </div>

                <div className="space-y-2">
                  {(["A", "B", "C", "D"] as const).map((opt) => (
                    <OptionItemRow
                      key={opt}
                      label={opt}
                      defaultValue={soal[`option${opt}`] || ""}
                      initialImageUrl={soal[`option${opt}Image`]}
                      isCorrect={correctOption === opt}
                      onSelectCorrect={() => setCorrectOption(opt)}
                      isOptional={opt === "C" || opt === "D"}
                      placeholder={
                        opt === "A"
                          ? "Teks pilihan A (wajib jika tanpa gambar)"
                          : opt === "B"
                          ? "Teks pilihan B (wajib jika tanpa gambar)"
                          : opt === "C"
                          ? "Teks pilihan C (opsional)"
                          : "Teks pilihan D (opsional, kosongkan jika 2 atau 3 pilihan)"
                      }
                      textInputName={`option${opt}`}
                      imageInputName={`option${opt}ImageFile`}
                      removeImageInputName={`removeOption${opt}Image`}
                    />
                  ))}
                </div>
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
