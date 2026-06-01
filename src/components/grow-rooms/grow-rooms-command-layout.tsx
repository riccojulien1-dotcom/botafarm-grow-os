import { CreateGrowRoomForm } from "@/components/grow-rooms/create-grow-room-form";
import { GrowRoomCard } from "@/components/grow-rooms/grow-room-card";
import { BfHeading } from "@/components/botafarm/bf-heading";
import { BfStatTile } from "@/components/botafarm/bf-stat-tile";
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
    <div className="space-y-8">
      <BfHeading
        eyebrow="Cultivation zones"
        title="Grow Rooms"
        subtitle="Every room at a glance — status, alerts, tasks, and harvest timing."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BfStatTile label="Rooms" value={rooms.length} accent="cyan" compact />
        <BfStatTile label="Total plants" value={stats.totalPlants} accent="neutral" compact />
        <BfStatTile
          label="Varieties"
          value={stats.totalVarieties}
          accent="magenta"
          compact
        />
        <BfStatTile
          label="Needs attention"
          value={stats.alertRooms}
          accent={stats.alertRooms > 0 ? "alert" : "success"}
          compact
        />
      </div>

      <GlassPanel glow="cyan" padding="lg" className="scroll-mt-24" id="create-room">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80">
          Deploy new zone
        </h2>
        <p className="mt-1 mb-4 text-sm text-zinc-500">Add a room or tent to your operation.</p>
        <CreateGrowRoomForm />
      </GlassPanel>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Active zones ({rooms.length})
          </h2>
          {stats.flowerRooms > 0 ? (
            <span className="text-xs text-fuchsia-400/90">
              {stats.flowerRooms} in flower
            </span>
          ) : null}
        </div>

        {rooms.length ? (
          <ul className="grid gap-4 lg:grid-cols-2">
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
              No grow rooms yet. Deploy your first zone above.
            </p>
          </GlassPanel>
        )}
      </section>
    </div>
  );
}
