import Link from "next/link";

export default function Programs() {
  const programs = [
    {
      id: "tg",
      title: "Tokutei Ginou (TG)",
      description: "Program pekerja berketerampilan spesifik untuk bekerja di Jepang dengan standar gaji tinggi dan hak-hak yang setara dengan pekerja lokal.",
      icon: (
        <svg className="w-7 sm:w-8 h-7 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "magang",
      title: "Magang Jepang",
      description: "Program pemagangan teknis bagi lulusan SMK/SMA sederajat untuk mendapatkan pengalaman kerja internasional sekaligus penghasilan.",
      icon: (
        <svg className="w-7 sm:w-8 h-7 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: "bahasa",
      title: "Pelatihan Bahasa Jepang",
      description: "Kelas intensif persiapan bahasa Jepang dari level dasar (N5) hingga lanjutan (N3) yang diampu oleh pengajar tersertifikasi.",
      icon: (
        <svg className="w-7 sm:w-8 h-7 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    }
  ];

  return (
    <section id="program" className="py-16 sm:py-20 bg-surface-muted px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-xs sm:text-sm font-bold text-primary tracking-wider uppercase mb-2">Program Kami</h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Pilih Jalur Suksesmu</h3>
          <div className="w-16 sm:w-20 h-1.5 bg-primary rounded-full mx-auto mt-4 sm:mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-50 hover-lift transition-all">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 sm:mb-6">
                {prog.icon}
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{prog.title}</h4>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                {prog.description}
              </p>
              <Link href={`#${prog.id}`} className="text-primary font-medium hover:text-primary-hover inline-flex items-center gap-2 text-sm sm:text-base">
                Pelajari Lebih Lanjut
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
