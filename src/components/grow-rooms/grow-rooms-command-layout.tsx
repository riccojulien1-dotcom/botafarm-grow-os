"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, DoorOpen, Flower2, Users } from "lucide-react";

import { CreateGrowRoomForm } from "@/components/grow-rooms/create-grow-room-form";
import { GrowRoomCard } from "@/components/grow-rooms/grow-room-card";
import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import type { GrowRoomListItem } from "@/components/grow-rooms/grow-room-card";
import type { VarietyForHarvest } from "@/lib/grow-rooms/crop-cycle";
import type { RecommendationLogInput } from "@/lib/recommendations/types";
import type { RoomTaskSummary } from "@/lib/tasks/task-stats";
import type { RoomVarietyRecord } from "@/lib/varieties/types";

type GrowRoomsCommandLayoutProps = {
  rooms: GrowRoomListItem[];
  harvestMap: Map<string, VarietyForHarvest[]>;
  recordMap: Map<string, RoomVarietyRecord[]>;
  latestLogByRoom: Map<string, RecommendationLogInput>;
  taskSummaryByRoom: Map<string, RoomTaskSummary>;
  stats: {
    totalPlants: number;
    totalVarieties: number;
    alertRooms: number;
    flowerRooms: number;
  };
};

export function GrowRoomsCommandLayout({
  rooms,
  harvestMap,
  recordMap,
  latestLogByRoom,
  taskSummaryByRoom,
  stats,
}: GrowRoomsCommandLayoutProps) {
  const t = useTranslations("growRooms");

  return (
    <div className="space-y-8">
      <BfPageHeader
        eyebrow={t("page.eyebrow")}
        title={t("page.title")}
        subtitle={t("page.subtitle")}
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatChip icon={DoorOpen} label={t("stats.activeRooms")} value={String(rooms.length)} tone="cyan" />
        <StatChip icon={Users} label={t("stats.totalPlants")} value={String(stats.totalPlants)} tone="white" />
        <StatChip
          icon={AlertTriangle}
          label={t("stats.needsAttention")}
          value={String(stats.alertRooms)}
          tone={stats.alertRooms > 0 ? "red" : "emerald"}
        />
        <StatChip icon={Flower2} label={t("stats.inFlower")} value={String(stats.flowerRooms)} tone="magenta" />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white">{t("page.allRooms")}</h2>
          <span className="bf-section-eyebrow">{t("page.zoneCount", { count: rooms.length })}</span>
        </div>

        {rooms.length ? (
          <ul className="grid gap-5 lg:grid-cols-2">
            {rooms.map((room) => (
              <GrowRoomCard
                key={room.id}
                room={room}
                varieties={harvestMap.get(room.id) ?? []}
                roomVarieties={recordMap.get(room.id) ?? []}
                latestLog={latestLogByRoom.get(room.id) ?? null}
                taskSummary={taskSummaryByRoom.get(room.id)}
              />
            ))}
          </ul>
        ) : (
          <GlassPanel padding="lg">
            <p className="text-center text-sm text-zinc-500">{t("page.empty")}</p>
          </GlassPanel>
        )}
      </section>

      <GlassPanel glow="cyan" padding="lg" className="scroll-mt-24 opacity-95" id="create-room">
        <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">{t("page.addRoom")}</h2>
        <p className="mt-1 mb-5 text-sm text-zinc-500">{t("page.addRoomHint")}</p>
        <CreateGrowRoomForm />
      </GlassPanel>
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof DoorOpen;
  label: string;
  value: string;
  tone: "cyan" | "white" | "red" | "emerald" | "magenta";
}) {
  const styles = {
    cyan: "border-cyan-500/25 bg-cyan-950/20 text-cyan-300",
    white: "border-white/10 bg-black/25 text-white",
    red: "border-red-500/30 bg-red-950/25 text-red-300",
    emerald: "border-emerald-500/25 bg-emerald-950/20 text-emerald-300",
    magenta: "border-fuchsia-500/25 bg-fuchsia-950/20 text-fuchsia-300",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${styles[tone]}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 opacity-80" aria-hidden />
        <p className="text-[10px] uppercase tracking-wider opacity-70">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
