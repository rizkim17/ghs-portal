"use client";

import { useState } from "react";
import { submitExam } from "@/actions/exam";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Soal = {
  id: string;
  questionText: string;
  optionA?: string | null;
  optionB?: string | null;
  optionC?: string | null;
  optionD?: string | null;
  optionAImage?: string | null;
  optionBImage?: string | null;
  optionCImage?: string | null;
  optionDImage?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
};

export default function ExamEngine({
  babId,
  babTitle,
  userId,
  soalList
}: {
  babId: string;
  babTitle: string;
  userId: string;
  soalList: Soal[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; isPassed: boolean; correctCount: number; totalSoal: number } | null>(null);

  const handleOptionSelect = (soalId: string, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [soalId]: optionKey
    }));
  };

  const handleSubmit = async () => {
    // Validasi apakah semua soal sudah dijawab
    if (Object.keys(answers).length < soalList.length) {
      if (!confirm("Anda belum menjawab semua soal! Yakin ingin menyelesaikan ujian?")) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await submitExam(babId, userId, answers);
      setResult(res);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengumpulkan ujian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 max-w-xl mx-auto text-center mt-6 sm:mt-10">
        <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${result.isPassed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {result.isPassed ? (
             <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          ) : (
            <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {result.isPassed ? "Lulus!" : "Belum Lulus"}
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          Anda menjawab benar {result.correctCount} dari {result.totalSoal} soal.
        </p>
        <div className="text-5xl sm:text-6xl font-extrabold text-primary mb-6">
          {result.score}
        </div>
        <Link href="/dashboard/ujian" className="w-full sm:w-auto inline-block bg-primary text-white font-medium px-8 py-3 rounded-xl hover:bg-primary-hover transition-colors text-sm sm:text-base">
          Kembali ke Daftar Ujian
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16 sm:pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-10 py-3 px-4 sm:px-6 rounded-b-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h2 className="font-bold text-base sm:text-lg text-foreground">{babTitle}</h2>
          <p className="text-xs sm:text-sm text-gray-500">Soal Terjawab: {Object.keys(answers).length} / {soalList.length}</p>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-primary text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Mengumpulkan..." : "Kumpulkan Ujian"}
        </button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {soalList.map((soal, index) => (
          <div key={soal.id} className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 flex">
              <span className="mr-3 font-bold text-gray-400">{index + 1}.</span> 
              <span className="break-words flex-1">{soal.questionText}</span>
            </h3>

            {soal.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden max-w-md">
                <img src={soal.imageUrl} alt="Ilustrasi soal" className="w-full h-auto object-cover rounded-xl" />
              </div>
            )}

            {soal.audioUrl && (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl max-w-md">
                <p className="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Audio Soal
                </p>
                <audio controls className="w-full h-8">
                  <source src={soal.audioUrl} />
                  Browser Anda tidak mendukung pemutar audio.
                </audio>
              </div>
            )}

            <div className="space-y-2.5 sm:space-y-3">
              {[
                { key: 'A', text: soal.optionA, image: soal.optionAImage },
                { key: 'B', text: soal.optionB, image: soal.optionBImage },
                { key: 'C', text: soal.optionC, image: soal.optionCImage },
                { key: 'D', text: soal.optionD, image: soal.optionDImage },
              ]
                .filter((opt) => opt.text || opt.image)
                .map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleOptionSelect(soal.id, opt.key)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-sm sm:text-base ${
                      answers[soal.id] === opt.key 
                        ? 'border-primary bg-primary/5 text-primary font-medium' 
                        : 'border-gray-100 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <span className="font-bold w-5 shrink-0 pt-0.5">{opt.key}.</span>
                    <div className="flex-1 space-y-2">
                      {opt.image && (
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={opt.image}
                            alt={`Pilihan ${opt.key}`}
                            className="max-h-36 sm:max-h-48 rounded-lg border border-gray-200 object-contain bg-white"
                          />
                        </div>
                      )}
                      {opt.text && <span className="break-words block">{opt.text}</span>}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
