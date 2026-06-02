import { BfAreaChart } from "@/components/botafarm/bf-area-chart";
import type { EnvironmentMetricSnapshot } from "@/lib/environment/get-environment-intelligence";
import type { TargetStatus } from "@/lib/environment/metric-stats";

const statusStyles: Record<
  TargetStatus,
  { border: string; text: string; badge: string }
> = {
  on_target: {
    border: "border-emerald-500/30",
    text: "text-emerald-300",
    badge: "border-emerald-500/35 bg-emerald-950/40 text-emerald-200",
  },
  above_target: {
    border: "border-amber-500/35",
    text: "text-amber-200",
    badge: "border-amber-500/35 bg-amber-950/40 text-amber-100",
  },
  below_target: {
    border: "border-cyan-500/35",
    text: "text-cyan-200",
    badge: "border-cyan-500/35 bg-cyan-950/40 text-cyan-100",
  },
  no_data: {
    border: "border-zinc-700",
    text: "text-zinc-500",
    badge: "border-zinc-700 bg-zinc-900/60 text-zinc-500",
  },
  no_target: {
    border: "border-zinc-700",
    text: "text-zinc-400",
    badge: "border-zinc-700 bg-zinc-900/60 text-zinc-400",
  },
};

type EnvironmentMetricTileProps = {
  metric: EnvironmentMetricSnapshot;
  compact?: boolean;
  showChart?: boolean;
};

export function EnvironmentMetricTile({
  metric,
  compact = false,
  showChart = true,
}: EnvironmentMetricTileProps) {
  const styles = statusStyles[metric.status];
  const displayValue =
    metric.currentLabel === "—"
      ? "—"
      : `${metric.currentLabel}${metric.unit ? ` ${metric.unit}` : ""}`;

  return (
    <article
      className={`bf-inset-panel flex flex-col ${styles.border} ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="bf-lab-label">{metric.label}</p>
        <span
          className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${styles.badge}`}
        >
          {metric.statusLabel}
        </span>
      </div>

      <p
        className={`mt-2 font-bold tabular-nums tracking-tight text-white ${
          compact ? "text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {displayValue}
      </p>

      <dl className={`mt-3 grid gap-1 text-xs ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
        <div>
          <dt className="text-zinc-600">Target</dt>
          <dd className="font-medium text-zinc-300">{metric.targetLabel}</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Trend</dt>
          <dd className={`font-medium ${styles.text}`}>{metric.trendLabel}</dd>
        </div>
        {!compact ? (
          <div>
            <dt className="text-zinc-600">Status</dt>
            <dd className={`font-semibold uppercase tracking-wide ${styles.text}`}>
              {metric.statusLabel}
            </dd>
          </div>
        ) : null}
      </dl>

      {showChart && metric.series.length > 1 ? (
        <div className="mt-3 border-t border-white/[0.05] pt-3">
          <BfAreaChart
            data={metric.series}
            labels={metric.chartLabels}
            accent={metric.accent}
            width={compact ? 200 : 260}
            height={compact ? 56 : 64}
            latestValue={null}
          />
        </div>
      ) : null}
    </article>
  );
}
