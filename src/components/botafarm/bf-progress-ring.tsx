type BfProgressRingProps = {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  accent?: "cyan" | "magenta" | "healthy" | "alert";
  showPercent?: boolean;
  showLabel?: boolean;
};

const strokeByAccent = {
  cyan: "#22d3ee",
  magenta: "#e879f9",
  healthy: "#34d399",
  alert: "#f87171",
};

const glowByAccent = {
  cyan: "0 0 28px rgba(34, 211, 238, 0.55)",
  magenta: "0 0 28px rgba(232, 121, 249, 0.5)",
  healthy: "0 0 32px rgba(52, 211, 153, 0.45), 0 0 48px rgba(34, 211, 238, 0.25)",
  alert: "0 0 28px rgba(248, 113, 113, 0.55)",
};

export function BfProgressRing({
  value,
  max = 100,
  size = 88,
  strokeWidth = 6,
  label,
  sublabel,
  accent = "cyan",
  showPercent = true,
  showLabel = true,
}: BfProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percent / 100) * circumference;
  const stroke = strokeByAccent[accent];
  const track = "rgba(255, 255, 255, 0.06)";
  const displayScore = showPercent ? Math.round(percent) : Math.round(value);

  const scoreClass =
    size >= 220
      ? "text-6xl sm:text-7xl"
      : size >= 160
        ? "text-5xl sm:text-6xl"
        : size >= 120
          ? "text-4xl"
          : "text-lg";

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
          style={{ filter: glowByAccent[accent] }}
        />
      </svg>
      {showLabel ? (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <span className={`font-bold tabular-nums tracking-tight text-white ${scoreClass}`}>
          {displayScore}
        </span>
        {label ? (
          <span
            className={`mt-0.5 font-mono uppercase tracking-[0.2em] text-zinc-500 ${
              size >= 120 ? "text-[10px]" : "text-[9px]"
            }`}
          >
            {label}
          </span>
        ) : null}
        {sublabel ? (
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">
            {sublabel}
          </span>
        ) : null}
      </div>
      ) : null}
    </div>
  );
}
