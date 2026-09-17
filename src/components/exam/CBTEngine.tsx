"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { submitExam } from "@/actions/exam";
import Link from "next/link";
import type { SoalClient } from "@/types";

type CBTEngineProps = {
  babId: string;
  babTitle: string;
  userId: string;
  soalList: SoalClient[];
  durationMinutes: number;
  maxScore: number;
  passingScore: number;
  sections: string[];
  sectionLabels: Record<string, string>;
  maxAudioPlays: number;
};

type CBTResult = {
  score: number;
  isPassed: boolean;
  correctCount: number;
  totalSoal: number;
  maxScore: number;
  passingScore: number;
  timeSpentSeconds: number;
  sectionScores?: Record<string, number>;
};

export default function CBTEngine({
  babId, babTitle, userId, soalList, durationMinutes,
  maxScore, passingScore, sections, sectionLabels, maxAudioPlays,
}: CBTEngineProps) {
  // ── State ──
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lockedSections, setLockedSections] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [audioPlayCounts, setAudioPlayCounts] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CBTResult | null>(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const startTimeRef = useRef(Date.now());

  // ── Soal dikelompokkan per seksi ──
  const soalBySection: Record<string, SoalClient[]> = {};
  sections.forEach((sec) => { soalBySection[sec] = []; });
  soalList.forEach((s) => {
    if (soalBySection[s.section]) {
      soalBySection[s.section].push(s);
    }
  });

  const currentSection = sections[currentSectionIndex];
  const currentSectionSoal = soalBySection[currentSection] || [];
  const currentSoal = currentSectionSoal[currentQuestionIndex];

  // ── Timer ──
  useEffect(() => {
    if (result) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [result]);

  // ── Auto-submit saat waktu habis ──
  useEffect(() => {
    if (timeRemaining === 0 && !result && !isSubmitting) {
      handleSubmit();
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ── Handlers ──
  const handleOptionSelect = (soalId: string, optionKey: string) => {
    setAnswers((prev) => ({ ...prev, [soalId]: optionKey }));
  };

  const handleAudioPlay = (soalId: string) => {
    setAudioPlayCounts((prev) => ({
      ...prev,
      [soalId]: (prev[soalId] || 0) + 1,
    }));
  };

  const handleNextSection = () => {
    setShowSectionModal(true);
  };

  const confirmNextSection = () => {
    setLockedSections((prev) => new Set(prev).add(currentSectionIndex));
    setCurrentSectionIndex((prev) => prev + 1);
    setCurrentQuestionIndex(0);
    setShowSectionModal(false);
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      const res = await submitExam(babId, userId, answers, timeSpent);
      setResult(res as CBTResult);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengumpulkan ujian.");
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, babId, userId, isSubmitting]);

  // ── Hitung statistik ──
  const totalAnswered = Object.keys(answers).length;
  const sectionAnswered = currentSectionSoal.filter((s) => answers[s.id]).length;
  const isLastSection = currentSectionIndex === sections.length - 1;
  const isTimeCritical = timeRemaining <= 300; // < 5 menit

  // ═══════════ RESULT SCREEN ═══════════
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
        <p className="text-gray-500 text-sm sm:text-base mb-4">Benar {result.correctCount} dari {result.totalSoal} soal</p>
        <div className="text-5xl sm:text-6xl font-extrabold text-primary mb-2">{result.score}</div>
        <p className="text-gray-400 text-xs sm:text-sm mb-6">dari {maxScore} (Batas lulus: {passingScore})</p>

        {result.sectionScores && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Skor Per Seksi</h3>
            <div className="space-y-2">
              {Object.entries(result.sectionScores).map(([sec, score]) => (
                <div key={sec} className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">{sectionLabels[sec] || sec}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs sm:text-sm text-gray-400 mb-6">Waktu: {formatTime(result.timeSpentSeconds)}</p>
        <Link href="/dashboard/ujian" className="w-full sm:w-auto inline-block bg-primary text-white font-medium px-8 py-3 rounded-xl hover:bg-primary-hover transition-colors text-sm sm:text-base">
          Kembali ke Daftar Ujian
        </Link>
      </div>
    );
  }

  // ═══════════ EXAM SCREEN ═══════════
  return (
    <div className="max-w-4xl mx-auto pb-16 sm:pb-20">
      {/* ── Header: Timer + Section Info ── */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-20 py-3 px-4 sm:px-6 rounded-b-2xl shadow-sm mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h2 className="font-bold text-base sm:text-lg text-foreground">{babTitle}</h2>
          <div className={`font-mono text-lg sm:text-xl font-bold px-3 sm:px-4 py-1.5 rounded-xl flex items-center justify-center gap-2 ${isTimeCritical ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-800'}`}>
            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1.5 overflow-x-auto">
          {sections.map((sec, idx) => {
            const isLocked = lockedSections.has(idx);
            const isCurrent = idx === currentSectionIndex;
            const secSoal = soalBySection[sec] || [];
            const secAnswered = secSoal.filter((s) => answers[s.id]).length;
            return (
              <button
                key={sec}
                disabled={isLocked || idx !== currentSectionIndex}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                  isCurrent ? 'bg-primary text-white' :
                  isLocked ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed' :
                  'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLocked && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                {sectionLabels[sec] || sec} ({secAnswered}/{secSoal.length})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Question Navigator ── */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <p className="text-xs text-gray-400 mb-2 font-medium">Navigasi Soal — {sectionLabels[currentSection]}</p>
        <div className="flex flex-wrap gap-2">
          {currentSectionSoal.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                idx === currentQuestionIndex ? 'bg-primary text-white ring-2 ring-primary/30' :
                answers[s.id] ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Current Question ── */}
      {currentSoal && (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 mb-6">
          <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
            Soal {currentQuestionIndex + 1} dari {currentSectionSoal.length}
          </p>

          {/* Audio Player */}
          {currentSoal.audioUrl && (
            <div className="mb-4 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                  Audio Soal
                </span>
                <span className={`text-xs font-semibold ${(audioPlayCounts[currentSoal.id] || 0) >= maxAudioPlays ? 'text-red-500' : 'text-primary'}`}>
                  Sisa putar: {Math.max(0, maxAudioPlays - (audioPlayCounts[currentSoal.id] || 0))}x
                </span>
              </div>
              <audio
                controls
                controlsList="nodownload"
                className="w-full"
                onPlay={(e) => {
                  const plays = audioPlayCounts[currentSoal.id] || 0;
                  if (plays >= maxAudioPlays) {
                    e.currentTarget.pause();
                  } else {
                    handleAudioPlay(currentSoal.id);
                  }
                }}
              >
                <source src={currentSoal.audioUrl} />
              </audio>
              {(audioPlayCounts[currentSoal.id] || 0) >= maxAudioPlays && (
                <p className="text-xs text-red-500 mt-1 font-medium">Batas pemutaran audio telah tercapai.</p>
              )}
            </div>
          )}

          {/* Image */}
          {currentSoal.imageUrl && (
            <div className="mb-4">
              <img src={currentSoal.imageUrl} alt="Soal" className="max-h-60 rounded-xl border border-gray-200 object-contain w-full sm:w-auto" />
            </div>
          )}

          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 break-words">{currentSoal.questionText}</h3>

          <div className="space-y-2.5 sm:space-y-3">
            {[
              { key: 'A', text: currentSoal.optionA },
              { key: 'B', text: currentSoal.optionB },
              { key: 'C', text: currentSoal.optionC },
              { key: 'D', text: currentSoal.optionD },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleOptionSelect(currentSoal.id, opt.key)}
                className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all flex items-start text-sm sm:text-base ${
                  answers[currentSoal.id] === opt.key
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-gray-100 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <span className="font-bold mr-3 w-5">{opt.key}.</span>
                <span className="break-words flex-1">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom Navigation ── */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Sebelumnya
        </button>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
          {currentQuestionIndex < currentSectionSoal.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
            >
              Berikutnya 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          ) : !isLastSection ? (
            <button
              onClick={handleNextSection}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
            >
              Lanjut Seksi Berikutnya 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Mengumpulkan..." : "Kumpulkan Ujian"}
              {!isSubmitting && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
            </button>
          )}
        </div>
      </div>

      {/* ── Section Transition Modal ── */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-center text-foreground mb-2">Pindah Seksi?</h3>
            <p className="text-center text-gray-500 text-sm mb-2">
              Anda akan meninggalkan <strong>{sectionLabels[currentSection]}</strong> dan melanjutkan ke <strong>{sectionLabels[sections[currentSectionIndex + 1]]}</strong>.
            </p>
            <p className="text-center text-red-500 text-sm font-semibold mb-6">
              ⚠ Setelah berpindah, Anda TIDAK DAPAT kembali ke seksi ini.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSectionModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={confirmNextSection}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all flex justify-center items-center gap-2"
              >
                Ya, Lanjut 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
