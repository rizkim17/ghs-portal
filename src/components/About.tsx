import Image from "next/image";

export default function About() {
  return (
    <section id="tentang" className="py-20 lg:py-24 px-6 sm:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-2">Tentang LPK GHS</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">Kenapa Memilih LPK GHS?</h3>
          <div className="w-20 h-1.5 bg-primary rounded-full mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gray-100 overflow-hidden shadow-soft flex items-center justify-center text-gray-400">
              [ Foto / Dokumentasi Kelas ]
            </div>
            
            {/* Stats Badge */}
            <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-primary text-white p-6 rounded-3xl shadow-card">
              <div className="text-4xl font-bold mb-1">5+</div>
              <div className="text-primary-100 text-sm font-medium">Tahun Pengalaman</div>
            </div>
          </div>
          
          {/* Text Side */}
          <div>
            <h4 className="text-2xl font-bold text-foreground mb-4">
              Membuka Jalan Menuju Masa Depan Gemilang di Jepang
            </h4>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Lembaga Pelatihan Kerja GHS adalah institusi resmi dan terakreditasi yang berfokus pada pengembangan sumber daya manusia Indonesia agar memiliki kompetensi standar internasional.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Kami tidak hanya mengajarkan bahasa Jepang, tetapi juga membekali peserta dengan etos kerja, budaya disiplin, dan keahlian spesifik yang sangat dibutuhkan oleh perusahaan-perusahaan ternama di Jepang.
            </p>
            
            <div className="space-y-4">
              <FeatureItem title="Fasilitas Lengkap & Modern" description="Ruang kelas yang nyaman, asrama yang terjamin, dan lingkungan belajar kondusif." />
              <FeatureItem title="Instruktur Berpengalaman" description="Dibimbing langsung oleh praktisi dan native speaker yang berpengalaman di Jepang." />
              <FeatureItem title="Koneksi Perusahaan Luas" description="Bekerjasama dengan lebih dari 50 perusahaan penerima di Jepang." />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div>
        <h5 className="font-semibold text-foreground text-lg">{title}</h5>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
}
