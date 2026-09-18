"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSoal } from "@/actions/soal";
import { SECTION_TYPE_LABELS } from "@/constants/exam";
import MediaUploader from "@/components/admin/MediaUploader";

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
  const [formKey, setFormKey] = useState(0); // Untuk reset bersih MediaUploader

  const isJFT = pelajaranType === "JFT";
  const isSSW = pelajaranType === "SSW";
  const isCBT = isJFT || isSSW;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      await createSoal(formData);

      if (stayOnPage) {
        setSuccessMessage("Soal berhasil disimpan! Formulir siap untuk soal berikutnya.");
        formRef.current?.reset();
        setFormKey((prev) => prev + 1); // Reset state MediaUploader
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(`/dashboard/admin/bank-soal/${pelajaranId}/${babId}`);
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat menyimpan soal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} key={formKey} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="babId" value={babId} />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-start gap-2.5">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold">Gagal Menyimpan Soal</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-sm text-green-800 flex items-start gap-2.5">
          <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold">{successMessage}</p>
            <p className="text-xs text-green-700 mt-0.5">Silakan isi formulir di bawah untuk menambahkan soal baru lagi.</p>
          </div>
        </div>
      )}

      {/* Bagian / Seksi (Khusus JFT) */}
      {isJFT && (
        <div className="bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-gray-100">
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Seksi Ujian (Section) <span className="text-red-500">*</span>
          </label>
          <select
            name="section"
            required
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-primary focus:ring-primary text-sm"
          >
            <option value="">-- Pilih Seksi Soal JFT --</option>
            {Object.entries(SECTION_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Pilih bagian kompetensi yang diuji (contoh: Choukai untuk soal audio mendengarkan).
          </p>
        </div>
      )}

      {/* Pertanyaan / Teks Soal */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1.5">
          Pertanyaan / Teks Soal <span className="text-red-500">*</span>
        </label>
        <textarea
          name="questionText"
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary leading-relaxed"
          placeholder="Ketik instruksi atau teks pertanyaan di sini..."
        />
      </div>

      {/* Upload Media (Gambar & Audio) */}
      {(isCBT || isJFT) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
          {isCBT && (
            <MediaUploader
              type="image"
              fileInputName="imageFile"
              label="Gambar Ilustrasi Soal"
              hint="Opsional • Disimpan di VPS"
            />
          )}

          {isJFT && (
            <MediaUploader
              type="audio"
              fileInputName="audioFile"
              label="Audio Soal (Choukai)"
              hint="Opsional • Disimpan di VPS"
            />
          )}
        </div>
      )}

      {/* Pilihan Jawaban A, B, C, D */}
      <div className="space-y-3 bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-gray-100">
        <div>
          <h3 className="font-bold text-sm text-gray-900">Pilihan Jawaban</h3>
          <p className="text-xs text-gray-500 mt-0.5">Isi seluruh pilihan ganda untuk butir soal ini.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
          {["A", "B", "C", "D"].map((opt) => (
            <div key={opt} className="flex gap-2.5 items-center bg-white p-2.5 rounded-xl border border-gray-200">
              <span className="font-bold text-sm w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 shrink-0">
                {opt}
              </span>
              <input
                type="text"
                name={`option${opt}`}
                required
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-primary"
                placeholder={`Isi pilihan ${opt}...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Kunci Jawaban Benar & Penjelasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Kunci Jawaban Benar <span className="text-red-500">*</span>
          </label>
          <select
            name="correctOption"
            required
            className="w-full px-3.5 py-2.5 border border-green-300 rounded-xl bg-green-50/70 text-green-900 font-bold text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="A">Pilihan A</option>
            <option value="B">Pilihan B</option>
            <option value="C">Pilihan C</option>
            <option value="D">Pilihan D</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">Jawaban yang dihitung benar oleh sistem CBT.</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Penjelasan / Pembahasan <span className="text-xs font-normal text-gray-400">(Opsional)</span>
          </label>
          <textarea
            name="explanation"
            rows={3}
            className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary"
            placeholder="Pembahasan ringkas jawaban benar..."
          />
        </div>
      </div>

      {/* Opsi Tetap di Halaman & Aksi Simpan */}
      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={stayOnPage}
            onChange={(e) => setStayOnPage(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
          />
          <span className="text-xs sm:text-sm text-gray-700">
            Tetap di halaman ini untuk menginput soal berikutnya
          </span>
        </label>

        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/dashboard/admin/bank-soal/${pelajaranId}/${babId}`}
            className="px-4 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors text-center"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover shadow-xs transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
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
