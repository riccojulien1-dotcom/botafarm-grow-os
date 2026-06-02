import { BfProgressRing } from "@/components/botafarm/bf-progress-ring";

type HealthGlowTier = "cyan" | "magenta" | "red";

export function healthGlowTier(score: number): HealthGlowTier {
  if (score >= 80) return "cyan";
  if (score >= 60) return "magenta";
  return "red";
}

type BfHealthScoreProps = {
  score: number;
  statusLabel: string;
  actionCount: number;
  watchCount: number;
  goodCount: number;
  compact?: boolean;
};

const panelGlow: Record<HealthGlowTier, string> = {
  cyan: "bf-health-panel-cyan",
  magenta: "bf-health-panel-magenta",
  red: "bf-health-panel-red",
};

export function BfHealthScore({
  score,
  statusLabel,
  actionCount,
  watchCount,
  goodCount,
  compact = false,
}: BfHealthScoreProps) {
  const tier = healthGlowTier(score);
  const ringAccent = tier === "red" ? "alert" : tier === "magenta" ? "magenta" : "cyan";
  const ringSize = compact ? 168 : 240;
  const strokeWidth = compact ? 9 : 12;

  return (
    <div
      className={`bf-glass bf-glass-shine relative h-full overflow-hidden rounded-2xl ${
        compact ? "px-4 py-5 sm:px-5 sm:py-6" : "bf-lab-scan rounded-3xl px-6 py-10 sm:px-10 sm:py-12"
      } ${panelGlow[tier]}`}
    >
      {!compact ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_35%,rgba(34,211,238,0.1),transparent_70%)]" />
      ) : null}

      <div
        className={`relative flex h-full flex-col items-center justify-center text-center ${
          compact ? "gap-3" : "gap-6"
        }`}
      >
        <p className="bf-lab-label">Health score</p>

        <BfProgressRing
          value={score}
          size={ringSize}
          strokeWidth={strokeWidth}
          accent={ringAccent}
          showPercent={false}
        />

        <p
          className={`font-bold uppercase tracking-[0.18em] text-white ${
            compact ? "text-sm" : "text-2xl sm:text-3xl"
          }`}
        >
          {statusLabel}
        </p>

        <div className={`flex flex-wrap justify-center gap-2 ${compact ? "gap-1.5" : "gap-3"}`}>
          <HealthPill count={actionCount} label="Action" tone="alert" compact={compact} />
          <HealthPill count={watchCount} label="Watch" tone="watch" compact={compact} />
          <HealthPill count={goodCount} label="Good" tone="good" compact={compact} />
        </div>
      </div>
    </div>
  );
}

function HealthPill({
  count,
  label,
  tone,
  compact,
}: {
  count: number;
  label: string;
  tone: "alert" | "watch" | "good";
  compact?: boolean;
}) {
  const styles = {
    alert: "border-red-500/40 bg-red-950/45 text-red-200",
    watch: "border-amber-500/35 bg-amber-950/40 text-amber-100",
    good: "border-emerald-500/35 bg-emerald-950/40 text-emerald-200",
  };

  return (
    <span
      className={`rounded-lg border font-mono ${styles[tone]} ${
        compact ? "px-2.5 py-1 text-[9px]" : "rounded-xl px-4 py-2 text-[10px]"
      }`}
    >
      <span className={`font-bold tabular-nums ${compact ? "text-sm" : "text-lg"}`}>{count}</span>{" "}
      <span className="uppercase tracking-[0.16em]">{label}</span>
    </span>
  );
}
