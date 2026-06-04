export default function Testimonial() {
  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      program: "Tokutei Ginou (Manufaktur)",
      text: "Pelatihan di LPK GHS sangat disiplin dan terstruktur. Berkat bimbingan sensei, saya lulus ujian skill dan bahasa dengan mudah. Sekarang saya sudah bekerja di Osaka.",
      initial: "B"
    },
    {
      id: 2,
      name: "Siti Aminah",
      program: "Magang Jepang (Caregiver)",
      text: "Fasilitas asramanya nyaman dan sangat mendukung untuk fokus belajar bahasa Jepang. Terima kasih LPK GHS atas semua dukungannya dari nol sampai berangkat.",
      initial: "S"
    }
  ];

  return (
    <section className="py-20 bg-white px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-2">Testimoni</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">Kisah Sukses Alumni</h3>
          <div className="w-20 h-1.5 bg-primary rounded-full mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testi) => (
            <div key={testi.id} className="bg-surface-muted rounded-3xl p-8 relative">
              <div className="absolute -top-6 left-8 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-card">
                "
              </div>
              <p className="text-gray-600 mb-8 italic mt-4">
                "{testi.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                  {testi.initial}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testi.name}</h4>
                  <p className="text-sm text-gray-500">{testi.program}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
