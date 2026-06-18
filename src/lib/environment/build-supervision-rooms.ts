import {
  indexTrendLogsByRoom,
  type DashboardRoomEnvironmentLog,
} from "@/lib/dashboard/build-room-environment-summaries";
import { getSupervisionRoomAttentionReason } from "@/lib/environment/environment-room-attention";
import {
  buildSupervisionMetrics,
  type SupervisionMetric,
} from "@/lib/environment/build-supervision-metrics";
import {
  resolveRoomSupervisionStatus,
  type SupervisionRoomStatus,
} from "@/lib/environment/metric-insights";
import { formatRelativeTime } from "@/lib/environment/format-relative-time";
import { formatLogDateLabel, indexLatestLogsByRoom } from "@/lib/recommendations/latest-log-by-room";

export const SUPERVISION_LOGS_PER_ROOM = 30;

export type SupervisionLogRow = DashboardRoomEnvironmentLog & {
  dryback_percent?: number | null;
  ppfd?: number | null;
};

export type SupervisionRoom = {
  id: string;
  name: string;
  status: string;
  roomStatus: SupervisionRoomStatus;
  roomStatusLabel: string;
  roomHealthEmoji: string;
  attentionReason: string | null;
  lastLogDate: string | null;
  lastLogFreshness: string | null;
  hasJournalEntries: boolean;
  metrics: SupervisionMetric[];
};

export type OverviewEnvironmentSummary = {
  roomId: string;
  roomName: string;
  hasJournalEntries: boolean;
  status: SupervisionRoomStatus;
  statusLabel: string;
  attentionReason: string | null;
};

function formatLastLogFreshness(log: { log_date: string | null; logged_at: string }): string {
  const today = new Date().toISOString().slice(0, 10);
  const logDate = log.log_date ?? log.logged_at.slice(0, 10);
  if (logDate === today) {
    return "today";
  }
  return formatRelativeTime(log.logged_at);
}

export function buildSupervisionRooms(
  rooms: Array<{ id: string; name: string; status: string }>,
  logs: SupervisionLogRow[],
  logsPerRoom = SUPERVISION_LOGS_PER_ROOM,
): SupervisionRoom[] {
  const latestLogByRoom = indexLatestLogsByRoom(logs) as Map<string, SupervisionLogRow>;
  const trendLogsByRoom = indexTrendLogsByRoom(logs, logsPerRoom) as Map<string, SupervisionLogRow[]>;

  return rooms.map((room) => {
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
}

export function toOverviewEnvironmentSummaries(
  rooms: SupervisionRoom[],
): OverviewEnvironmentSummary[] {
  return rooms.map((room) => ({
    roomId: room.id,
    roomName: room.name,
    hasJournalEntries: room.hasJournalEntries,
    status: room.roomStatus,
    statusLabel: room.roomStatusLabel,
    attentionReason: room.attentionReason,
  }));
}
