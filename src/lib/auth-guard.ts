import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

/**
 * Mendapatkan sesi aktif. Redirect ke /login jika belum login.
 * Digunakan di Server Components / page.tsx.
 */
export async function getRequiredSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  return session;
}

/**
 * Guard yang memvalidasi role pengguna.
 * Redirect ke /dashboard jika role tidak termasuk dalam allowedRoles.
 *
 * @example
 * const session = await requireRole("SUPERADMIN", "GURU");
 */
export async function requireRole(...allowedRoles: string[]) {
  const session = await getRequiredSession();
  const role = (session.user as any)?.role;
  if (!allowedRoles.includes(role)) redirect("/dashboard");
  return session;
}
