import { GrowRoomsCommandLayout } from "@/components/grow-rooms/grow-rooms-command-layout";
import type { GrowRoomListItem } from "@/components/grow-rooms/grow-room-card";
import { requireUser } from "@/lib/auth/get-user";
import { getRecommendationSummary } from "@/lib/recommendations/evaluate-recommendations";
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
  const harvestMap = new Map<string, ReturnType<typeof toVarietyForHarvest>[]>();
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

  const roomList = (rooms ?? []) as GrowRoomListItem[];
  const { harvestMap, recordMap } = groupVarietiesByRoom(
    (varieties ?? []) as Array<RoomVarietyRecord & { grow_room_id: string }>,
  );
  const latestLogByRoom = indexLatestLogsByRoom(
    (logs ?? []) as DailyLogForRecommendations[],
  );
  const taskSummaryByRoom = indexTaskSummariesByRoom((tasks ?? []) as GrowRoomTask[]);

  let alertRooms = 0;
  let totalVarieties = 0;
  const totalPlants = roomList.reduce((sum, room) => sum + (room.plant_count ?? 0), 0);

  for (const room of roomList) {
    const roomVarieties = recordMap.get(room.id) ?? [];
    totalVarieties += roomVarieties.length;
    const summary = getRecommendationSummary(
      latestLogByRoom.get(room.id) ?? null,
      room.status,
      roomVarieties,
    );
    if (summary.severity !== "good") {
      alertRooms += 1;
    }
  }

  return (
    <GrowRoomsCommandLayout
      rooms={roomList}
      harvestMap={harvestMap}
      recordMap={recordMap}
      latestLogByRoom={latestLogByRoom}
      taskSummaryByRoom={taskSummaryByRoom}
      stats={{
        totalPlants,
        totalVarieties,
        alertRooms,
        flowerRooms: roomList.filter((room) => room.status === "Flower").length,
      }}
    />
  );
}
