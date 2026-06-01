import type { ReactNode } from "react";

type BfStatTileProps = {
  label: string;
  value: string | number;
  accent?: "cyan" | "magenta" | "neutral" | "alert" | "success";
  icon?: ReactNode;
  trend?: string;
  compact?: boolean;
};

const accentBorder = {
  cyan: "border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]",
  magenta: "border-fuchsia-500/30 shadow-[0_0_20px_rgba(232,121,249,0.12)]",
  neutral: "border-white/10",
  alert: "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.12)]",
  success: "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.12)]",
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
}: BfStatTileProps) {
  return (
    <article
      className={`bf-glass flex flex-col justify-between rounded-2xl border ${accentBorder[accent]} ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </p>
        {icon ? <span className="text-zinc-500">{icon}</span> : null}
      </div>
      <p
        className={`mt-3 font-bold tabular-nums tracking-tight ${valueColor[accent]} ${
          compact ? "text-2xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {value}
      </p>
      {trend ? <p className="mt-1 text-xs text-zinc-500">{trend}</p> : null}
    </article>
  );
}
