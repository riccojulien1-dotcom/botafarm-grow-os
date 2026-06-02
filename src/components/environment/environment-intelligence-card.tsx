import Link from "next/link";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import { EnvironmentMetricTile } from "@/components/environment/environment-metric-tile";
import type { EnvironmentIntelligence } from "@/lib/environment/get-environment-intelligence";

type EnvironmentIntelligenceCardProps = {
  data: EnvironmentIntelligence;
  href?: string;
};

export function EnvironmentIntelligenceCard({
  data,
  href = "/dashboard/environment",
}: EnvironmentIntelligenceCardProps) {
  return (
    <Link href={href} className="group block">
      <GlassPanel
        glow="cyan"
        padding="lg"
        interactive
        className="relative overflow-hidden transition group-hover:border-cyan-500/40"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,rgba(34,211,238,0.1),transparent_60%)]" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="bf-lab-label text-cyan-500/80">Environment intelligence</p>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                Irrigation &amp; climate
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Environment + irrigation = plant health · Last update{" "}
                {data.quality.lastReadingLabel}
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/90 transition group-hover:text-cyan-300">
              View details →
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.slice(0, 4).map((metric) => (
              <EnvironmentMetricTile key={metric.key} metric={metric} compact showChart />
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {data.metrics.slice(4).map((metric) => (
              <EnvironmentMetricTile
                key={metric.key}
                metric={metric}
                compact
                showChart={false}
              />
            ))}
          </div>
        </div>
      </GlassPanel>
    </Link>
  );
}
