import type { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "magenta" | "none";
  padding?: "sm" | "md" | "lg";
  id?: string;
};

const paddingClass = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function GlassPanel({
  children,
  className = "",
  glow = "none",
  padding = "md",
  id,
}: GlassPanelProps) {
  const glowClass =
    glow === "cyan"
      ? "bf-glass-glow-cyan"
      : glow === "magenta"
        ? "bf-glass-glow-magenta"
        : "";

  return (
    <div
      id={id}
      className={`bf-glass bf-scanline rounded-2xl ${paddingClass[padding]} ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}
