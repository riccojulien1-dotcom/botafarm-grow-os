import Link from "next/link";

import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import type { CommandCenterRoom } from "@/lib/dashboard/get-command-center-data";
import {
  formatCultivarDisplayName,
  formatHarvestInDaysLine,
  formatHarvestSpotlightDate,
  formatOverviewCycleDayLine,
  toTitleCase,
} from "@/lib/ui/format-mission-labels";

type OverviewRoomCardProps = {
  room: CommandCenterRoom;
};

export function OverviewRoomCard({ room }: OverviewRoomCardProps) {
  const cultivarName = room.cultivarDisplayName
    ? formatCultivarDisplayName(room.cultivarDisplayName)
    : null;
  const cycleDayLine = formatOverviewCycleDayLine(room.currentDay, room.status);
  const daysLeft =
    room.daysRemaining != null ? Math.max(room.daysRemaining, 0) : null;
  const harvestDate =
    room.harvestDateLabel && room.harvestDateLabel !== "Not set"
      ? formatHarvestSpotlightDate(room.harvestDateLabel)
      : null;

  return (
    <li>
      <Link href={`/rooms/${room.id}`} className="block h-full">
        <GlassPanel
          glow={
            room.severity === "action" ? "red" : room.severity === "watch" ? "magenta" : "none"
          }
          padding="md"
          interactive
          className="flex h-full flex-col gap-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <h3 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                {toTitleCase(room.name)}
              </h3>
              <GrowRoomStatusBadge status={room.status} />
            </div>
            <RecommendationStatusBadge severity={room.severity} compact />
          </div>

          <div className="space-y-1">
            {cultivarName ? (
              <p className="text-lg font-semibold text-zinc-100">{cultivarName}</p>
            ) : (
              <p className="text-sm text-zinc-500">No cultivar assigned</p>
            )}
            {room.genetics ? (
              <p className="text-sm font-medium text-fuchsia-300/90">{room.genetics}</p>
            ) : null}
          </div>

          <p className="text-sm text-zinc-400">
            {room.plantCount} plant{room.plantCount === 1 ? "" : "s"}
            {room.varietyCount > 1
              ? ` · +${room.varietyCount - 1} more cultivar${room.varietyCount > 2 ? "s" : ""}`
              : ""}
          </p>

          <div className="space-y-1 text-sm">
            {cycleDayLine ? (
              <p className="font-semibold text-fuchsia-300/90">{cycleDayLine}</p>
            ) : null}
            {daysLeft != null ? (
              <p className="font-medium text-zinc-200">{formatHarvestInDaysLine(daysLeft)}</p>
            ) : null}
            {harvestDate ? <p className="text-zinc-500">{harvestDate}</p> : null}
          </div>

          {room.progressPercent != null ? (
            <div className="mt-auto space-y-2 border-t border-white/[0.06] pt-4">
              <BfProgressBar
                value={room.progressPercent}
                accent="magenta"
                showValue={false}
                size="large"
              />
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                {Math.round(room.progressPercent)}% cycle complete
              </p>
            </div>
          ) : null}
        </GlassPanel>
      </Link>
    </li>
  );
}
