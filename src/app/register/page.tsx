"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Daftar Akun <span className="text-primary">Baru</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-soft sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <div className="mt-1">
                <input name="name" type="text" required className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Budi Santoso" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1">
                <input name="email" type="email" required className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="budi@gmail.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">NIK (Nomor Induk Kependudukan)</label>
              <div className="mt-1">
                <input name="nik" type="text" required className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="3201..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input name="password" type="password" required className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Minimal 6 karakter" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-card text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed hover-lift">
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
