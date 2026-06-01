import Link from "next/link";
import type { ReactNode } from "react";

type BfButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const variantClass = {
  primary:
    "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:from-cyan-500 hover:to-cyan-400",
  secondary:
    "border border-fuchsia-500/40 bg-fuchsia-950/30 text-fuchsia-200 hover:border-fuchsia-400/60 hover:bg-fuchsia-950/50",
  ghost:
    "border border-white/10 text-zinc-300 hover:border-cyan-500/30 hover:text-cyan-200",
};

export function BfButton({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: BfButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm transition-all duration-200 disabled:opacity-50";

  if (href) {
    return (
      <Link href={href} className={`${base} ${variantClass[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variantClass[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
