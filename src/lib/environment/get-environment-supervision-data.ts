import {
  buildEnvironmentAlerts,
  type EnvironmentAlert,
} from "@/lib/environment/build-environment-alerts";
import {
  buildSupervisionRooms,
  type SupervisionLogRow,
  type SupervisionRoom,
} from "@/lib/environment/build-supervision-rooms";
import { createClient } from "@/lib/supabase/server";

export type { SupervisionRoom } from "@/lib/environment/build-supervision-rooms";

export type EnvironmentSupervisionData = {
  rooms: SupervisionRoom[];
  alerts: EnvironmentAlert[];
  totalLogs: number;
};

export async function getEnvironmentSupervisionData(
  userId: string,
): Promise<EnvironmentSupervisionData> {
  const supabase = await createClient();

  const [roomsResult, logsResult, countResult] = await Promise.all([
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
      .from("daily_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const rooms = roomsResult.data ?? [];
  const logs = (logsResult.data ?? []) as SupervisionLogRow[];
  const supervisionRooms = buildSupervisionRooms(rooms, logs);

  return {
    rooms: supervisionRooms,
    alerts: buildEnvironmentAlerts(supervisionRooms),
    totalLogs: countResult.count ?? 0,
  };
}
