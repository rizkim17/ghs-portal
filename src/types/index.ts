// ============================================================
// Shared TypeScript types — GHS Portal
// ============================================================

/** Soal aman untuk client (tanpa correctOption) */
export type SoalClient = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  section: string;
  audioUrl?: string | null;
  imageUrl?: string | null;
};

/** Hasil evaluasi ujian standar */
export type ExamResult = {
  score: number;
  isPassed: boolean;
  correctCount: number;
  totalSoal: number;
};

/** Hasil evaluasi ujian CBT */
export type CBTExamResult = ExamResult & {
  timeSpentSeconds: number;
  sectionScores?: Record<string, number>;
  maxScore: number;
  passingScore: number;
};

/** Baris data user untuk tabel manajemen */
export type UserRow = {
  id: string;
  name: string;
  email: string | null;
  nik: string | null;
  role: string;
  createdAt: string;
};
