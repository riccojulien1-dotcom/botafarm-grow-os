import { EnvironmentMetricChart } from "@/components/environment/environment-metric-chart";
import { EnvironmentMetricIcon } from "@/components/environment/environment-metric-icon";
import { supervisionMetricStatusStyles } from "@/components/environment/environment-status-styles";
import type { SupervisionMetric } from "@/lib/environment/build-supervision-metrics";
import { formatMetricReading } from "@/lib/environment/format-metric-display";
import { METRIC_EDUCATION } from "@/lib/environment/metric-education";

type EnvironmentMetricDetailPanelProps = {
  metric: SupervisionMetric;
};

export function EnvironmentMetricDetailPanel({ metric }: EnvironmentMetricDetailPanelProps) {
  const education = METRIC_EDUCATION[metric.key];

  return (
    <div className="rounded-xl border border-cyan-500/25 bg-cyan-950/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <EnvironmentMetricIcon metricKey={metric.key} size="detail" />
          <div>
            <p className="text-sm font-medium text-zinc-400">{metric.label}</p>
            <p className="mt-1 text-5xl font-bold tabular-nums text-white sm:text-6xl">
              {metric.currentDisplay}
            </p>
            <p className="mt-2 text-sm font-medium text-cyan-300/90">{metric.targetDisplay}</p>
            <p className="mt-1 text-sm text-zinc-400">{metric.trendLabel}</p>
          </div>
        </div>
        <span
          className={`rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${supervisionMetricStatusStyles[metric.status]}`}
        >
          {metric.statusLabel}
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/25 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500">What is {metric.label}?</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{education.detail}</p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Room history
        </p>
        <EnvironmentMetricChart
          points={metric.points}
          metricKey={metric.key}
          accent={metric.accent}
          min={metric.min}
          max={metric.max}
          decimals={metric.decimals}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailStat label="Latest reading" value={metric.currentDisplay} />
        <DetailStat label="Previous reading" value={metric.previousDisplay} />
        <DetailStat label="Average" value={metric.avgLabel} />
        <DetailStat label="Target range" value={metric.targetDisplay.replace(/^Target /, "")} />
        <DetailStat label="Lowest" value={metric.minLabel} />
        <DetailStat label="Highest" value={metric.maxLabel} />
        <DetailStat label="Since last log" value={metric.deltaShortLabel} />
        <DetailStat label="Over time" value={metric.periodChangeLabel} />
      </div>

      {metric.points.length ? (
        <div className="mt-5 overflow-x-auto rounded-lg border border-white/[0.06]">
          <p className="border-b border-white/[0.06] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Recent readings
          </p>
          <table className="w-full min-w-[360px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Reading</th>
              </tr>
            </thead>
            <tbody>
              {[...metric.points].reverse().map((point) => (
                <tr key={point.date} className="border-b border-white/[0.04] text-zinc-300">
                  <td className="px-3 py-2">{point.dateLabel}</td>
                  <td className="px-3 py-2 tabular-nums font-medium text-white">
                    {formatMetricReading(point.value, metric.key, metric.decimals)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-950/20 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-cyan-400/80">What to do next</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-200">{metric.recommendation}</p>
      </div>

      <div className="mt-3 rounded-lg border border-white/[0.06] bg-black/25 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500">What this means right now</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{metric.interpretation}</p>
      </div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
