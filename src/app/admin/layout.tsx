import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();

  return (
    <AppShell user={user}>
      <nav className="bf-glass bf-glass-shine mb-8 flex flex-wrap gap-2 rounded-2xl p-2">
        <Link
          href="/dashboard"
          className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:text-cyan-200"
        >
          Mission Control
        </Link>
        <Link
          href="/admin/brain"
          className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:text-amber-200"
        >
          Brain Admin
        </Link>
        <Link
          href="/admin/brain/book-map"
          className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:text-cyan-200"
        >
          Book map
        </Link>
        <Link
          href="/admin/brain/ingestion"
          className="rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-500/80 px-4 py-2.5 text-sm font-medium text-black"
        >
          Ingestion
        </Link>
      </nav>
      {children}
    </AppShell>
  );
}
