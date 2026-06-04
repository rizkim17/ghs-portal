"use client";

import { useState } from "react";
import { submitExam } from "@/app/actions/ujian";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Soal = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
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
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center mt-10">
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${result.isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {result.isPassed ? (
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          ) : (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          )}
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {result.isPassed ? "Lulus!" : "Belum Lulus"}
        </h2>
        <p className="text-gray-500 mb-8">
          Anda menjawab benar {result.correctCount} dari {result.totalSoal} soal.
        </p>
        <div className="text-6xl font-extrabold text-primary mb-8">
          {result.score}
        </div>
        <Link href="/dashboard/ujian" className="inline-block bg-primary text-white font-medium px-8 py-3 rounded-xl hover:bg-primary-hover transition-colors">
          Kembali ke Daftar Ujian
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10 py-4 px-6 rounded-b-2xl shadow-sm flex justify-between items-center mb-8">
        <div>
          <h2 className="font-bold text-lg text-foreground">{babTitle}</h2>
          <p className="text-sm text-gray-500">Soal Terjawab: {Object.keys(answers).length} / {soalList.length}</p>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Mengumpulkan..." : "Kumpulkan Ujian"}
        </button>
      </div>

      <div className="space-y-8">
        {soalList.map((soal, index) => (
          <div key={soal.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex">
              <span className="mr-3 font-bold text-gray-400">{index + 1}.</span> 
              <span>{soal.questionText}</span>
            </h3>

            <div className="space-y-3">
              {[
                { key: 'A', text: soal.optionA },
                { key: 'B', text: soal.optionB },
                { key: 'C', text: soal.optionC },
                { key: 'D', text: soal.optionD },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleOptionSelect(soal.id, opt.key)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start ${
                    answers[soal.id] === opt.key 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-gray-100 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <span className="font-bold mr-3 w-5">{opt.key}.</span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
