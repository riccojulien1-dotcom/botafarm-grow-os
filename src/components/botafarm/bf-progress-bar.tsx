type BfProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  accent?: "cyan" | "magenta" | "alert";
  showValue?: boolean;
  size?: "default" | "large";
};

const fillClass = {
  cyan: "bg-gradient-to-r from-cyan-700 via-cyan-400 to-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.55)]",
  magenta:
    "bg-gradient-to-r from-fuchsia-800 via-fuchsia-500 to-fuchsia-300 shadow-[0_0_16px_rgba(232,121,249,0.5)]",
  alert: "bg-gradient-to-r from-red-700 to-amber-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]",
};

export function BfProgressBar({
  value,
  max = 100,
  label,
  accent = "cyan",
  showValue = true,
  size = "default",
}: BfProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const barHeight = size === "large" ? "h-4 sm:h-5" : "h-2";

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2 text-xs">
          {label ? <span className="text-zinc-400">{label}</span> : <span />}
          {showValue ? (
            <span className="font-mono text-sm tabular-nums text-zinc-400">{Math.round(percent)}%</span>
          ) : null}
        </div>
      )}
      <div className={`overflow-hidden rounded-full bg-white/[0.06] ${barHeight}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${fillClass[accent]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
