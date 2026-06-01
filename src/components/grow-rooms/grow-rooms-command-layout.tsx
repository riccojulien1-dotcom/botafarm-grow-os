import { CreateGrowRoomForm } from "@/components/grow-rooms/create-grow-room-form";
import { GrowRoomCard } from "@/components/grow-rooms/grow-room-card";
import { BfMissionKpi } from "@/components/botafarm/bf-mission-kpi";
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
  return (
    <div className="space-y-10">
      <BfPageHeader
        eyebrow="Mission Control"
        title="Grow Rooms"
        subtitle="Active cultivation zones — cycle position, harvest timing, and alerts first."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BfMissionKpi value={rooms.length} label="Rooms" accent="cyan" />
        <BfMissionKpi value={stats.totalPlants} label="Plants" accent="white" />
        <BfMissionKpi value={stats.totalVarieties} label="Varieties" accent="magenta" />
        <BfMissionKpi
          value={stats.alertRooms}
          label="Needs attention"
          accent={stats.alertRooms > 0 ? "alert" : "cyan"}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
            Active zones
          </h2>
          {stats.flowerRooms > 0 ? (
            <span className="bf-section-eyebrow text-fuchsia-400/90">
              {stats.flowerRooms} in flower
            </span>
          ) : null}
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
            <p className="text-center text-sm text-zinc-500">
              No grow rooms yet. Add your first zone below.
            </p>
          </GlassPanel>
        )}
      </section>

      <GlassPanel glow="cyan" padding="lg" className="scroll-mt-24 opacity-95" id="create-room">
        <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          Create new room
        </h2>
        <p className="mt-1 mb-5 text-sm text-zinc-500">
          Secondary — expand your operation when ready.
        </p>
        <CreateGrowRoomForm />
      </GlassPanel>
    </div>
  );
}
