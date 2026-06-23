"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { EnvironmentMetricChart } from "@/components/environment/environment-metric-chart";
import { EnvironmentMetricIcon } from "@/components/environment/environment-metric-icon";
import { supervisionMetricStatusStyles } from "@/components/environment/environment-status-styles";
import type { SupervisionMetric } from "@/lib/environment/build-supervision-metrics";
import { formatMetricReading } from "@/lib/environment/format-metric-display";
import type { EnvironmentMetricKey } from "@/lib/environment/build-environment-metrics";

type EnvironmentMetricDetailPanelProps = {
  metric: SupervisionMetric;
};

export function EnvironmentMetricDetailPanel({ metric }: EnvironmentMetricDetailPanelProps) {
  const t = useTranslations("environment");
  const education = {
    summary: t(`education.${metric.key}.summary` as `education.${EnvironmentMetricKey}.summary`),
    detail: t(`education.${metric.key}.detail` as `education.${EnvironmentMetricKey}.detail`),
  };

  return (
    <div className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-950/10 p-5">
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

      <div className="mt-5 rounded-xl border border-fuchsia-500/30 bg-fuchsia-950/25 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-fuchsia-300" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-fuchsia-200">
            {t("copilot.aiInterpretation")}
          </p>
        </div>
        <p className="mt-3 text-base font-medium leading-relaxed text-white">
          {metric.interpretation}
        </p>
        <div className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-950/20 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
            {t("copilot.whatToDoNext")}
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-emerald-100">
            {metric.recommendation}
          </p>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-400">{education.summary}</p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {t("copilot.trendChart")}
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
        <DetailStat label={t("metrics.detail.latestReading")} value={metric.currentDisplay} />
        <DetailStat label={t("metrics.detail.previousReading")} value={metric.previousDisplay} />
        <DetailStat label={t("metrics.detail.average")} value={metric.avgLabel} />
        <DetailStat
          label={t("metrics.detail.targetRange")}
          value={metric.targetDisplay.replace(/^Target |^Cible /, "")}
        />
        <DetailStat label={t("metrics.detail.lowest")} value={metric.minLabel} />
        <DetailStat label={t("metrics.detail.highest")} value={metric.maxLabel} />
        <DetailStat label={t("metrics.detail.sinceLastLog")} value={metric.deltaShortLabel} />
        <DetailStat label={t("metrics.detail.overTime")} value={metric.periodChangeLabel} />
      </div>

      {metric.points.length ? (
        <div className="mt-5 overflow-x-auto rounded-lg border border-white/[0.06]">
          <p className="border-b border-white/[0.06] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t("metrics.detail.recentReadings")}
          </p>
          <table className="w-full min-w-[360px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-3 py-2 font-medium">{t("metrics.detail.date")}</th>
                <th className="px-3 py-2 font-medium">{t("metrics.detail.reading")}</th>
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
