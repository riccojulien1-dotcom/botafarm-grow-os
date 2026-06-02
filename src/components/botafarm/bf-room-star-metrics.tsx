import { BfCycleBlocks } from "@/components/botafarm/bf-cycle-blocks";
import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import {
  formatHarvestSpotlightDate,
  formatPhaseLabel,
  formatRoomStatusTitle,
  toTitleCase,
} from "@/lib/ui/format-mission-labels";

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
  compact?: boolean;
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
  compact = false,
}: BfRoomStarMetricsProps) {
  const displayCultivar = cultivarName
    ? cultivarName.includes(" ")
      ? toTitleCase(cultivarName)
      : cultivarName.toUpperCase()
    : null;

  const dayLine =
    currentDay != null && targetCycleDays != null
      ? `Day ${currentDay} of ${targetCycleDays}`
      : currentDay != null
        ? `Day ${currentDay}`
        : "Cycle not set";

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          {displayCultivar ? (
            <>
              <h3
                className={`font-bold uppercase tracking-tight text-white ${
                  compact ? "text-2xl" : "text-3xl sm:text-4xl"
                }`}
              >
                {displayCultivar}
              </h3>
              {genetics ? (
                <p className="text-base font-medium text-fuchsia-300/90">{genetics}</p>
              ) : null}
            </>
          ) : (
            <p className="text-lg font-medium text-zinc-500">No cultivar assigned</p>
          )}

          <p className="text-sm font-medium text-zinc-400">
            {formatRoomStatusTitle(status)}
            {roomName ? (
              <span className="text-zinc-600"> · {toTitleCase(roomName)}</span>
            ) : null}
          </p>

          {varietyCount > 1 ? (
            <p className="bf-lab-label text-zinc-600">
              +{varietyCount - 1} additional cultivar{varietyCount > 2 ? "s" : ""}
            </p>
          ) : null}
        </div>

        {actionLabel ? (
          <span className="shrink-0 rounded-md border border-amber-500/35 bg-amber-950/40 px-2 py-1 text-[10px] font-medium text-amber-100">
            Review
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <HudMeta label="Cycle" value={dayLine} />
        <HudMeta
          label="Remaining"
          value={daysLeft != null ? `${Math.max(daysLeft, 0)} days` : "—"}
          accent="magenta"
        />
        <HudMeta
          label="Harvest"
          value={
            harvestDate && harvestDate !== "Not set"
              ? formatHarvestSpotlightDate(harvestDate)
              : "—"
          }
        />
      </div>

      {phaseLabel ? (
        <p className="text-sm font-semibold text-fuchsia-300/90">{formatPhaseLabel(phaseLabel)}</p>
      ) : null}

      <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
        <span>{plantCount} plants</span>
      </div>

      {progressPercent != null ? (
        <div className="space-y-2 border-t border-white/[0.06] pt-4">
          <BfProgressBar value={progressPercent} accent="magenta" showValue={false} size="large" />
          {!compact ? <BfCycleBlocks percent={progressPercent} /> : null}
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
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
  accent?: "magenta";
}) {
  return (
    <div className="bf-inset-panel p-2.5">
      <p className="bf-lab-label">{label}</p>
      <p
        className={`mt-1 text-xs font-semibold leading-snug sm:text-sm ${
          accent === "magenta" ? "text-fuchsia-300" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
