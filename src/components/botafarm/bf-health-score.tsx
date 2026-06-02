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
      className={`bf-glass bf-glass-shine bf-lab-scan relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12 ${panelGlow[tier]}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_35%,rgba(34,211,238,0.1),transparent_70%)]" />

      <div className="relative flex flex-col items-center text-center">
        <p className="bf-lab-label">Health score</p>

        <div className="mt-6">
          <BfProgressRing
            value={score}
            size={240}
            strokeWidth={12}
            accent={ringAccent}
            showPercent={false}
          />
        </div>

        <p className="mt-6 text-2xl font-bold uppercase tracking-[0.2em] text-white sm:text-3xl">
          {statusLabel}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      className={`rounded-xl border px-4 py-2 font-mono transition duration-200 hover:scale-[1.02] ${styles[tone]}`}
    >
      <span className="text-lg font-bold tabular-nums">{count}</span>{" "}
      <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
    </span>
  );
}
