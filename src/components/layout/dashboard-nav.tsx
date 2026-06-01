"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/grow-rooms", label: "Grow rooms" },
  { href: "/dashboard/journal", label: "Journal" },
  { href: "/dashboard/knowledge", label: "Knowledge" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-1.5 text-sm ${
              isActive
                ? "bg-fuchsia-600 text-white"
                : "border border-zinc-800 text-zinc-300 hover:border-fuchsia-500/50 hover:text-fuchsia-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
