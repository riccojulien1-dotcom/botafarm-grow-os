"use client";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import { supervisionRoomStatusStyles } from "@/components/environment/environment-status-styles";
import type { SupervisionRoom } from "@/lib/environment/get-environment-supervision-data";
import { toTitleCase } from "@/lib/ui/format-mission-labels";
import { useTranslations } from "next-intl";

type EnvironmentRoomHealthOverviewProps = {
  rooms: SupervisionRoom[];
  onSelectRoom: (roomId: string) => void;
};

export function EnvironmentRoomHealthOverview({
  rooms,
  onSelectRoom,
}: EnvironmentRoomHealthOverviewProps) {
  const t = useTranslations("environment.room");
  if (!rooms.length) {
    return null;
  }

  const sortedRooms = [...rooms].sort((left, right) => {
    const rank = (room: SupervisionRoom) => {
      if (room.roomStatus === "action") return 0;
      if (room.roomStatus === "watch") return 1;
      if (room.roomStatus === "no_data") return 2;
      return 3;
    };
    return rank(left) - rank(right) || left.name.localeCompare(right.name);
  });

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-white sm:text-xl">
        {t("healthOverview")}
      </h2>

      <GlassPanel padding="md">
        <ul className="divide-y divide-white/[0.06]">
          {sortedRooms.map((room) => (
            <li key={room.id}>
              <button
                type="button"
                onClick={() => onSelectRoom(room.id)}
                className="bf-interactive flex w-full items-start justify-between gap-4 rounded-lg px-2 py-3 text-left transition hover:bg-white/[0.03]"
              >
                <div className="min-w-0 space-y-1">
                  <span className="block text-base font-semibold text-white sm:text-lg">
                    {toTitleCase(room.name)}
                  </span>
                  {room.attentionReason ? (
                    <span className="block text-sm leading-snug text-zinc-400">
                      {room.attentionReason}
                    </span>
                  ) : null}
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${supervisionRoomStatusStyles[room.roomStatus]}`}
                >
                  <span aria-hidden>{room.roomHealthEmoji}</span>
                  {room.roomStatusLabel}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </section>
  );
}
