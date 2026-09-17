import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          <div className="sm:col-span-2">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4 block">
              GHS Portal
            </Link>
            <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
              Lembaga Pelatihan Kerja yang berdedikasi membimbing dan mempersiapkan generasi muda untuk berkarir sukses di Jepang.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Program</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li><Link href="#program" className="text-gray-500 hover:text-primary transition-colors">Tokutei Ginou (TG)</Link></li>
              <li><Link href="#magang" className="text-gray-500 hover:text-primary transition-colors">Magang Jepang</Link></li>
              <li><Link href="#bahasa" className="text-gray-500 hover:text-primary transition-colors">Pelatihan Bahasa</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Pusat Bantuan</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">Alur Pendaftaran</Link></li>
              <li><Link href="#kontak" className="text-gray-500 hover:text-primary transition-colors">Kontak Kami</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} LPK GHS. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
