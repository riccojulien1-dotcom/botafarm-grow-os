type BfProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  accent?: "cyan" | "magenta" | "alert";
  showValue?: boolean;
};

const fillClass = {
  cyan: "bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]",
  magenta: "bg-gradient-to-r from-fuchsia-700 to-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.45)]",
  alert: "bg-gradient-to-r from-red-700 to-amber-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]",
};

export function BfProgressBar({
  value,
  max = 100,
  label,
  accent = "cyan",
  showValue = true,
}: BfProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label ? <span className="text-zinc-400">{label}</span> : <span />}
          {showValue ? (
            <span className="font-mono tabular-nums text-zinc-300">{Math.round(percent)}%</span>
          ) : null}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${fillClass[accent]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
