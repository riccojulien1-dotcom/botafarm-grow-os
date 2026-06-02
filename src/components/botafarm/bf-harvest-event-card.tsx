import { BfCycleBlocks } from "@/components/botafarm/bf-cycle-blocks";
import { BfGeneticsHeader } from "@/components/botafarm/bf-genetics-header";
import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import type { CommandCenterHarvest } from "@/lib/dashboard/get-command-center-data";
import { formatMissionDate, formatRoomStatusLabel } from "@/lib/ui/format-mission-labels";

type BfHarvestEventCardProps = {
  harvest: CommandCenterHarvest;
};

export function BfHarvestEventCard({ harvest }: BfHarvestEventCardProps) {
  const progress = harvest.progressPercent ?? 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bf-lab-label rounded border border-fuchsia-500/30 bg-fuchsia-950/40 px-2 py-1 text-fuchsia-300">
            Next harvest event
          </span>
          <span className="bf-lab-label text-cyan-500/80">
            {harvest.currentDay != null && harvest.targetCycleDays != null
              ? `Cycle day ${harvest.currentDay}`
              : "Cycle tracking active"}
          </span>
        </div>

        <BfGeneticsHeader
          cultivarName={harvest.varietyName}
          genetics={harvest.genetics}
          size="large"
        />

        <p className="text-4xl font-bold uppercase tracking-tight text-fuchsia-300 sm:text-5xl">
          {harvest.daysRemaining}
          <span className="ml-3 text-xl font-bold text-fuchsia-400/80 sm:text-2xl">
            days remaining
          </span>
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-white/[0.06] bg-black/35 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Meta label="Harvest date" value={formatMissionDate(harvest.dateLabel)} accent />
          <Meta label="Zone" value={formatRoomStatusLabel(harvest.status)} />
          <Meta label="Lifecycle" value={harvest.phaseLabel} />
          <Meta label="Room" value={harvest.roomName.toUpperCase()} />
        </div>

        {harvest.progressPercent != null ? (
          <div className="space-y-3 border-t border-white/[0.06] pt-4">
            <BfProgressBar value={progress} accent="magenta" showValue={false} size="large" />
            <BfCycleBlocks percent={progress} />
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
              {Math.round(progress)}% complete
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="bf-lab-label">{label}</p>
      <p
        className={`mt-1 text-sm font-bold uppercase tracking-wide ${
          accent ? "text-cyan-300" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
