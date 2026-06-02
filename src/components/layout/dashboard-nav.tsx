"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", short: "CMD" },
  { href: "/dashboard/environment", label: "Environment", short: "Env" },
  { href: "/dashboard/grow-rooms", label: "Grow rooms", short: "Rooms" },
  { href: "/dashboard/journal", label: "Journal", short: "Log" },
  { href: "/dashboard/knowledge", label: "Library", short: "KB" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bf-glass bf-glass-shine mb-8 flex flex-wrap gap-2 rounded-2xl p-2">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-250 ${
              isActive
                ? "bg-gradient-to-r from-cyan-600/95 to-cyan-400/90 text-black shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                : "text-zinc-400 hover:bg-white/[0.04] hover:text-cyan-200 hover:shadow-[0_0_12px_rgba(34,211,238,0.08)]"
            }`}
          >
            <span className="hidden sm:inline">{link.label}</span>
            <span className="font-mono sm:hidden">{link.short}</span>
          </Link>
        );
      })}
    </nav>
  );
}
