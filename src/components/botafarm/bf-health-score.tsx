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
};

const panelGlow: Record<HealthGlowTier, string> = {
  cyan: "bf-health-panel-cyan",
  magenta: "bf-health-panel-magenta",
  red: "bf-health-panel-red",
};

const scoreColor: Record<HealthGlowTier, string> = {
  cyan: "text-cyan-300",
  magenta: "text-fuchsia-300",
  red: "text-red-400",
};

export function BfHealthScore({
  score,
  statusLabel,
  actionCount,
  watchCount,
  goodCount,
}: BfHealthScoreProps) {
  const tier = healthGlowTier(score);
  const ringAccent = tier === "red" ? "alert" : tier === "magenta" ? "magenta" : "cyan";

  return (
    <div
      className={`bf-glass bf-glass-shine relative overflow-hidden rounded-3xl p-8 sm:p-12 ${panelGlow[tier]}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.04),transparent_65%)]" />
      <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-20">
        <div className="text-center lg:text-left">
          <p className="bf-section-eyebrow text-zinc-500">Health score</p>
          <p
            className={`bf-mega-score mt-2 tabular-nums ${scoreColor[tier]}`}
            aria-label={`Health score ${score}`}
          >
            {score}
          </p>
          <p className="mt-4 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            {statusLabel}
          </p>
        </div>

        <BfProgressRing
          value={score}
          size={140}
          strokeWidth={8}
          accent={ringAccent}
          showPercent={false}
          showLabel={false}
        />

        <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
          <HealthPill count={actionCount} label="Action" tone="alert" />
          <HealthPill count={watchCount} label="Watch" tone="watch" />
          <HealthPill count={goodCount} label="Good" tone="good" />
        </div>
      </div>
    </div>
  );
}

function HealthPill({
  count,
  label,
  tone,
}: {
  count: number;
  label: string;
  tone: "alert" | "watch" | "good";
}) {
  const styles = {
    alert: "border-red-500/40 bg-red-950/45 text-red-200",
    watch: "border-amber-500/35 bg-amber-950/40 text-amber-100",
    good: "border-emerald-500/35 bg-emerald-950/40 text-emerald-200",
  };

  return (
    <span
      className={`rounded-xl border px-4 py-2.5 font-mono transition duration-200 hover:scale-[1.02] ${styles[tone]}`}
    >
      <span className="text-xl font-bold tabular-nums">{count}</span>{" "}
      <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
    </span>
  );
}
