import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: "postgresql://postgres:Suk%40mukt1@localhost:5432/ghs_portal" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Users ──
  const adminPw = await bcrypt.hash("admin123", 10);
  const siswaPw = await bcrypt.hash("siswa123", 10);
  const guruPw = await bcrypt.hash("guru123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ghs.com" },
    update: { password: adminPw },
    create: { name: "Super Admin GHS", email: "admin@ghs.com", password: adminPw, role: "SUPERADMIN" },
  });
  const siswa = await prisma.user.upsert({
    where: { email: "siswa@ghs.com" },
    update: { password: siswaPw },
    create: { name: "Budi Santoso (Siswa)", email: "siswa@ghs.com", nik: "3201123456780001", password: siswaPw, role: "SISWA" },
  });
  const guru = await prisma.user.upsert({
    where: { email: "guru@ghs.com" },
    update: { password: guruPw },
    create: { name: "Tanaka Sensei (Guru)", email: "guru@ghs.com", password: guruPw, role: "GURU" },
  });

  console.log("✅ Akun: admin@ghs.com/admin123, siswa@ghs.com/siswa123, guru@ghs.com/guru123");

  // ── Default Pelajaran ──
  await prisma.pelajaran.upsert({
    where: { id: "default-jft" },
    update: {},
    create: { id: "default-jft", type: "JFT", name: "JFT", description: "Japan Foundation Test for Basic Japanese", isDefault: true, order: 1 },
  });
  await prisma.pelajaran.upsert({
    where: { id: "default-ssw" },
    update: {},
    create: { id: "default-ssw", type: "SSW", name: "SSW", description: "Specified Skilled Worker - Ujian Keahlian Kejuruan", isDefault: true, order: 2 },
  });

  console.log("✅ Pelajaran default: JFT & SSW");
  await pool.end();
}

main().catch(console.error);
