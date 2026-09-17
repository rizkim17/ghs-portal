"use client";

import { useState } from "react";
import { createUser } from "@/actions/users";

export default function CreateUserForm() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setMessage("");

    const formData = new FormData(form);
    const res = await createUser(formData);

    if (res?.error) {
      setMessage(res.error);
      setIsError(true);
    } else {
      setMessage("Akun berhasil dibuat!");
      setIsError(false);
      form.reset();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Buat Akun Baru</h2>

      {message && (
        <div className={`p-3 rounded-xl text-sm font-medium mb-4 ${isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
          <input type="text" name="name" required className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="Budi Santoso" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="budi@gmail.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
          <input type="text" name="nik" className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="3201..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input type="text" name="password" required className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="password123" />
          <p className="text-xs text-gray-400 mt-1">Password awal yang bisa diganti siswa nanti.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
          <select name="role" required className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
            <option value="SISWA">Siswa</option>
            <option value="GURU">Guru / Staf</option>
            <option value="SUPERADMIN">Super Admin</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50">
          {loading ? "Memproses..." : "+ Buat Akun"}
        </button>
      </form>
    </div>
  );
}
