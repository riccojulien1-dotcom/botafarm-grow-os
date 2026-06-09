import { indexTrendLogsByRoom } from "@/lib/dashboard/build-room-environment-summaries";
import {
  buildEnvironmentAlerts,
  type EnvironmentAlert,
} from "@/lib/environment/build-environment-alerts";
import { getSupervisionRoomAttentionReason } from "@/lib/environment/environment-room-attention";
import {
  buildSupervisionMetrics,
  type SupervisionMetric,
} from "@/lib/environment/build-supervision-metrics";
import { resolveRoomSupervisionStatus } from "@/lib/environment/metric-insights";
import { formatRelativeTime } from "@/lib/environment/format-relative-time";
import { formatLogDateLabel } from "@/lib/recommendations/latest-log-by-room";
import { indexLatestLogsByRoom } from "@/lib/recommendations/latest-log-by-room";
import { createClient } from "@/lib/supabase/server";

const SUPERVISION_LOGS_PER_ROOM = 30;

export type SupervisionRoom = {
  id: string;
  name: string;
  status: string;
  roomStatus: ReturnType<typeof resolveRoomSupervisionStatus>["status"];
  roomStatusLabel: string;
  roomHealthEmoji: string;
  attentionReason: string | null;
  lastLogDate: string | null;
  lastLogFreshness: string | null;
  hasJournalEntries: boolean;
  metrics: SupervisionMetric[];
};

export type EnvironmentSupervisionData = {
  rooms: SupervisionRoom[];
  alerts: EnvironmentAlert[];
  totalLogs: number;
};

type SupervisionLogRow = {
  grow_room_id: string;
  log_date: string | null;
  logged_at: string;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ec_in: number | null;
  ph_in: number | null;
  ec_runoff: number | null;
  ph_runoff: number | null;
  dryback_percent: number | null;
  ppfd: number | null;
};

function formatLastLogFreshness(log: { log_date: string | null; logged_at: string }): string {
  const today = new Date().toISOString().slice(0, 10);
  const logDate = log.log_date ?? log.logged_at.slice(0, 10);
  if (logDate === today) {
    return "today";
  }
  return formatRelativeTime(log.logged_at);
}

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
  const latestLogByRoom = indexLatestLogsByRoom(logs) as Map<string, SupervisionLogRow>;
  const trendLogsByRoom = indexTrendLogsByRoom(logs, SUPERVISION_LOGS_PER_ROOM) as Map<
    string,
    SupervisionLogRow[]
  >;

  const supervisionRooms: SupervisionRoom[] = rooms.map((room) => {
    const trendLogs = trendLogsByRoom.get(room.id) ?? [];
    const latestLog = latestLogByRoom.get(room.id) ?? trendLogs.at(-1) ?? null;
    const hasJournalEntries = trendLogs.length > 0;
    const metrics = buildSupervisionMetrics(trendLogs, room.status);
    const roomStatus = resolveRoomSupervisionStatus(
      hasJournalEntries,
      metrics.map((metric) => metric.status),
    );

    return {
      id: room.id,
      name: room.name,
      status: room.status,
      roomStatus: roomStatus.status,
      roomStatusLabel: roomStatus.label,
      roomHealthEmoji: roomStatus.healthEmoji,
      attentionReason: getSupervisionRoomAttentionReason(
        hasJournalEntries,
        roomStatus.status,
        metrics,
      ),
      lastLogDate: latestLog ? formatLogDateLabel(latestLog) : null,
      lastLogFreshness: latestLog ? formatLastLogFreshness(latestLog) : null,
      hasJournalEntries,
      metrics,
    };
  });

  return {
    rooms: supervisionRooms,
    alerts: buildEnvironmentAlerts(supervisionRooms),
    totalLogs: countResult.count ?? 0,
  };
}
