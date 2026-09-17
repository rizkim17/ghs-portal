import Image from "next/image";
import Link from "next/link";

const WA_NUMBER = "6281234567890";
const WA_MESSAGE = encodeURIComponent("Halo, saya ingin mendaftar di LPK GHS. Mohon informasinya.");

export default function Hero() {
  return (
    <section className="relative bg-secondary py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-12 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs sm:text-sm mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Pendaftaran Gelombang 2 Dibuka
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Wujudkan Mimpimu <br />
            Berkarir di <span className="text-primary">Jepang</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            LPK GHS adalah lembaga pelatihan resmi yang membantu Anda meraih sukses melalui program Tokutei Ginou dan Magang dengan pelatihan bahasa dan skill tersertifikasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <a 
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-primary text-white px-8 py-3.5 rounded-2xl font-medium text-center hover-lift shadow-card transition-all text-sm sm:text-base"
            >
              Daftar Sekarang
            </a>
            <Link 
              href="#program" 
              className="w-full sm:w-auto bg-white text-primary border border-gray-200 px-8 py-3.5 rounded-2xl font-medium text-center hover-lift shadow-soft transition-all text-sm sm:text-base"
            >
              Lihat Program
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="aspect-square bg-gradient-to-tr from-primary/20 to-secondary rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
            {/* Placeholder for actual hero image */}
            <div className="w-full h-full bg-white/50 backdrop-blur-sm rounded-2xl border border-white/40 flex items-center justify-center text-gray-400 text-sm sm:text-base">
              [ Ilustrasi / Foto Kegiatan LPK ]
            </div>
            
            {/* Floating badge */}
            <div className="absolute top-4 sm:top-8 left-4 sm:-left-4 bg-white p-3 sm:p-4 rounded-2xl shadow-card flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-full text-green-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium">Tingkat Kelulusan</p>
                <p className="font-bold text-foreground text-xs sm:text-sm">98% Tersalurkan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
