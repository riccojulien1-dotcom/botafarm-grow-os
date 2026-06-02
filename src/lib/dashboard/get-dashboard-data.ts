import { countActiveCultivars } from "@/lib/cultivation/fetch-room-cultivars";
import { createClient } from "@/lib/supabase/server";

export type DashboardRecentLog = {
  id: string;
  log_date: string | null;
  logged_at: string;
  temperature: number | null;
  notes: string | null;
  grow_room_id: string;
  room_name: string;
};

export type DashboardData = {
  totalGrowRooms: number;
  totalPlantCount: number;
  activeCultivarCount: number;
  totalJournalLogs: number;
  latestLogDate: string | null;
  latestTemperature: number | null;
  latestHumidity: number | null;
  latestEc: number | null;
  latestPh: number | null;
  latestRoom: { id: string; name: string; status: string; created_at: string } | null;
  latestActiveRoomId: string | null;
  recentLogs: DashboardRecentLog[];
};

function formatLogDate(logDate: string | null, loggedAt: string) {
  return logDate ?? new Date(loggedAt).toISOString().slice(0, 10);
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient();

  const [roomsResult, logsCountResult, latestLogResult, recentLogsResult, activeCultivarCount] =
    await Promise.all([
      supabase
        .from("grow_rooms")
        .select("id,name,status,plant_count,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("daily_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("daily_logs")
        .select(
          "id,log_date,logged_at,temperature,humidity,ec_in,ph_in,grow_room_id,grow_rooms(name)",
        )
        .eq("user_id", userId)
        .order("log_date", { ascending: false })
        .order("logged_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("daily_logs")
        .select(
          "id,log_date,logged_at,temperature,notes,grow_room_id,grow_rooms(name)",
        )
        .eq("user_id", userId)
        .order("log_date", { ascending: false })
        .order("logged_at", { ascending: false })
        .limit(5),
      countActiveCultivars(userId),
    ]);

  const rooms = roomsResult.data ?? [];
  const totalPlantCount = rooms.reduce((sum, room) => sum + (room.plant_count ?? 0), 0);
  const latestRoom = rooms[0] ?? null;

  const latestLog = latestLogResult.data;

  const recentLogs: DashboardRecentLog[] = (recentLogsResult.data ?? []).map((log) => {
    const relation = log.grow_rooms as { name: string } | { name: string }[] | null;
    const roomName = Array.isArray(relation) ? relation[0]?.name : relation?.name;

    return {
      id: log.id,
      log_date: log.log_date,
      logged_at: log.logged_at,
      temperature: log.temperature,
      notes: log.notes,
      grow_room_id: log.grow_room_id,
      room_name: roomName ?? "Unknown room",
    };
  });

  const latestActiveRoomId = latestLog?.grow_room_id ?? latestRoom?.id ?? null;

  return {
    totalGrowRooms: rooms.length,
    totalPlantCount,
    activeCultivarCount,
    totalJournalLogs: logsCountResult.count ?? 0,
    latestLogDate: latestLog
      ? formatLogDate(latestLog.log_date, latestLog.logged_at)
      : null,
    latestTemperature: latestLog?.temperature ?? null,
    latestHumidity: latestLog?.humidity ?? null,
    latestEc: latestLog?.ec_in ?? null,
    latestPh: latestLog?.ph_in ?? null,
    latestRoom: latestRoom
      ? {
          id: latestRoom.id,
          name: latestRoom.name,
          status: latestRoom.status,
          created_at: latestRoom.created_at,
        }
      : null,
    latestActiveRoomId,
    recentLogs,
  };
}
