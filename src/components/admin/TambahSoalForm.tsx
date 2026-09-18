"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSoal } from "@/actions/soal";
import { SECTION_TYPE_LABELS } from "@/constants/exam";
import MediaUploader from "@/components/admin/MediaUploader";
import OptionItemRow from "@/components/admin/OptionItemRow";

export default function TambahSoalForm({
  babId,
  pelajaranId,
  pelajaranType,
}: {
  babId: string;
  pelajaranId: string;
  pelajaranType: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [stayOnPage, setStayOnPage] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Jumlah pilihan ganda dinamis (minimal A & B, maksimal A, B, C, D)
  const [activeOptions, setActiveOptions] = useState<Array<"A" | "B" | "C" | "D">>(["A", "B", "C", "D"]);
  const [correctOption, setCorrectOption] = useState<"A" | "B" | "C" | "D">("A");

  const isJFT = pelajaranType === "JFT";
  const isSSW = pelajaranType === "SSW";
  const isCBT = isJFT || isSSW;

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
      // Jika C dihapus, maka D juga harus dihapus agar urutan tetap konsisten A, B
      setActiveOptions(["A", "B"]);
      if (correctOption === "C" || correctOption === "D") setCorrectOption("A");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      await createSoal(formData);

      if (stayOnPage) {
        setSuccessMessage("Soal berhasil disimpan! Siap input soal berikutnya.");
        formRef.current?.reset();
        setFormKey((prev) => prev + 1);
        setCorrectOption("A");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(`/dashboard/admin/bank-soal/${pelajaranId}/${babId}`);
      }
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan soal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} key={formKey} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="babId" value={babId} />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs sm:text-sm text-green-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Seksi (Khusus JFT) */}
      {isJFT && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Seksi Ujian JFT <span className="text-red-500">*</span>
          </label>
          <select
            name="section"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary bg-white"
          >
            <option value="">Pilih Seksi...</option>
            {Object.entries(SECTION_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Pertanyaan */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Pertanyaan / Teks Soal <span className="text-red-500">*</span>
        </label>
        <textarea
          name="questionText"
          required
          rows={3}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary leading-relaxed"
          placeholder="Tuliskan instruksi atau pertanyaan soal..."
        />
      </div>

      {/* Upload Media Soal (Gambar & Audio Utama) */}
      {(isCBT || isJFT) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {isCBT && (
            <MediaUploader
              type="image"
              fileInputName="imageFile"
              label="Gambar Soal"
            />
          )}

          {isJFT && (
            <MediaUploader
              type="audio"
              fileInputName="audioFile"
              label="Audio Soal (Choukai)"
            />
          )}
        </div>
      )}

      {/* Pilihan Jawaban Fleksibel (2 - 4 Opsi) dengan Gambar Opsi */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Pilihan Jawaban & Kunci Benar <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-gray-400">
              Pilih lingkaran untuk kunci benar. Lampirkan gambar jika pilihan berupa ilustrasi.
            </p>
          </div>

          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {activeOptions.length} Pilihan
          </span>
        </div>

        <div className="space-y-2">
          {activeOptions.map((opt) => (
            <OptionItemRow
              key={opt}
              label={opt}
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

        {/* Tombol Tambah Opsi C / D jika kurang dari 4 */}
        {activeOptions.length < 4 && (
          <button
            type="button"
            onClick={handleAddOption}
            className="w-full py-2 border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 rounded-xl text-xs font-semibold text-primary inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Pilihan {activeOptions.length === 2 ? "C" : "D"}</span>
          </button>
        )}
      </div>

      {/* Penjelasan (Opsional) */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Penjelasan / Pembahasan <span className="text-[11px] font-normal text-gray-400">(Opsional)</span>
        </label>
        <textarea
          name="explanation"
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
          placeholder="Penjelasan ringkas jawaban benar..."
        />
      </div>

      {/* Footer / Tombol Aksi */}
      <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={stayOnPage}
            onChange={(e) => setStayOnPage(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 cursor-pointer"
          />
          <span className="text-xs text-gray-600">
            Tambah soal lagi setelah simpan
          </span>
        </label>

        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/admin/bank-soal/${pelajaranId}/${babId}`}
            className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs sm:text-sm font-medium transition-colors text-center"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-primary text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary-hover shadow-xs transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            <span>{loading ? "Menyimpan..." : "Simpan Soal"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
