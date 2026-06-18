import { buildCommandCenterPriorities } from "@/lib/dashboard/command-center-priorities";
import { buildOperationBriefing } from "@/lib/copilot/build-operation-briefing";
import type { CopilotBriefing } from "@/lib/copilot/types";
import {
  buildSupervisionRooms,
  toOverviewEnvironmentSummaries,
  type SupervisionLogRow,
} from "@/lib/environment/build-supervision-rooms";
import type { GrowRoomTask } from "@/lib/tasks/types";
import { createClient } from "@/lib/supabase/server";

export async function getCopilotBriefing(userId: string): Promise<CopilotBriefing> {
  const supabase = await createClient();

  const [roomsResult, logsResult, tasksResult] = await Promise.all([
    supabase
      .from("grow_rooms")
      .select("id,name,status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("daily_logs")
      .select(
        "grow_room_id,log_date,logged_at,temperature,humidity,ec_in,ph_in,ec_runoff,ph_runoff,dryback_percent,vpd,ppfd",
      )
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .order("logged_at", { ascending: false }),
    supabase
      .from("grow_room_tasks")
      .select("id,grow_room_id,title,due_date,completed,completed_at,priority,category")
      .eq("user_id", userId),
  ]);

  const rooms = roomsResult.data ?? [];
  const logs = (logsResult.data ?? []) as SupervisionLogRow[];
  const tasks = (tasksResult.data ?? []) as GrowRoomTask[];
  const roomsById = new Map(rooms.map((room) => [room.id, { name: room.name }]));
  const supervisionRooms = buildSupervisionRooms(rooms, logs);

  return buildOperationBriefing({
    roomEnvironments: toOverviewEnvironmentSummaries(supervisionRooms),
    priorities: buildCommandCenterPriorities(roomsById, tasks),
  });
}
