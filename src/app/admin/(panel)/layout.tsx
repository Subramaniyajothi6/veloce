import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin — VELOCE Motors",
  robots: { index: false, follow: false },
};

const navCls =
  "font-mono text-[0.72rem] tracking-[0.2em] uppercase text-ash hover:text-cream transition-colors";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAuth();

  return (
    <div className="min-h-svh bg-night text-cream">
      <header className="border-b border-line sticky top-0 z-10 bg-night/90 backdrop-blur">
        <div className="wrap flex items-center justify-between gap-6 py-4 flex-wrap">
          <div className="flex items-center gap-8 flex-wrap">
            <Link
              href="/admin"
              className="font-display uppercase tracking-wide text-veloce"
            >
              VELOCE Admin
            </Link>
            <nav className="flex gap-6">
              <Link href="/admin" className={navCls}>
                Dashboard
              </Link>
              <Link href="/admin/cars" className={navCls}>
                Cars
              </Link>
              <Link href="/admin/bookings" className={navCls}>
                Bookings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className={navCls}>
              View site ↗
            </Link>
            <form action={logout}>
              <button className="font-mono text-[0.72rem] tracking-[0.2em] uppercase text-ash hover:text-veloce transition-colors">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="wrap py-10">{children}</main>
    </div>
  );
}
