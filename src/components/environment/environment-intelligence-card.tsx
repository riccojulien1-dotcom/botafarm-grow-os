import Link from "next/link";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import { EnvironmentAiComingSoon } from "@/components/environment/environment-ai-coming-soon";
import { EnvironmentDataSourceStrip } from "@/components/environment/environment-data-source-strip";
import { EnvironmentMetricsGrid } from "@/components/environment/environment-metrics-grid";
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
    <Link href={href} className="group block cursor-pointer">
      <GlassPanel
        glow="cyan"
        padding="lg"
        interactive
        className="relative overflow-hidden transition group-hover:border-cyan-500/40"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,rgba(34,211,238,0.08),transparent_60%)]" />

        <div className="relative space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="bf-lab-label text-cyan-500/80">Environment intelligence</p>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                Climate &amp; irrigation
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Environment + irrigation = plant health
              </p>
            </div>
            <span
              className="shrink-0 rounded-lg border border-cyan-500/40 bg-cyan-950/50 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300 transition group-hover:border-cyan-400/60 group-hover:bg-cyan-900/40 group-hover:text-cyan-200"
              aria-hidden
            >
              View details →
            </span>
          </div>

          <EnvironmentMetricsGrid metrics={data.metrics} compact showChart={false} />

          <div className="space-y-2">
            <p className="bf-lab-label text-zinc-600">Data source</p>
            <EnvironmentDataSourceStrip quality={data.quality} dense />
          </div>

          <EnvironmentAiComingSoon compact />
        </div>
      </GlassPanel>
    </Link>
  );
}
