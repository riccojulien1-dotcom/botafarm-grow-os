"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { EnvironmentMetricChart } from "@/components/environment/environment-metric-chart";
import { EnvironmentMetricIcon } from "@/components/environment/environment-metric-icon";
import type { SupervisionMetric } from "@/lib/environment/build-supervision-metrics";
import type { EnvironmentMetricKey } from "@/lib/environment/build-environment-metrics";

type EnvironmentMetricSupervisionCardProps = {
  metric: SupervisionMetric;
  expanded: boolean;
  onToggle: () => void;
};

export function EnvironmentMetricSupervisionCard({
  metric,
  expanded,
  onToggle,
}: EnvironmentMetricSupervisionCardProps) {
  const t = useTranslations("environment");
  const educationSummary = t(
    `education.${metric.key}.summary` as `education.${EnvironmentMetricKey}.summary`,
  );

  const stable = t("metrics.trends.stable");
  const increasing = t("metrics.trends.increasing");
  const decreasing = t("metrics.trends.decreasing");
  const trendColorClass =
    metric.trendLabel === increasing
      ? "text-amber-200"
      : metric.trendLabel === decreasing
        ? "text-cyan-200"
        : metric.trendLabel === stable
          ? "text-zinc-400"
          : "text-zinc-500";

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
      aria-label={`${metric.label}: ${metric.currentDisplay}. ${educationSummary}`}
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
              {educationSummary}
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
            {t(`education.${metric.key}.detail` as `education.${EnvironmentMetricKey}.detail`)}
          </span>
        </span>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <p className="text-5xl font-bold leading-none tabular-nums tracking-tight text-white sm:text-6xl">
          {metric.currentDisplay}
        </p>

        <p className="mt-2 text-sm font-medium text-cyan-300/90">{metric.targetDisplay}</p>

        <p className={`mt-2 text-sm font-semibold ${trendColorClass}`}>{metric.trendLabel}</p>

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
