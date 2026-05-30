"use client";

import { MetricLineChart } from "@/components/analytics/metric-line-chart";
import {
  buildMetricSeries,
  CHART_SECTIONS,
} from "@/lib/journal/build-chart-series";
import type { DailyLogRecord } from "@/lib/journal/daily-log-fields";

type RoomJournalChartsProps = {
  logs: DailyLogRecord[];
};

export function RoomJournalCharts({ logs }: RoomJournalChartsProps) {
  const hasAnyChartData = CHART_SECTIONS.some((section) =>
    section.metrics.some((metric) => buildMetricSeries(logs, metric.key).length > 0),
  );

  return (
    <section className="space-y-6 rounded-xl border border-fuchsia-900/30 bg-zinc-900/50 p-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Charts & analytics</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Trends from your daily journal, ordered oldest to newest. Empty values are skipped.
        </p>
      </div>

      {!hasAnyChartData ? (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-sm text-zinc-400">
          Add journal entries with measurements to see charts here.
        </p>
      ) : null}

      {CHART_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-fuchsia-300/90">
            {section.title}
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {section.metrics.map((metric) => (
              <MetricLineChart
                key={metric.key}
                title={metric.title}
                unit={metric.unit}
                color={metric.color}
                data={buildMetricSeries(logs, metric.key)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
