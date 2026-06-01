type BfProgressRingProps = {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  accent?: "cyan" | "magenta";
};

export function BfProgressRing({
  value,
  max = 100,
  size = 88,
  strokeWidth = 6,
  label,
  accent = "cyan",
}: BfProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percent / 100) * circumference;
  const stroke = accent === "cyan" ? "#22d3ee" : "#e879f9";
  const track = "rgba(255,255,255,0.08)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
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
          style={{ filter: `drop-shadow(0 0 6px ${stroke})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold tabular-nums text-white">{Math.round(percent)}</span>
        {label ? (
          <span className="text-[9px] uppercase tracking-wider text-zinc-500">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
