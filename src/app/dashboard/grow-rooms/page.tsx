import { CreateGrowRoomForm } from "@/components/grow-rooms/create-grow-room-form";
import { GrowRoomCard } from "@/components/grow-rooms/grow-room-card";
import { requireUser } from "@/lib/auth/get-user";
import type { VarietyForHarvest } from "@/lib/grow-rooms/crop-cycle";
import {
  indexLatestLogsByRoom,
  type DailyLogForRecommendations,
} from "@/lib/recommendations/latest-log-by-room";
import { indexTaskSummariesByRoom } from "@/lib/tasks/task-stats";
import type { GrowRoomTask } from "@/lib/tasks/types";
import { toVarietyForHarvest } from "@/lib/varieties/intelligence";
import { ROOM_VARIETY_SELECT } from "@/lib/varieties/queries";
import type { RoomVarietyRecord } from "@/lib/varieties/types";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function groupVarietiesByRoom(
  varieties: Array<RoomVarietyRecord & { grow_room_id: string }>,
) {
  const harvestMap = new Map<string, VarietyForHarvest[]>();
  const recordMap = new Map<string, RoomVarietyRecord[]>();

  for (const variety of varieties) {
    const { grow_room_id: growRoomId, ...entry } = variety;
    const harvestList = harvestMap.get(growRoomId) ?? [];
    harvestList.push(toVarietyForHarvest(entry));
    harvestMap.set(growRoomId, harvestList);

    const recordList = recordMap.get(growRoomId) ?? [];
    recordList.push(entry);
    recordMap.set(growRoomId, recordList);
  }

  return { harvestMap, recordMap };
}

export default async function GrowRoomsPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: rooms }, { data: varieties }, { data: logs }, { data: tasks }] =
    await Promise.all([
    supabase
      .from("grow_rooms")
      .select(
        "id,name,status,room_type,plant_count,dimensions,lighting,substrate,genetics,irrigation,notes,cycle_start_date,target_cycle_days,created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("room_varieties")
      .select(`${ROOM_VARIETY_SELECT},grow_room_id`)
      .eq("user_id", user.id),
    supabase
      .from("daily_logs")
      .select(
        "grow_room_id,log_date,logged_at,ec_in,ph_in,ec_runoff,ph_runoff,dryback_percent,vpd,ppfd",
      )
      .eq("user_id", user.id)
      .order("log_date", { ascending: false })
      .order("logged_at", { ascending: false }),
    supabase
      .from("grow_room_tasks")
      .select(
        "id,grow_room_id,title,description,due_date,completed,completed_at,priority,category,created_at,updated_at",
      )
      .eq("user_id", user.id),
  ]);

  const { harvestMap, recordMap } = groupVarietiesByRoom(
    (varieties ?? []) as Array<RoomVarietyRecord & { grow_room_id: string }>,
  );
  const latestLogByRoom = indexLatestLogsByRoom(
    (logs ?? []) as DailyLogForRecommendations[],
  );
  const taskSummaryByRoom = indexTaskSummariesByRoom((tasks ?? []) as GrowRoomTask[]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Grow rooms</h1>
        <p className="text-sm text-zinc-400">Create and manage your rooms and tents.</p>
      </div>

      <div id="create-room">
        <CreateGrowRoomForm />
      </div>

      <div className="space-y-3">
        <p className="text-sm text-zinc-400">Existing rooms</p>
        {rooms?.length ? (
          <ul className="space-y-3">
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
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-sm text-zinc-400">
            No grow room yet. Create your first one above.
          </p>
        )}
      </div>
    </section>
  );
}
