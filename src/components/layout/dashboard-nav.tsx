"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", short: "CMD" },
  { href: "/dashboard/grow-rooms", label: "Grow rooms", short: "Rooms" },
  { href: "/dashboard/journal", label: "Journal", short: "Log" },
  { href: "/dashboard/knowledge", label: "Library", short: "KB" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-white/5 bg-black/40 p-2 backdrop-blur-md">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-cyan-600/90 to-cyan-500/80 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                : "text-zinc-400 hover:bg-white/5 hover:text-cyan-200"
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
