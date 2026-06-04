import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Anda dapat menambahkan logika khusus berdasarkan role di sini nantinya
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Hanya rute-rute ini yang membutuhkan otentikasi login
  matcher: [
    "/dashboard/:path*",
    "/ujian/:path*",
    "/biodata/:path*"
  ],
};
