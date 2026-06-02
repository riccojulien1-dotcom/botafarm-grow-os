import { BfCycleBlocks } from "@/components/botafarm/bf-cycle-blocks";
import { BfGeneticsHeader } from "@/components/botafarm/bf-genetics-header";
import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import { formatMissionDate, formatRoomStatusLabel } from "@/lib/ui/format-mission-labels";

type BfRoomStarMetricsProps = {
  status: string;
  roomName?: string;
  cultivarName?: string | null;
  genetics?: string | null;
  varietyCount?: number;
  currentDay: number | null;
  targetCycleDays?: number | null;
  daysLeft: number | null;
  plantCount: number;
  harvestDate: string | null;
  phaseLabel?: string;
  progressPercent?: number | null;
  actionLabel?: string | null;
  showRoomName?: boolean;
};

export function BfRoomStarMetrics({
  status,
  roomName,
  cultivarName = null,
  genetics = null,
  varietyCount = 0,
  currentDay,
  targetCycleDays = null,
  daysLeft,
  plantCount,
  harvestDate,
  phaseLabel,
  progressPercent = null,
  actionLabel,
  showRoomName = false,
}: BfRoomStarMetricsProps) {
  const harvestDisplay =
    harvestDate && harvestDate !== "Not set"
      ? formatMissionDate(harvestDate)
      : "—";

  const dayLine =
    currentDay != null && targetCycleDays != null
      ? `DAY ${currentDay} OF ${targetCycleDays}`
      : currentDay != null
        ? `DAY ${currentDay}`
        : "CYCLE NOT SET";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-4">
          <BfGeneticsHeader cultivarName={cultivarName} genetics={genetics} />
          <div className="flex flex-wrap gap-2">
            <span className="bf-lab-label rounded border border-cyan-500/25 bg-cyan-950/30 px-2 py-1 text-cyan-300/90">
              {formatRoomStatusLabel(status)}
            </span>
            {showRoomName && roomName ? (
              <span className="bf-lab-label text-zinc-500">{roomName.toUpperCase()}</span>
            ) : null}
            {varietyCount > 1 ? (
              <span className="bf-lab-label text-zinc-600">
                +{varietyCount - 1} additional cultivar{varietyCount > 2 ? "s" : ""}
              </span>
            ) : null}
          </div>
        </div>
        {actionLabel ? (
          <span className="shrink-0 rounded-lg border border-red-500/45 bg-red-950/55 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red-200">
            {actionLabel}
          </span>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div className="space-y-3">
          <p className="text-3xl font-bold uppercase tracking-tight text-cyan-300 sm:text-4xl lg:text-5xl">
            {dayLine}
          </p>
          {daysLeft != null ? (
            <p className="text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
              {Math.max(daysLeft, 0)}
              <span className="ml-2 text-base font-medium text-zinc-400 sm:text-lg">
                days remaining
              </span>
            </p>
          ) : null}
          {phaseLabel ? (
            <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-400/90">
              {phaseLabel}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <HudMeta label="Plants" value={String(plantCount)} />
          <HudMeta label="Harvest" value={harvestDisplay} accent="cyan" />
        </div>
      </div>

      {progressPercent != null ? (
        <div className="space-y-3 border-t border-white/[0.06] pt-5">
          <BfProgressBar value={progressPercent} accent="magenta" showValue={false} size="large" />
          <BfCycleBlocks percent={progressPercent} />
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            {Math.round(progressPercent)}% cycle complete
          </p>
        </div>
      ) : null}
    </div>
  );
}

function HudMeta({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "cyan";
}) {
  return (
    <div className="bf-inset-panel p-3">
      <p className="bf-lab-label">{label}</p>
      <p
        className={`mt-1 text-sm font-bold uppercase tracking-wide ${
          accent === "cyan" ? "text-cyan-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
