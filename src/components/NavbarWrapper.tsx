"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = ['/sign-in', '/sign-up', '/u'].some(path => pathname.startsWith(path));

  if (hideNavbar) return null;

  return <Navbar />;
}
