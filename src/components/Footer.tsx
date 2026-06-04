import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
              GHS Portal
            </Link>
            <p className="text-gray-500 mb-6 max-w-sm">
              Lembaga Pelatihan Kerja yang berdedikasi membimbing dan mempersiapkan generasi muda untuk berkarir sukses di Jepang.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Program</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">Tokutei Ginou (TG)</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">Magang Jepang</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">Pelatihan Bahasa</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Pusat Bantuan</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">Alur Pendaftaran</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">Kontak Kami</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} LPK GHS. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
