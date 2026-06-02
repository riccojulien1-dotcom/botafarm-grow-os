import { BfAreaChart } from "@/components/botafarm/bf-area-chart";
import type { EnvironmentMetricSnapshot } from "@/lib/environment/get-environment-intelligence";
import type { MetricTrend, TargetStatus } from "@/lib/environment/metric-stats";

const statusStyles: Record<
  TargetStatus,
  { border: string; glow: string; pill: string; trend: string }
> = {
  on_target: {
    border: "border-emerald-500/30",
    glow: "from-emerald-500/10",
    pill: "border-emerald-500/35 bg-emerald-950/50 text-emerald-200",
    trend: "text-emerald-300",
  },
  above_target: {
    border: "border-amber-500/35",
    glow: "from-amber-500/10",
    pill: "border-amber-500/35 bg-amber-950/45 text-amber-100",
    trend: "text-amber-200",
  },
  below_target: {
    border: "border-cyan-500/35",
    glow: "from-cyan-500/10",
    pill: "border-cyan-500/35 bg-cyan-950/45 text-cyan-100",
    trend: "text-cyan-200",
  },
  no_data: {
    border: "border-zinc-700/70",
    glow: "from-zinc-600/5",
    pill: "border-zinc-700 bg-zinc-900/60 text-zinc-500",
    trend: "text-zinc-500",
  },
  no_target: {
    border: "border-zinc-700/70",
    glow: "from-zinc-600/5",
    pill: "border-zinc-700 bg-zinc-900/60 text-zinc-400",
    trend: "text-zinc-400",
  },
};

type EnvironmentMetricTileProps = {
  metric: EnvironmentMetricSnapshot;
  /** Cockpit = dashboard preview; deck = environment details */
  variant?: "cockpit" | "deck";
};

export function EnvironmentMetricTile({
  metric,
  variant = "cockpit",
}: EnvironmentMetricTileProps) {
  const isCockpit = variant === "cockpit";
  const styles = statusStyles[metric.status];
  const displayValue =
    metric.currentLabel === "—"
      ? "—"
      : `${metric.currentLabel}${metric.unit ? metric.unit : ""}`;

  const chartWidth = isCockpit ? 148 : 280;
  const chartHeight = isCockpit ? 46 : 62;

  return (
    <article
      className={`relative flex min-h-0 flex-col overflow-hidden rounded-xl border bg-black/35 ${styles.border} ${
        isCockpit ? "p-2.5" : "p-4"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow} to-transparent`}
      />

      <div className="relative flex items-start justify-between gap-1">
        <p
          className={`font-mono uppercase tracking-[0.18em] ${
            metric.accent === "cyan" ? "text-cyan-500/85" : "text-fuchsia-400/85"
          } ${isCockpit ? "text-[9px]" : "text-[10px]"}`}
        >
          {metric.label}
        </p>
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider ${styles.pill}`}
        >
          {metric.statusLabel}
        </span>
      </div>

      <p
        className={`relative mt-1 font-bold tabular-nums tracking-tight text-white ${
          isCockpit ? "text-xl leading-none" : "text-3xl"
        }`}
      >
        {displayValue}
      </p>

      <p className={`relative mt-1 text-zinc-500 ${isCockpit ? "text-[10px]" : "text-xs"}`}>
        <span className="text-zinc-600">Target </span>
        {metric.targetLabel}
      </p>

      <div className={`relative min-w-0 ${isCockpit ? "my-1.5" : "my-3"}`}>
        <BfAreaChart
          data={metric.series}
          labels={metric.chartLabels}
          accent={metric.accent}
          width={chartWidth}
          height={chartHeight}
          latestValue={null}
        />
      </div>

      <div className={`relative flex items-center gap-1.5 ${isCockpit ? "text-[10px]" : "text-xs"}`}>
        <TrendGlyph trend={metric.trend} className={styles.trend} />
        <span className={`font-semibold uppercase tracking-wide ${styles.trend}`}>
          {metric.trendLabel}
        </span>
      </div>
    </article>
  );
}

function TrendGlyph({ trend, className }: { trend: MetricTrend; className: string }) {
  const symbol =
    trend === "rising" ? "↑" : trend === "falling" ? "↓" : trend === "stable" ? "→" : "·";
  return (
    <span className={`font-mono text-sm leading-none ${className}`} aria-hidden>
      {symbol}
    </span>
  );
}
