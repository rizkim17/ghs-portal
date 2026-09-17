"use client";

import { deleteUser, resetPassword } from "@/actions/users";
import { useState } from "react";
import type { UserRow } from "@/types";

export default function UserTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [resetId, setResetId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");

  const handleDelete = async (userId: string, userName: string) => {
    if (confirm(`Hapus akun "${userName}"? Semua data ujian dan biodata siswa ini akan ikut terhapus.`)) {
      await deleteUser(userId);
    }
  };

  const handleReset = async (userId: string) => {
    if (!newPass || newPass.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }
    await resetPassword(userId, newPass);
    setResetId(null);
    setNewPass("");
    alert("Password berhasil direset!");
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-primary text-white";
      case "GURU":
        return "bg-primary/10 text-primary";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nama</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email / NIK</th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Role</th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  {user.id === currentUserId && (
                    <span className="text-xs text-primary font-medium">(Anda)</span>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.email || "-"}</div>
                  <div className="text-xs text-gray-400">{user.nik || ""}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right text-sm space-x-2 whitespace-nowrap">
                  {user.id !== currentUserId && (
                    <>
                      {resetId === user.id ? (
                        <span className="inline-flex items-center space-x-2">
                          <input 
                            type="text" 
                            value={newPass} 
                            onChange={(e) => setNewPass(e.target.value)} 
                            placeholder="Password baru..."
                            className="w-28 sm:w-32 px-2 py-1 border border-gray-300 rounded-lg text-xs"
                          />
                          <button onClick={() => handleReset(user.id)} className="text-green-700 hover:text-green-900 font-medium text-xs">OK</button>
                          <button onClick={() => { setResetId(null); setNewPass(""); }} className="text-gray-400 hover:text-gray-600 font-medium text-xs">Batal</button>
                        </span>
                      ) : (
                        <>
                          <button onClick={() => setResetId(user.id)} className="text-primary hover:text-primary-hover font-medium text-xs sm:text-sm">
                            Reset PW
                          </button>
                          <button onClick={() => handleDelete(user.id, user.name)} className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm">
                            Hapus
                          </button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                  Belum ada akun yang dibuat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
