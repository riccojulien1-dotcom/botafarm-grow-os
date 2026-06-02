import Link from "next/link";

import { BfButton } from "@/components/botafarm/bf-button";
import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { EnvironmentAiComingSoon } from "@/components/environment/environment-ai-coming-soon";
import { EnvironmentDataSourceStrip } from "@/components/environment/environment-data-source-strip";
import { EnvironmentImportPlaceholder } from "@/components/environment/environment-import-placeholder";
import { EnvironmentMetricsGrid } from "@/components/environment/environment-metrics-grid";
import type { EnvironmentIntelligence } from "@/lib/environment/get-environment-intelligence";

type EnvironmentDetailsViewProps = {
  data: EnvironmentIntelligence;
};

export function EnvironmentDetailsView({ data }: EnvironmentDetailsViewProps) {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-200"
        >
          Mission Control
        </Link>
      </div>

      <BfPageHeader
        eyebrow="Environment intelligence"
        title="Climate & irrigation"
        subtitle="Decision center for room climate, feed, and runoff — built from your manual journal entries."
      />

      <GlassPanel glow="cyan" padding="md">
        <EnvironmentMetricsGrid metrics={data.metrics} showChart />
      </GlassPanel>

      <section className="space-y-3">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">
          Metric summary
        </h2>
        <GlassPanel padding="md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-zinc-500">
                  <th className="pb-3 pr-4 font-medium">Group</th>
                  <th className="pb-3 pr-4 font-medium">Metric</th>
                  <th className="pb-3 pr-4 font-medium">Current</th>
                  <th className="pb-3 pr-4 font-medium">Target</th>
                  <th className="pb-3 pr-4 font-medium">Min</th>
                  <th className="pb-3 pr-4 font-medium">Max</th>
                  <th className="pb-3 pr-4 font-medium">Average</th>
                  <th className="pb-3 pr-4 font-medium">Trend</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.metrics.map((metric) => (
                  <tr
                    key={metric.key}
                    className="border-b border-white/[0.04] text-zinc-200 last:border-0"
                  >
                    <td className="py-3 pr-4 text-xs uppercase tracking-wider text-zinc-500">
                      {metricGroup(metric.key)}
                    </td>
                    <td className="py-3 pr-4 font-medium text-white">{metric.label}</td>
                    <td className="py-3 pr-4 tabular-nums">
                      {metric.currentLabel === "—"
                        ? "—"
                        : `${metric.currentLabel}${metric.unit ? metric.unit : ""}`}
                    </td>
                    <td className="py-3 pr-4 text-zinc-400">{metric.targetLabel}</td>
                    <td className="py-3 pr-4 tabular-nums text-zinc-400">{metric.minLabel}</td>
                    <td className="py-3 pr-4 tabular-nums text-zinc-400">{metric.maxLabel}</td>
                    <td className="py-3 pr-4 tabular-nums text-zinc-400">{metric.avgLabel}</td>
                    <td className="py-3 pr-4">{metric.trendLabel}</td>
                    <td className="py-3 font-semibold">{metric.statusLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white">
            Reading history
          </h2>
          <BfButton href="/dashboard/journal" variant="secondary">
            Open journal
          </BfButton>
        </div>
        <GlassPanel padding="md">
          {data.history.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 pr-3 font-medium">Date</th>
                    <th className="pb-3 pr-3 font-medium">Room</th>
                    <th className="pb-3 pr-3 font-medium">Temp</th>
                    <th className="pb-3 pr-3 font-medium">RH</th>
                    <th className="pb-3 pr-3 font-medium">VPD</th>
                    <th className="pb-3 pr-3 font-medium">EC in</th>
                    <th className="pb-3 pr-3 font-medium">EC out</th>
                    <th className="pb-3 pr-3 font-medium">pH in</th>
                    <th className="pb-3 font-medium">pH out</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-white/[0.04] text-zinc-300 last:border-0"
                    >
                      <td className="py-2.5 pr-3 whitespace-nowrap">{row.logDate}</td>
                      <td className="py-2.5 pr-3">{row.roomName}</td>
                      <td className="py-2.5 pr-3 tabular-nums">{fmt(row.temperature)}</td>
                      <td className="py-2.5 pr-3 tabular-nums">{fmt(row.humidity)}</td>
                      <td className="py-2.5 pr-3 tabular-nums">{fmt(row.vpd)}</td>
                      <td className="py-2.5 pr-3 tabular-nums">{fmt(row.ecIn)}</td>
                      <td className="py-2.5 pr-3 tabular-nums">{fmt(row.ecRunoff)}</td>
                      <td className="py-2.5 pr-3 tabular-nums">{fmt(row.phIn)}</td>
                      <td className="py-2.5 tabular-nums">{fmt(row.phRunoff)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              No journal readings yet. Log environment data to activate this view.
            </p>
          )}
        </GlassPanel>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">Data source</h2>
        <GlassPanel padding="md">
          <EnvironmentDataSourceStrip quality={data.quality} />
          {data.roomContext ? (
            <p className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-zinc-500">
              Latest reading context: {data.roomContext.name} · {data.roomContext.status}
            </p>
          ) : null}
        </GlassPanel>
      </section>

      <EnvironmentAiComingSoon />

      <EnvironmentImportPlaceholder />
    </div>
  );
}

function metricGroup(key: string) {
  if (key === "temperature" || key === "humidity" || key === "vpd") {
    return "Climate";
  }
  return "Irrigation";
}

function fmt(value: number | null) {
  if (value == null) return "—";
  return String(Number(value.toFixed(2)));
}
