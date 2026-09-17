import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth-guard";
import { notFound } from "next/navigation";
import ExamEngine from "@/components/exam/ExamEngine";
import CBTEngine from "@/components/exam/CBTEngine";
import { JFT_CONFIG, SECTION_TYPE_LABELS } from "@/constants/exam";

export default async function UjianBabPage({ params }: { params: Promise<{ babId: string }> }) {
  const session = await getRequiredSession();
  const userId = (session.user as any).id;
  const { babId } = await params;

  const bab = await prisma.bab.findUnique({
    where: { id: babId },
    select: {
      id: true, title: true, durationMinutes: true, maxScore: true, passingScore: true, maxSoalShown: true,
      pelajaran: { select: { type: true } },
    },
  });

  if (!bab) return notFound();

  const isJFT = bab.pelajaran.type === "JFT";
  const isSSW = bab.pelajaran.type === "SSW";
  const isCBT = isJFT || isSSW;

  // Ambil semua soal (tanpa correctOption)
  const allSoal = await prisma.soal.findMany({
    where: { babId },
    select: { id: true, questionText: true, optionA: true, optionB: true, optionC: true, optionD: true, section: true, audioUrl: true, imageUrl: true },
  });

  if (allSoal.length === 0) {
    return <div className="text-center py-20"><p className="text-gray-500">Belum ada soal untuk ujian ini.</p></div>;
  }

  // ── CBT (JFT / SSW) ──
  if (isCBT && bab.durationMinutes > 0) {
    let sections: string[];
    let selectedSoal = allSoal;

    if (isJFT) {
      sections = [...JFT_CONFIG.SECTIONS];
      // Random N soal PER SEKSI
      const soalBySection: Record<string, typeof allSoal> = {};
      sections.forEach((s) => { soalBySection[s] = []; });
      allSoal.forEach((s) => { if (soalBySection[s.section]) soalBySection[s.section].push(s); });

      selectedSoal = [];
      for (const sec of sections) {
        const secSoal = soalBySection[sec];
        // Fisher-Yates shuffle
        for (let i = secSoal.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [secSoal[i], secSoal[j]] = [secSoal[j], secSoal[i]];
        }
        selectedSoal.push(...secSoal.slice(0, bab.maxSoalShown));
      }
    } else {
      sections = [...new Set(allSoal.map((s) => s.section))];
      if (sections.length === 0) sections = ["GENERAL"];
      // SSW: random total
      for (let i = allSoal.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allSoal[i], allSoal[j]] = [allSoal[j], allSoal[i]];
      }
      selectedSoal = allSoal.slice(0, bab.maxSoalShown);
    }

    return (
      <CBTEngine
        babId={bab.id} babTitle={bab.title} userId={userId}
        soalList={selectedSoal} durationMinutes={bab.durationMinutes}
        maxScore={bab.maxScore} passingScore={bab.passingScore}
        sections={sections} sectionLabels={SECTION_TYPE_LABELS}
        maxAudioPlays={isJFT ? JFT_CONFIG.MAX_AUDIO_PLAYS : 2}
      />
    );
  }

  // ── Standar (BAB) — tanpa timer ──
  // Fisher-Yates shuffle + ambil maxSoalShown
  for (let i = allSoal.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSoal[i], allSoal[j]] = [allSoal[j], allSoal[i]];
  }
  const selectedSoal = allSoal.slice(0, bab.maxSoalShown);

  return <ExamEngine babId={bab.id} babTitle={bab.title} userId={userId} soalList={selectedSoal} />;
}
