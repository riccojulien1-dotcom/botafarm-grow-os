"use client";

import Link from "next/link";
import { ArrowRight, DoorOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import type { CommandCenterRoom } from "@/lib/dashboard/get-command-center-data";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

type OverviewRoomCardProps = {
  room: CommandCenterRoom;
};

export function OverviewRoomCard({ room }: OverviewRoomCardProps) {
  const t = useTranslations("dashboard.roomCard");

  let actionLine = t("noOpenTasks");
  if (room.overdueTasks > 0) {
    actionLine = t("overdueTasks", { count: room.overdueTasks });
  } else if (room.openTasks > 0) {
    actionLine = t("openTasks", { count: room.openTasks });
  }

  return (
    <li>
      <Link href="/dashboard/grow-rooms" className="block h-full">
        <GlassPanel
          glow={room.overdueTasks > 0 ? "red" : room.openTasks > 0 ? "magenta" : "none"}
          padding="md"
          interactive
          className="flex h-full flex-col gap-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-cyan-400" aria-hidden />
                <h3 className="text-lg font-bold uppercase tracking-tight text-white sm:text-xl">
                  {toTitleCase(room.name)}
                </h3>
              </div>
              <GrowRoomStatusBadge status={room.status} />
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
          </div>

          <p className="text-sm leading-snug text-zinc-300">{actionLine}</p>
        </GlassPanel>
      </Link>
    </li>
  );
}
