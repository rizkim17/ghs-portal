// ============================================================
// Konstanta konfigurasi ujian GHS Portal
// ============================================================

/** Jumlah soal acak default per bab/ujian */
export const DEFAULT_MAX_SOAL = 20;

// ── Label ExamType ──────────────────────────────────────────

export const EXAM_TYPE_LABELS: Record<string, string> = {
  JFT: "JFT-Basic CBT",
  SSW: "SSW Tokutei Ginou",
  BAB: "Pelajaran Per Bab",
};

export const EXAM_TYPE_COLORS: Record<string, string> = {
  JFT: "bg-primary/10 text-primary",
  SSW: "bg-gray-100 text-gray-700",
  BAB: "bg-primary/10 text-primary",
};

// ── Konfigurasi JFT-Basic CBT ───────────────────────────────

export const JFT_CONFIG = {
  MAX_SCORE: 250,
  PASSING_SCORE: 200,
  DURATION_MINUTES: 60,
  MAX_AUDIO_PLAYS: 2,
  DEFAULT_SOAL_PER_SECTION: 15,
  SECTIONS: [
    "JFT_MOJI_KOTOBA",
    "JFT_KAIWA_HYOUGEN",
    "JFT_CHOUKAI",
    "JFT_DOKKAI",
  ] as const,
  SECTION_LABELS: {
    JFT_MOJI_KOTOBA: "Huruf & Kosakata (文字・語彙)",
    JFT_KAIWA_HYOUGEN: "Percakapan & Ungkapan (会話・表現)",
    JFT_CHOUKAI: "Pemahaman Mendengarkan (聴解)",
    JFT_DOKKAI: "Pemahaman Membaca (読解)",
  } as Record<string, string>,
} as const;

// ── Label SSW Sector ────────────────────────────────────────

export const SSW_SECTOR_LABELS: Record<string, string> = {
  NONE: "-",
  KAIGO: "Kaigo (Perawat Lansia)",
  INSHOKURYOHIN_SEIZO: "Pengolahan Makanan & Minuman",
  GAISHOKU: "Restoran & F&B",
  NOGYO: "Pertanian & Peternakan",
  KENSETSU: "Konstruksi",
};

// ── Label Section Type ──────────────────────────────────────

export const SECTION_TYPE_LABELS: Record<string, string> = {
  GENERAL: "Umum",
  JFT_MOJI_KOTOBA: "Moji & Kotoba",
  JFT_KAIWA_HYOUGEN: "Kaiwa & Hyougen",
  JFT_CHOUKAI: "Choukai (Listening)",
  JFT_DOKKAI: "Dokkai (Reading)",
  SSW_GAKKA: "Teori (Gakka)",
  SSW_JITSUGI: "Praktik (Jitsugi)",
};

// ── Publish Status ──────────────────────────────────────────

export const PUBLISH_STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
};

export const PUBLISH_STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-gray-100 text-gray-500",
};
