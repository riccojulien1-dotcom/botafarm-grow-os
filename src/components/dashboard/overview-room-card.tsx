import Link from "next/link";
import {
  CalendarClock,
  DoorOpen,
  Leaf,
  Users,
} from "lucide-react";

import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import type { CommandCenterRoom } from "@/lib/dashboard/get-command-center-data";
import {
  formatHarvestInDaysLine,
  formatHarvestSpotlightDate,
  formatOverviewCycleDayLine,
  toTitleCase,
} from "@/lib/ui/format-mission-labels";

type OverviewRoomCardProps = {
  room: CommandCenterRoom;
};

export function OverviewRoomCard({ room }: OverviewRoomCardProps) {
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
              <div className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-cyan-400" aria-hidden />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                  {toTitleCase(room.name)}
                </h3>
              </div>
              <GrowRoomStatusBadge status={room.status} />
            </div>
            <RecommendationStatusBadge severity={room.severity} compact />
          </div>

          <div className="grid gap-2 text-sm">
            {cycleDayLine ? (
              <p className="flex items-center gap-2 font-semibold text-fuchsia-300/90">
                <CalendarClock className="h-4 w-4 shrink-0" aria-hidden />
                {cycleDayLine}
              </p>
            ) : null}
            {daysLeft != null ? (
              <p className="font-medium text-zinc-200">{formatHarvestInDaysLine(daysLeft)}</p>
            ) : null}
            {harvestDate ? <p className="text-zinc-500">{harvestDate}</p> : null}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-zinc-500" aria-hidden />
              {room.plantCount} plant{room.plantCount === 1 ? "" : "s"}
            </span>
            {room.varietyCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-zinc-500">
                <Leaf className="h-4 w-4" aria-hidden />
                {room.varietyCount} cultivar{room.varietyCount === 1 ? "" : "s"} inside
              </span>
            ) : null}
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
