"use client";

import { Info } from "lucide-react";

import { EnvironmentMetricChart } from "@/components/environment/environment-metric-chart";
import { EnvironmentMetricIcon } from "@/components/environment/environment-metric-icon";
import type { SupervisionMetric } from "@/lib/environment/build-supervision-metrics";
import { METRIC_EDUCATION } from "@/lib/environment/metric-education";

type EnvironmentMetricSupervisionCardProps = {
  metric: SupervisionMetric;
  expanded: boolean;
  onToggle: () => void;
};

const trendColors: Record<string, string> = {
  Stable: "text-zinc-400",
  Increasing: "text-amber-200",
  Decreasing: "text-cyan-200",
  "Not enough readings": "text-zinc-500",
};

export function EnvironmentMetricSupervisionCard({
  metric,
  expanded,
  onToggle,
}: EnvironmentMetricSupervisionCardProps) {
  const education = METRIC_EDUCATION[metric.key];
  const deltaColor =
    metric.deltaDirection === "up"
      ? "text-amber-200"
      : metric.deltaDirection === "down"
        ? "text-cyan-200"
        : "text-zinc-400";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={`${metric.label}: ${metric.currentDisplay}. ${education.summary}`}
      className={`flex w-full flex-col rounded-xl border bg-black/35 p-4 text-left transition ${
        expanded
          ? "border-cyan-500/45 ring-1 ring-cyan-500/20"
          : "border-white/[0.08] hover:border-cyan-500/25"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <EnvironmentMetricIcon metricKey={metric.key} size="card" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">
              {metric.label}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-zinc-500">
              {education.summary}
            </p>
          </div>
        </div>
        <span
          className="group/info relative shrink-0 rounded-full p-1 text-zinc-500 hover:text-cyan-300"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          role="presentation"
        >
          <Info size={15} aria-hidden />
          <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-52 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-left text-[11px] leading-relaxed text-zinc-300 shadow-xl group-hover/info:block">
            {education.detail}
          </span>
        </span>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <p className="text-5xl font-bold leading-none tabular-nums tracking-tight text-white sm:text-6xl">
          {metric.currentDisplay}
        </p>

        <p className="mt-2 text-sm font-medium text-cyan-300/90">{metric.targetDisplay}</p>

        <p
          className={`mt-2 text-sm font-semibold ${trendColors[metric.trendLabel] ?? "text-zinc-400"}`}
        >
          {metric.trendLabel}
        </p>

        <p className={`mt-1 text-xs font-medium tabular-nums ${deltaColor}`}>{metric.deltaShortLabel}</p>
      </div>

      <div className="mt-4 shrink-0 opacity-80">
        <EnvironmentMetricChart
          points={metric.points}
          metricKey={metric.key}
          accent={metric.accent}
          compact
          min={metric.min}
          max={metric.max}
          decimals={metric.decimals}
        />
      </div>
    </button>
  );
}
