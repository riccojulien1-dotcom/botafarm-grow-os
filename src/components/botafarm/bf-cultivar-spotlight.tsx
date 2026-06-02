import Link from "next/link";

import { BfCycleBlocks } from "@/components/botafarm/bf-cycle-blocks";
import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import {
  formatHarvestSpotlightDate,
  formatPhaseLabel,
  toTitleCase,
} from "@/lib/ui/format-mission-labels";

type BfCultivarSpotlightProps = {
  cultivarName: string;
  genetics: string | null;
  phaseLabel: string;
  daysRemaining: number | null;
  harvestDateLabel: string | null;
  progressPercent: number | null;
  roomHref: string;
};

export function BfCultivarSpotlight({
  cultivarName,
  genetics,
  phaseLabel,
  daysRemaining,
  harvestDateLabel,
  progressPercent,
  roomHref,
}: BfCultivarSpotlightProps) {
  const displayName = cultivarName.includes(" ")
    ? toTitleCase(cultivarName)
    : cultivarName.toUpperCase();

  return (
    <Link href={roomHref} className="group block h-full">
      <article className="bf-collector-card bf-lab-scan relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,rgba(232,121,249,0.14),transparent_55%),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(34,211,238,0.08),transparent_50%)]" />

        <div className="relative flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <span className="bf-lab-label rounded border border-fuchsia-500/35 bg-fuchsia-950/40 px-2.5 py-1 text-fuchsia-300/90">
              Cultivar spotlight
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
              BF Genetics
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-bold uppercase tracking-tight text-white transition group-hover:text-fuchsia-100 sm:text-5xl lg:text-6xl">
            {displayName}
          </h2>

          {genetics ? (
            <p className="mt-3 text-lg font-medium text-fuchsia-300/95 sm:text-xl">{genetics}</p>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">Lineage not documented</p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SpotlightStat label="Lifecycle" value={formatPhaseLabel(phaseLabel)} />
            <SpotlightStat
              label="Countdown"
              value={
                daysRemaining != null
                  ? `${Math.max(daysRemaining, 0)} days remaining`
                  : "—"
              }
              accent
            />
            <SpotlightStat
              label="Harvest"
              value={
                harvestDateLabel
                  ? formatHarvestSpotlightDate(harvestDateLabel)
                  : "Harvest date TBD"
              }
            />
          </div>

          {progressPercent != null ? (
            <div className="mt-8 space-y-2 border-t border-white/[0.08] pt-6">
              <BfProgressBar value={progressPercent} accent="magenta" showValue={false} size="large" />
              <BfCycleBlocks percent={progressPercent} />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                {Math.round(progressPercent)}% complete
              </p>
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}

function SpotlightStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bf-inset-panel p-3">
      <p className="bf-lab-label">{label}</p>
      <p
        className={`mt-1.5 text-sm font-semibold leading-snug ${
          accent ? "text-fuchsia-300" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
