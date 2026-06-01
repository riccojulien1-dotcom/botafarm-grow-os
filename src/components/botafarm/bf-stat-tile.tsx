import type { ReactNode } from "react";

type BfStatTileProps = {
  label: string;
  value: string | number;
  accent?: "cyan" | "magenta" | "neutral" | "alert" | "success";
  icon?: ReactNode;
  trend?: string;
  compact?: boolean;
  hero?: boolean;
};

const accentBorder = {
  cyan: "border-cyan-500/25",
  magenta: "border-fuchsia-500/25",
  neutral: "border-white/8",
  alert: "border-red-500/35",
  success: "border-emerald-500/30",
};

const valueColor = {
  cyan: "text-cyan-300",
  magenta: "text-fuchsia-300",
  neutral: "text-white",
  alert: "text-red-300",
  success: "text-emerald-300",
};

export function BfStatTile({
  label,
  value,
  accent = "neutral",
  icon,
  trend,
  compact = false,
  hero = false,
}: BfStatTileProps) {
  const padding = hero ? "py-6 px-2" : compact ? "p-4" : "p-5";
  const valueSize = hero
    ? "text-4xl sm:text-5xl lg:text-6xl"
    : compact
      ? "text-2xl"
      : "text-3xl sm:text-4xl";
  const labelSize = hero
    ? "text-xs sm:text-sm tracking-[0.28em]"
    : "text-[10px] tracking-[0.18em]";

  return (
    <article
      className={`flex flex-col items-center justify-center text-center ${padding} ${
        hero ? "" : `bf-glass rounded-2xl border ${accentBorder[accent]}`
      }`}
    >
      <p className={`font-mono uppercase text-zinc-500 ${labelSize}`}>{label}</p>
      <div className="flex items-center gap-2">
        <p
          className={`mt-2 font-bold tabular-nums leading-none tracking-tight ${valueColor[accent]} ${valueSize}`}
        >
          {value}
        </p>
        {icon ? <span className="text-zinc-500">{icon}</span> : null}
      </div>
      {trend ? <p className="mt-2 text-xs text-fuchsia-400/90">{trend}</p> : null}
    </article>
  );
}
