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
        className="relative overflow-hidden transition group-hover:border-cyan-500/45"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_10%_0%,rgba(34,211,238,0.14),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(232,121,249,0.08),transparent_50%)]" />

        <div className="relative space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="bf-lab-label text-cyan-500/80">Environment mission control</p>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                Climate &amp; irrigation
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Current · target · trend — at a glance
              </p>
            </div>
            <span
              className="shrink-0 rounded-lg border border-cyan-500/45 bg-cyan-950/60 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)] transition group-hover:border-cyan-400/70 group-hover:text-cyan-200"
              aria-hidden
            >
              View details →
            </span>
          </div>

          <EnvironmentMetricsGrid metrics={data.metrics} variant="cockpit" />

          <div className="space-y-1.5">
            <CockpitSectionLabel>Data source</CockpitSectionLabel>
            <EnvironmentDataSourceStrip quality={data.quality} dense />
          </div>

          <div className="space-y-1.5">
            <CockpitSectionLabel>AI analysis</CockpitSectionLabel>
            <EnvironmentAiComingSoon compact />
          </div>
        </div>
      </GlassPanel>
    </Link>
  );
}

function CockpitSectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-600">{children}</p>
  );
}
