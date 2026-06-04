import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LPK GHS Portal - Solusi Terbaik Magang ke Jepang",
  description: "Website resmi dan portal siswa LPK GHS untuk program magang Jepang, Tokutei Ginou, dan pelatihan bahasa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface">
        {children}
      </body>
    </html>
  );
}
