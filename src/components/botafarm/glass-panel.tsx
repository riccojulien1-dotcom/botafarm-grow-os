import type { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "magenta" | "red" | "none";
  padding?: "sm" | "md" | "lg";
  id?: string;
  interactive?: boolean;
  shine?: boolean;
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
  interactive = false,
  shine = true,
}: GlassPanelProps) {
  const glowClass =
    glow === "cyan"
      ? "bf-glass-glow-cyan"
      : glow === "magenta"
        ? "bf-glass-glow-magenta"
        : glow === "red"
          ? "bf-glass-glow-red"
          : "";

  return (
    <div
      id={id}
      className={`bf-glass rounded-2xl ${shine ? "bf-glass-shine" : ""} ${
        interactive ? "bf-interactive" : ""
      } ${paddingClass[padding]} ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}
