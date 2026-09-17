import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavbarClient from "@/components/landing/NavbarClient";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return <NavbarClient isLoggedIn={!!session} />;
}
