import Link from "next/link";

import type { User } from "@supabase/supabase-js";

import { UserMenu } from "@/components/layout/user-menu";

type AppShellProps = {
  user: User;
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="bf-lab-bg min-h-screen text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/85 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 font-mono text-xs font-bold text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.25)]"
              aria-hidden
            >
              BF
            </span>
            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-white transition group-hover:text-cyan-200">
                BOTAFARM
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-fuchsia-400/85">
                Mission Control
              </p>
            </div>
          </Link>
          <UserMenu email={user.email ?? "grower"} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
