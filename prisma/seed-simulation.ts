import { PrismaClient, SectionType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: "postgresql://postgres:Suk%40mukt1@localhost:5432/ghs_portal" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Memulai seeding data simulasi ujian GHS Portal...\n");

  // ─────────────────────────────────────────────────────────────
  // 1. Pastikan Pelajaran Default (JFT & SSW) ada
  // ─────────────────────────────────────────────────────────────
  const jftPelajaran = await prisma.pelajaran.upsert({
    where: { id: 'default-jft' },
    update: {
      type: 'JFT',
      name: 'JFT',
      description: 'Japan Foundation Test for Basic Japanese',
      isDefault: true,
      order: 1,
      status: 'PUBLISHED',
    },
    create: {
      id: 'default-jft',
      type: 'JFT',
      name: 'JFT',
      description: 'Japan Foundation Test for Basic Japanese',
      isDefault: true,
      order: 1,
      status: 'PUBLISHED',
    },
  });

  const sswPelajaran = await prisma.pelajaran.upsert({
    where: { id: 'default-ssw' },
    update: {
      type: 'SSW',
      name: 'SSW',
      description: 'Specified Skilled Worker - Ujian Keahlian Kejuruan',
      isDefault: true,
      order: 2,
      status: 'PUBLISHED',
    },
    create: {
      id: 'default-ssw',
      type: 'SSW',
      name: 'SSW',
      description: 'Specified Skilled Worker - Ujian Keahlian Kejuruan',
      isDefault: true,
      order: 2,
      status: 'PUBLISHED',
    },
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Pelajaran: Minna no Nihongo 1 (type: BAB)
  // ─────────────────────────────────────────────────────────────
  const mnnPelajaran = await prisma.pelajaran.upsert({
    where: { id: 'mnn1-pelajaran' },
    update: {
      type: 'BAB',
      name: 'Minna no Nihongo 1',
      description: 'Buku teks utama pembelajaran tata bahasa, kosakata, dan percakapan dasar bahasa Jepang.',
      isDefault: false,
      order: 1,
      status: 'PUBLISHED',
    },
    create: {
      id: 'mnn1-pelajaran',
      type: 'BAB',
      name: 'Minna no Nihongo 1',
      description: 'Buku teks utama pembelajaran tata bahasa, kosakata, dan percakapan dasar bahasa Jepang.',
      isDefault: false,
      order: 1,
      status: 'PUBLISHED',
    },
  });
  console.log(`✅ Pelajaran MNN 1 siap: ${mnnPelajaran.name} (${mnnPelajaran.id})`);

  // Bab 1: Perkenalan Diri (Jikoshoukai) & Partikel は / も / の
  const mnnBab1 = await prisma.bab.upsert({
    where: { id: 'mnn1-bab-1' },
    update: {
      pelajaranId: mnnPelajaran.id,
      title: 'Bab 1: Perkenalan (Jikoshoukai) & Partikel は / も / の',
      description: 'Dasar kalimat nomina: A wa B desu, akhiran san/jin, dan partikel kepemilikan no.',
      order: 1,
      maxSoalShown: 20,
      durationMinutes: 0,
      maxScore: 100,
      passingScore: 70,
      status: 'PUBLISHED',
    },
    create: {
      id: 'mnn1-bab-1',
      pelajaranId: mnnPelajaran.id,
      title: 'Bab 1: Perkenalan (Jikoshoukai) & Partikel は / も / の',
      description: 'Dasar kalimat nomina: A wa B desu, akhiran san/jin, dan partikel kepemilikan no.',
      order: 1,
      maxSoalShown: 20,
      durationMinutes: 0,
      maxScore: 100,
      passingScore: 70,
      status: 'PUBLISHED',
    },
  });

  // Hapus soal lama sebelum re-insert
  await prisma.soal.deleteMany({ where: { babId: mnnBab1.id } });

  const soalMnnBab1 = [
    {
      questionText: 'Pilihlah partikel yang tepat untuk melengkapi kalimat berikut:\nわたし ____ サントスです。',
      optionA: 'は (wa)',
      optionB: 'が (ga)',
      optionC: 'を (o)',
      optionD: 'に (ni)',
      correctOption: 'A',
      explanation: 'Partikel は (dibaca wa) berfungsi sebagai penanda topik atau subjek dalam pola kalimat [Topik] は [Predikat] です。',
    },
    {
      questionText: 'Apa arti dari ungkapan pembuka perkenalan 「はじめまして」?',
      optionA: 'Selamat tinggal',
      optionB: 'Senang berkenalan dengan Anda (Salam pembuka perkenalan)',
      optionC: 'Terima kasih banyak',
      optionD: 'Mohon maaf',
      correctOption: 'B',
      explanation: 'はじめまして (Hajimemashite) diucapkan pertama kali saat memperkenalkan diri kepada orang yang baru pertama kali ditemui.',
    },
    {
      questionText: 'Lengkapi dialog berikut:\nA: 「ミラーさんは アメリカじんです。」\nB: 「スミスさん ____ アメリカじんです。」',
      optionA: 'は',
      optionB: 'も',
      optionC: 'の',
      optionD: 'で',
      correctOption: 'B',
      explanation: 'Partikel も (mo) digunakan untuk menyatakan kesamaan atau arti "juga" menggantikan partikel は ketika predikatnya sama.',
    },
    {
      questionText: 'Bagaimana cara menyatakan "Buku saya" dalam bahasa Jepang?',
      optionA: 'わたし の 本',
      optionB: 'わたし は 本',
      optionC: '本 の わたし',
      optionD: 'わたし と 本',
      correctOption: 'A',
      explanation: 'Partikel の (no) berfungsi menghubungkan dua kata benda untuk menyatakan kepemilikan: [Pemilik] の [Benda].',
    },
    {
      questionText: 'Lengkapi kalimat negatif berikut:\n「わたしは がくせい ____。」 (Saya bukan mahasiswa)',
      optionA: 'です',
      optionB: 'じゃ ありません',
      optionC: 'でした',
      optionD: 'あります',
      correctOption: 'B',
      explanation: 'Bentuk negatif formal masa kini dari です adalah じゃ ありません (atau ではありません).',
    },
  ];

  for (const s of soalMnnBab1) {
    await prisma.soal.create({
      data: {
        babId: mnnBab1.id,
        section: SectionType.GENERAL,
        questionText: s.questionText,
        optionA: s.optionA,
        optionB: s.optionB,
        optionC: s.optionC,
        optionD: s.optionD,
        correctOption: s.correctOption,
        explanation: s.explanation,
      },
    });
  }
  console.log(`✅ Bab 1: Perkenalan (${soalMnnBab1.length} soal) berhasil diisi.`);

  // Bab 2: Kono/Sono/Ano
  const mnnBab2 = await prisma.bab.upsert({
    where: { id: 'mnn1-bab-2' },
    update: {
      pelajaranId: mnnPelajaran.id,
      title: 'Bab 2: Kono / Sono / Ano & Kore / Sore / Are',
      description: 'Kata tunjuk penjelas nomina (kono, sono, ano) dan kata tunjuk benda mandiri (kore, sore, are).',
      order: 2,
      maxSoalShown: 20,
      durationMinutes: 0,
      maxScore: 100,
      passingScore: 70,
      status: 'PUBLISHED',
    },
    create: {
      id: 'mnn1-bab-2',
      pelajaranId: mnnPelajaran.id,
      title: 'Bab 2: Kono / Sono / Ano & Kore / Sore / Are',
      description: 'Kata tunjuk penjelas nomina (kono, sono, ano) dan kata tunjuk benda mandiri (kore, sore, are).',
      order: 2,
      maxSoalShown: 20,
      durationMinutes: 0,
      maxScore: 100,
      passingScore: 70,
      status: 'PUBLISHED',
    },
  });

  // Hapus soal lama sebelum re-insert
  await prisma.soal.deleteMany({ where: { babId: mnnBab2.id } });

  const soalMnnBab2 = [
    {
      questionText: 'Lengkapi kalimat berikut untuk benda yang posisinya dekat dengan pembicara:\n「____ ほんは わたしのです。」 (Buku ini milik saya)',
      optionA: 'この (kono)',
      optionB: 'その (sono)',
      optionC: 'あの (ano)',
      optionD: 'どの (dono)',
      correctOption: 'A',
      explanation: 'この (kono) digunakan untuk menerangkan kata benda yang posisinya dekat dengan pembicara. Pola: この + Kata Benda.',
    },
    {
      questionText: 'Manakah kalimat berikut yang tata bahasanya BENAR?',
      optionA: 'これ ほんは じしょです。',
      optionB: 'この ほんは じしょです。',
      optionC: 'この は じしょです。',
      optionD: 'これ の じしょです。',
      correctOption: 'B',
      explanation: 'この (kono) harus langsung diikuti kata benda (この + Benda). Sedangkan これ (kore) berdiri sendiri sebagai kata ganti tunjuk dan tidak dapat langsung menempel pada kata benda.',
    },
    {
      questionText: 'Benda berada dekat dengan posisi lawan bicara. Kata tunjuk benda mandiri yang tepat adalah:',
      optionA: 'これ (kore)',
      optionB: 'それ (sore)',
      optionC: 'あれ (are)',
      optionD: 'どれ (dore)',
      correctOption: 'B',
      explanation: 'それ (sore) digunakan untuk menunjuk benda yang berada dekat dengan lawan bicara (orang kedua).',
    },
    {
      questionText: 'Lengkapi percakapan berikut:\nA: 「____ ビルは なんですか。」 (Gedung yang jauh di sana itu gedung apa?)\nB: 「あれは びょういんです。」',
      optionA: 'この',
      optionB: 'その',
      optionC: 'あの',
      optionD: 'どの',
      correctOption: 'C',
      explanation: 'あの (ano) diikuti kata benda yang posisinya jauh baik dari pembicara maupun dari lawan bicara.',
    },
    {
      questionText: 'Lengkapi pertanyaan kepemilikan berikut:\nA: 「これは ____ の かさですか。」\nB: 「サントスさんのです。」',
      optionA: 'なん',
      optionB: 'だれ',
      optionC: 'どこ',
      optionD: 'いつ',
      correctOption: 'B',
      explanation: 'だれの (dare no) berarti "milik siapa" untuk menanyakan kepemilikan orang terhadap suatu benda.',
    },
  ];

  for (const s of soalMnnBab2) {
    await prisma.soal.create({
      data: {
        babId: mnnBab2.id,
        section: SectionType.GENERAL,
        questionText: s.questionText,
        optionA: s.optionA,
        optionB: s.optionB,
        optionC: s.optionC,
        optionD: s.optionD,
        correctOption: s.correctOption,
        explanation: s.explanation,
      },
    });
  }
  console.log(`✅ Bab 2: Kono/Sono/Ano (${soalMnnBab2.length} soal) berhasil diisi.`);

  // ─────────────────────────────────────────────────────────────
  // 3. JFT-Basic CBT Simulator (dibawah default-jft)
  // ─────────────────────────────────────────────────────────────
  const jftBab = await prisma.bab.upsert({
    where: { id: 'jft-2026-sim' },
    update: {
      pelajaranId: jftPelajaran.id,
      title: 'JFT 2026 Simulasi',
      description: 'Simulasi ujian JFT-Basic A2 resmi berbasis komputer (CBT) tahun 2026 terpadu 4 seksi ujian.',
      order: 1,
      durationMinutes: 60,
      maxScore: 250,
      passingScore: 200,
      maxSoalShown: 15,
      status: 'PUBLISHED',
    },
    create: {
      id: 'jft-2026-sim',
      pelajaranId: jftPelajaran.id,
      title: 'JFT 2026 Simulasi',
      description: 'Simulasi ujian JFT-Basic A2 resmi berbasis komputer (CBT) tahun 2026 terpadu 4 seksi ujian.',
      order: 1,
      durationMinutes: 60,
      maxScore: 250,
      passingScore: 200,
      maxSoalShown: 15,
      status: 'PUBLISHED',
    },
  });

  // Hapus soal lama sebelum re-insert
  await prisma.soal.deleteMany({ where: { babId: jftBab.id } });

  const soalJFT = [
    // 2 Soal JFT_MOJI_KOTOBA
    {
      section: SectionType.JFT_MOJI_KOTOBA,
      questionText: '【文字】この「漢字」の 読み方は どれですか。 → 【病院】',
      optionA: 'びょういん',
      optionB: 'びよういん',
      optionC: 'ぎょういん',
      optionD: 'だいがくいん',
      correctOption: 'A',
      explanation: '病院 dibaca びょういん (byouin = rumah sakit). Hati-hati dengan びよういん (biyouin = salon kecantikan).',
      audioUrl: null,
      imageUrl: null,
    },
    {
      section: SectionType.JFT_MOJI_KOTOBA,
      questionText: '【語彙】きのう たくさん はたらいたので、とても ____ です。',
      optionA: 'つかれました',
      optionB: 'おもしろかった',
      optionC: 'あつかった',
      optionD: 'ひまでした',
      correctOption: 'A',
      explanation: 'Setelah banyak bekerja, kondisi fisik menjadi lelah (つかれました / tsukaremashita).',
      audioUrl: null,
      imageUrl: null,
    },
    // 2 Soal JFT_KAIWA_HYOUGEN
    {
      section: SectionType.JFT_KAIWA_HYOUGEN,
      questionText: 'A「すみません、この 荷物を 手伝って ____ か。」\nB「ええ、いいですよ。」',
      optionA: 'あげます',
      optionB: 'くれます',
      optionC: 'もらえます',
      optionD: 'ください',
      correctOption: 'C',
      explanation: '～てもらえますか (~te moraemasu ka) digunakan untuk meminta tolong atau bantuan kepada lawan bicara secara sopan.',
      audioUrl: null,
      imageUrl: null,
    },
    {
      section: SectionType.JFT_KAIWA_HYOUGEN,
      questionText: '会社で 上司に「ちょっと よろしいでしょうか」と 聞くのは どんなときですか。',
      optionA: 'あいさつを するとき',
      optionB: '時間を もらって 話・相談を したいとき',
      optionC: '帰りたいとき',
      optionD: '謝りたいとき',
      correctOption: 'B',
      explanation: 'Ungkapan 「ちょっと よろしいでしょうか」 digunakan ketika meminta sedikit waktu luang atasan untuk membicarakan sesuatu atau berkonsultasi.',
      audioUrl: null,
      imageUrl: null,
    },
    // 2 Soal JFT_CHOUKAI (Audio)
    {
      section: SectionType.JFT_CHOUKAI,
      questionText: '【聴解】音声を聞いて質問に答えてください。男の人は 何時に 出発しますか。',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl: null,
      optionA: '午前 8 時 00 分',
      optionB: '午前 8 時 30 分',
      optionC: '午前 9 時 00 分',
      optionD: '午前 9 時 15 分',
      correctOption: 'B',
      explanation: 'Dalam rekaman audio, pembicara pria menyatakan akan berangkat pada pukul 08:30 (午前8時30分).',
    },
    {
      section: SectionType.JFT_CHOUKAI,
      questionText: '【聴解】案内放送を聞いてください。次の電車は 何番線から 発車しますか。',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl: null,
      optionA: '1 番線',
      optionB: '2 番線',
      optionC: '3 番線',
      optionD: '4 番線',
      correctOption: 'C',
      explanation: 'Pengumuman informasi stasiun menyebutkan bahwa kereta berikutnya akan diberangkatkan dari peron 3 (3番線).',
    },
    // 1 Soal JFT_DOKKAI (Gambar / Bacaan)
    {
      section: SectionType.JFT_DOKKAI,
      questionText: '【読解】寮の ゴミ出し ルールを 読んで 質問に 答えてください。\n\n「もえる ゴミは 火曜日と 金曜日の 朝 8 時までに ゴミステーションへ 出してください。」\n\n質問：もえる ゴミは いつ 出しますか。',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500',
      audioUrl: null,
      optionA: '月曜日と 木曜日の 夜',
      optionB: '火曜日と 金曜日の 朝 8 時まで',
      optionC: '水曜日と 土曜日の 昼',
      optionD: '毎日 いつでも よい',
      correctOption: 'B',
      explanation: 'Berdasarkan teks aturan asrama: sampah yang dapat dibakar (もえるゴミ) dibuang pada hari Selasa dan Jumat sebelum pukul 8 pagi.',
    },
  ];

  for (const s of soalJFT) {
    await prisma.soal.create({
      data: {
        babId: jftBab.id,
        section: s.section,
        questionText: s.questionText,
        optionA: s.optionA,
        optionB: s.optionB,
        optionC: s.optionC,
        optionD: s.optionD,
        correctOption: s.correctOption,
        audioUrl: s.audioUrl,
        imageUrl: s.imageUrl,
        explanation: s.explanation,
      },
    });
  }
  console.log(`✅ JFT 2026 Simulasi (${soalJFT.length} soal) berhasil diisi.`);

  // ─────────────────────────────────────────────────────────────
  // 4. SSW Kaigo Simulasi (dibawah default-ssw)
  // ─────────────────────────────────────────────────────────────
  const sswBab = await prisma.bab.upsert({
    where: { id: 'ssw-kaigo-sim' },
    update: {
      pelajaranId: sswPelajaran.id,
      title: 'SSW Kaigo Simulasi',
      description: 'Simulasi ujian kejuruan SSW Caregiver (Kaigo) mencakup teori kaigo dan analisis keselamatan kerja (KYT).',
      order: 1,
      sswSector: 'KAIGO',
      durationMinutes: 60,
      maxScore: 100,
      passingScore: 60,
      maxSoalShown: 40,
      status: 'PUBLISHED',
    },
    create: {
      id: 'ssw-kaigo-sim',
      pelajaranId: sswPelajaran.id,
      title: 'SSW Kaigo Simulasi',
      description: 'Simulasi ujian kejuruan SSW Caregiver (Kaigo) mencakup teori kaigo dan analisis keselamatan kerja (KYT).',
      order: 1,
      sswSector: 'KAIGO',
      durationMinutes: 60,
      maxScore: 100,
      passingScore: 60,
      maxSoalShown: 40,
      status: 'PUBLISHED',
    },
  });

  // Hapus soal lama sebelum re-insert
  await prisma.soal.deleteMany({ where: { babId: sswBab.id } });

  const soalSSW = [
    {
      section: SectionType.SSW_GAKKA,
      questionText: '【Teori Kaigo - 学科】Prinsip dasar pelayanan keperawatan lansia (Kaigo) yang mengutamakan kemandirian pengguna layanan sesuai kemampuan fisik dan mental mereka disebut:',
      optionA: 'Paternalisme (Keputusan sepihak perawat)',
      optionB: 'Jiritsu Shien (Dukungan Kemandirian)',
      optionC: 'Kansho (Intervensi total tanpa partisipasi lansia)',
      optionD: 'Kanri (Pengawasan ketat dan pembatasan gerak)',
      correctOption: 'B',
      explanation: 'Jiritsu Shien (自立支援) adalah prinsip utama kaigo di Jepang, yaitu memberi dukungan agar lansia dapat hidup mandiri semaksimal mungkin sesuai dengan potensi yang mereka miliki.',
      audioUrl: null,
      imageUrl: null,
    },
    {
      section: SectionType.SSW_JITSUGI,
      questionText: '【Praktik Visual KYT - 実技】Perhatikan situasi keselamatan saat membantu lansia di kamar mandi berikut. Manakah potensi bahaya kecelakaan (Kiken Yochi) yang paling berbahaya dan harus segera diantisipasi?',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500',
      audioUrl: null,
      optionA: 'Terdapat keset anti slip di depan pintu kamar mandi',
      optionB: 'Ada genangan busa sabun dan air licin di lantai dekat bak mandi',
      optionC: 'Pegangan tangan (handrail) terpasang kuat di dinding samping',
      optionD: 'Ventilasi udara ruangan bekerja lancar dan suhu ruangan hangat',
      correctOption: 'B',
      explanation: 'Lantai yang licin akibat sisa genangan air dan busa sabun sangat berisiko menyebabkan lansia tergelincir (ten-tou), yang dapat berakibat fatal seperti patah tulang panggul.',
    },
  ];

  for (const s of soalSSW) {
    await prisma.soal.create({
      data: {
        babId: sswBab.id,
        section: s.section,
        questionText: s.questionText,
        optionA: s.optionA,
        optionB: s.optionB,
        optionC: s.optionC,
        optionD: s.optionD,
        correctOption: s.correctOption,
        audioUrl: s.audioUrl,
        imageUrl: s.imageUrl,
        explanation: s.explanation,
      },
    });
  }
  console.log(`✅ SSW Kaigo Simulasi (${soalSSW.length} soal) berhasil diisi.`);

  console.log("\n✨ Seluruh data simulasi berhasil di-seed!");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
