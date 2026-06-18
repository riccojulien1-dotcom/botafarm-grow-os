import { resolveLogDate } from "@/lib/journal/build-chart-series";
import type { DailyLogRecord } from "@/lib/journal/daily-log-fields";
import { buildMetricDeltas } from "@/lib/journal/journal-metric-deltas";
import type {
  JournalDashboardStats,
  JournalRoomSummary,
  JournalTimelineEntry,
  JournalTimelineLog,
} from "@/lib/journal/journal-types";
import { fetchPhotosByLogIds } from "@/lib/journal/log-photos";
import { createClient } from "@/lib/supabase/server";

const JOURNAL_LOG_SELECT =
  "grow_room_id,id,log_date,logged_at,temperature,humidity,vpd,ppfd,dli,ec_in,ph_in,ec_runoff,ph_runoff,irrigation_count,irrigation_volume_per_event,runoff_percent,dryback_percent,plant_height_cm,stretch_percent,notes";

export const STALE_LOG_DAYS = 3;

export type JournalFilters = {
  roomId?: string;
  from?: string;
  to?: string;
};

export type JournalPageData = {
  rooms: Array<{ id: string; name: string }>;
  stats: JournalDashboardStats;
  timeline: JournalTimelineEntry[];
};

function daysBetween(fromIso: string, toIso: string) {
  const from = new Date(`${fromIso}T12:00:00`);
  const to = new Date(`${toIso}T12:00:00`);
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function buildRoomSummaries(
  rooms: Array<{ id: string; name: string }>,
  logsByRoom: Map<string, Array<{ log_date: string | null; logged_at: string }>>,
  today: string,
): JournalRoomSummary[] {
  return rooms.map((room) => {
    const roomLogs = logsByRoom.get(room.id) ?? [];
    const sorted = roomLogs
      .slice()
      .sort((left, right) => resolveLogDate(right).localeCompare(resolveLogDate(left)));
    const lastLogDate = sorted[0] ? resolveLogDate(sorted[0]) : null;
    const hasLogToday = roomLogs.some((log) => resolveLogDate(log) === today);
    const daysSinceLastLog = lastLogDate ? daysBetween(lastLogDate, today) : null;

    return {
      id: room.id,
      name: room.name,
      logCount: roomLogs.length,
      lastLogDate,
      hasLogToday,
      daysSinceLastLog,
    };
  });
}

export function buildJournalDashboardStats(
  roomSummaries: JournalRoomSummary[],
): JournalDashboardStats {
  const latestEntryDate =
    roomSummaries
      .map((room) => room.lastLogDate)
      .filter((date): date is string => date != null)
      .sort()
      .at(-1) ?? null;

  const missingTodayRooms = roomSummaries
    .filter((room) => !room.hasLogToday)
    .map((room) => ({ id: room.id, name: room.name }));

  const staleRooms = roomSummaries
    .filter(
      (room) =>
        room.daysSinceLastLog == null || room.daysSinceLastLog >= STALE_LOG_DAYS,
    )
    .map((room) => ({
      id: room.id,
      name: room.name,
      daysSince: room.daysSinceLastLog ?? 999,
    }));

  return {
    latestEntryDate,
    totalLogs: roomSummaries.reduce((sum, room) => sum + room.logCount, 0),
    missingTodayCount: missingTodayRooms.length,
    staleRoomCount: staleRooms.length,
    rooms: roomSummaries,
    missingTodayRooms,
    staleRooms,
  };
}

function passesDateFilter(logDate: string, filters: JournalFilters) {
  if (filters.from && logDate < filters.from) {
    return false;
  }
  if (filters.to && logDate > filters.to) {
    return false;
  }
  return true;
}

export function buildJournalTimeline(
  logs: JournalTimelineLog[],
  photosByLogId: Map<string, JournalTimelineEntry["photos"]>,
  filters: JournalFilters,
): JournalTimelineEntry[] {
  const filtered = logs.filter((log) => {
    if (filters.roomId && log.grow_room_id !== filters.roomId) {
      return false;
    }
    return passesDateFilter(resolveLogDate(log), filters);
  });

  const sorted = filtered
    .slice()
    .sort((left, right) => {
      const dateCompare = resolveLogDate(right).localeCompare(resolveLogDate(left));
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return right.logged_at.localeCompare(left.logged_at);
    });

  const previousByRoom = new Map<string, JournalTimelineLog>();

  const chronological = sorted.slice().reverse();
  const deltasByLogId = new Map<string, ReturnType<typeof buildMetricDeltas>>();

  for (const log of chronological) {
    const previous = previousByRoom.get(log.grow_room_id) ?? null;
    deltasByLogId.set(log.id, buildMetricDeltas(log, previous));
    previousByRoom.set(log.grow_room_id, log);
  }

  return sorted.map((log) => ({
    log,
    photos: photosByLogId.get(log.id) ?? [],
    metricDeltas: deltasByLogId.get(log.id) ?? buildMetricDeltas(log, null),
  }));
}

export async function getJournalPageData(
  userId: string,
  filters: JournalFilters = {},
): Promise<JournalPageData> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [roomsResult, logsResult] = await Promise.all([
    supabase
      .from("grow_rooms")
      .select("id,name")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("daily_logs")
      .select(JOURNAL_LOG_SELECT)
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .order("logged_at", { ascending: false }),
  ]);

  const rooms = roomsResult.data ?? [];
  const roomNameById = new Map(rooms.map((room) => [room.id, room.name]));
  const rawLogs = (logsResult.data ?? []) as Array<
    DailyLogRecord & { grow_room_id: string }
  >;

  const logsByRoom = new Map<string, Array<{ log_date: string | null; logged_at: string }>>();
  for (const log of rawLogs) {
    const list = logsByRoom.get(log.grow_room_id) ?? [];
    list.push({ log_date: log.log_date, logged_at: log.logged_at });
    logsByRoom.set(log.grow_room_id, list);
  }

  const roomSummaries = buildRoomSummaries(rooms, logsByRoom, today);
  const stats = buildJournalDashboardStats(roomSummaries);

  const timelineLogs: JournalTimelineLog[] = rawLogs.map((log) => ({
    ...log,
    roomName: roomNameById.get(log.grow_room_id) ?? "Unknown room",
  }));

  const photosByLogId = await fetchPhotosByLogIds(
    supabase,
    timelineLogs.map((log) => log.id),
  );

  const timeline = buildJournalTimeline(timelineLogs, photosByLogId, filters);

  return {
    rooms,
    stats,
    timeline,
  };
}
