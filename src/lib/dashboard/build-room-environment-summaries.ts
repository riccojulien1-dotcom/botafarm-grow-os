import {
  buildEnvironmentMetrics,
  type EnvironmentMetricSnapshot,
} from "@/lib/environment/build-environment-metrics";
import { formatRelativeTime } from "@/lib/environment/format-relative-time";
import {
  formatLogDateLabel,
  type DailyLogForRecommendations,
} from "@/lib/recommendations/latest-log-by-room";
import type { RecommendationSeverity } from "@/lib/recommendations/types";

export type DashboardRoomEnvironmentLog = DailyLogForRecommendations & {
  temperature: number | null;
  humidity: number | null;
};

export type DashboardRoomEnvironmentStatus =
  | "good"
  | "watch"
  | "action"
  | "insufficient_data";

export type DashboardRoomEnvironment = {
  roomId: string;
  roomName: string;
  hasJournalEntries: boolean;
  lastLogFreshness: string | null;
  metrics: EnvironmentMetricSnapshot[];
  status: DashboardRoomEnvironmentStatus;
  statusLabel: string;
};

const TREND_LOGS_PER_ROOM = 14;

export function indexTrendLogsByRoom(
  logs: DashboardRoomEnvironmentLog[],
  limitPerRoom = TREND_LOGS_PER_ROOM,
): Map<string, DashboardRoomEnvironmentLog[]> {
  const byRoom = new Map<string, DashboardRoomEnvironmentLog[]>();

  for (const log of logs) {
    const list = byRoom.get(log.grow_room_id) ?? [];
    if (list.length < limitPerRoom) {
      list.push(log);
      byRoom.set(log.grow_room_id, list);
    }
  }

  for (const [roomId, list] of byRoom) {
    byRoom.set(roomId, [...list].reverse());
  }

  return byRoom;
}

function formatDashboardLogFreshness(log: DashboardRoomEnvironmentLog): string {
  const today = new Date().toISOString().slice(0, 10);
  const logDate = formatLogDateLabel(log);
  if (logDate === today) {
    return "today";
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (logDate === yesterday.toISOString().slice(0, 10)) {
    return "yesterday";
  }

  return formatRelativeTime(log.logged_at);
}

function resolveEnvironmentStatus(
  hasJournalEntries: boolean,
  severity: RecommendationSeverity,
): { status: DashboardRoomEnvironmentStatus; statusLabel: string } {
  if (!hasJournalEntries) {
    return { status: "insufficient_data", statusLabel: "Insufficient data" };
  }

  if (severity === "action") {
    return { status: "action", statusLabel: "Action required" };
  }
  if (severity === "watch") {
    return { status: "watch", statusLabel: "Watch" };
  }
  return { status: "good", statusLabel: "Good" };
}

type RoomEnvironmentSource = {
  id: string;
  name: string;
  status: string;
  severity: RecommendationSeverity;
};

export function buildRoomEnvironmentSummaries(
  rooms: RoomEnvironmentSource[],
  latestLogsByRoom: Map<string, DashboardRoomEnvironmentLog>,
  trendLogsByRoom: Map<string, DashboardRoomEnvironmentLog[]>,
): DashboardRoomEnvironment[] {
  return rooms.map((room) => {
    const trendLogs = trendLogsByRoom.get(room.id) ?? [];
    const latestLog = latestLogsByRoom.get(room.id) ?? trendLogs.at(-1) ?? null;
    const hasJournalEntries = trendLogs.length > 0;
    const { status, statusLabel } = resolveEnvironmentStatus(
      hasJournalEntries,
      room.severity,
    );

    return {
      roomId: room.id,
      roomName: room.name,
      hasJournalEntries,
      lastLogFreshness: latestLog ? formatDashboardLogFreshness(latestLog) : null,
      metrics: buildEnvironmentMetrics(trendLogs, room.status),
      status,
      statusLabel,
    };
  });
}
