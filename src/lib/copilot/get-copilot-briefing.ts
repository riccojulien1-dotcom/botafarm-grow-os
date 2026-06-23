import { getTranslations } from "next-intl/server";

import { buildLocalizedOperationBriefing } from "@/lib/i18n/localize-operation-briefing";
import { buildLocalizedCommandCenterPriorities } from "@/lib/i18n/localize-command-center";
import { localizeSupervisionRooms } from "@/lib/i18n/localize-environment";
import type { CopilotBriefing } from "@/lib/copilot/types";
import {
  buildSupervisionRooms,
  toOverviewEnvironmentSummaries,
  type SupervisionLogRow,
} from "@/lib/environment/build-supervision-rooms";
import type { GrowRoomTask } from "@/lib/tasks/types";
import { createClient } from "@/lib/supabase/server";

export async function getCopilotBriefing(userId: string): Promise<CopilotBriefing> {
  const tDashboard = await getTranslations("dashboard");
  const tEnvironment = await getTranslations("environment");
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
        "grow_room_id,log_date,logged_at,temperature,humidity,vpd,ec_in,ph_in,ec_runoff,ph_runoff,dryback_percent,ppfd",
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
  const supervisionRooms = localizeSupervisionRooms(
    tEnvironment,
    buildSupervisionRooms(rooms, logs),
  );

  return buildLocalizedOperationBriefing(tDashboard, {
    roomEnvironments: toOverviewEnvironmentSummaries(supervisionRooms),
    priorities: buildLocalizedCommandCenterPriorities(tDashboard, roomsById, tasks),
  });
}
