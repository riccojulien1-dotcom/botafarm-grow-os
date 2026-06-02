import { BfAreaChart } from "@/components/botafarm/bf-area-chart";
import type { EnvironmentMetricSnapshot } from "@/lib/environment/get-environment-intelligence";
import type { TargetStatus } from "@/lib/environment/metric-stats";

const statusStyles: Record<
  TargetStatus,
  { border: string; statusText: string }
> = {
  on_target: {
    border: "border-emerald-500/25",
    statusText: "text-emerald-300",
  },
  above_target: {
    border: "border-amber-500/30",
    statusText: "text-amber-200",
  },
  below_target: {
    border: "border-cyan-500/30",
    statusText: "text-cyan-200",
  },
  no_data: {
    border: "border-zinc-700/80",
    statusText: "text-zinc-500",
  },
  no_target: {
    border: "border-zinc-700/80",
    statusText: "text-zinc-400",
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
  showChart = false,
}: EnvironmentMetricTileProps) {
  const styles = statusStyles[metric.status];
  const displayValue =
    metric.currentLabel === "—"
      ? "—"
      : `${metric.currentLabel}${metric.unit ? metric.unit : ""}`;

  return (
    <article
      className={`bf-inset-panel flex flex-col ${styles.border} ${
        compact ? "p-2.5" : "p-4"
      }`}
    >
      <p className="bf-lab-label text-[9px]">{metric.label}</p>

      <p
        className={`mt-1 font-bold tabular-nums tracking-tight text-white ${
          compact ? "text-lg leading-none" : "text-2xl sm:text-3xl"
        }`}
      >
        {displayValue}
      </p>

      <dl className={`mt-2 space-y-1 ${compact ? "text-[10px]" : "text-xs"}`}>
        <MetricRow label="Target" value={metric.targetLabel} />
        <MetricRow label="Trend" value={metric.trendLabel} valueClassName={styles.statusText} />
        <MetricRow
          label="Status"
          value={metric.statusLabel}
          valueClassName={`font-semibold ${styles.statusText}`}
        />
      </dl>

      {showChart && metric.series.length > 1 ? (
        <div className="mt-2 border-t border-white/[0.05] pt-2">
          <p className="mb-1 text-[9px] uppercase tracking-wider text-zinc-600">Recent</p>
          <BfAreaChart
            data={metric.series}
            labels={metric.chartLabels}
            accent={metric.accent}
            width={compact ? 180 : 280}
            height={compact ? 48 : 56}
            latestValue={metric.currentLabel === "—" ? null : metric.currentLabel}
            unit={metric.unit || undefined}
          />
        </div>
      ) : null}
    </article>
  );
}

function MetricRow({
  label,
  value,
  valueClassName = "text-zinc-300",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-zinc-600">{label}</dt>
      <dd className={`text-right font-medium ${valueClassName}`}>{value}</dd>
    </div>
  );
}
