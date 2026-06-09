import { formatRelativeTime } from "@/lib/environment/format-relative-time";
import { formatMetricValue } from "@/lib/environment/metric-stats";
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
  hasLog: boolean;
  lastLogFreshness: string | null;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ecIn: number | null;
  ecRunoff: number | null;
  phIn: number | null;
  phRunoff: number | null;
  climateLine: string | null;
  ecLine: string | null;
  phLine: string | null;
  status: DashboardRoomEnvironmentStatus;
  statusLabel: string;
};

function logHasEnvironmentMetrics(log: DashboardRoomEnvironmentLog): boolean {
  return [
    log.temperature,
    log.humidity,
    log.vpd,
    log.ec_in,
    log.ec_runoff,
    log.ph_in,
    log.ph_runoff,
  ].some((value) => value != null);
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
  log: DashboardRoomEnvironmentLog | null,
  severity: RecommendationSeverity,
): { status: DashboardRoomEnvironmentStatus; statusLabel: string } {
  if (!log || !logHasEnvironmentMetrics(log)) {
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

function joinMetricParts(parts: Array<string | null>): string | null {
  const filtered = parts.filter((part): part is string => Boolean(part));
  return filtered.length ? filtered.join(" · ") : null;
}

function formatClimateLine(log: DashboardRoomEnvironmentLog): string | null {
  return joinMetricParts([
    log.temperature != null ? `Temp ${formatMetricValue(log.temperature, 1)}°C` : null,
    log.humidity != null ? `RH ${formatMetricValue(log.humidity, 0)}%` : null,
    log.vpd != null ? `VPD ${formatMetricValue(log.vpd, 1)} kPa` : null,
  ]);
}

function formatEcLine(log: DashboardRoomEnvironmentLog): string | null {
  return joinMetricParts([
    log.ec_in != null ? `EC in ${formatMetricValue(log.ec_in, 1)}` : null,
    log.ec_runoff != null ? `EC out ${formatMetricValue(log.ec_runoff, 1)}` : null,
  ]);
}

function formatPhLine(log: DashboardRoomEnvironmentLog): string | null {
  return joinMetricParts([
    log.ph_in != null ? `pH in ${formatMetricValue(log.ph_in, 1)}` : null,
    log.ph_runoff != null ? `pH out ${formatMetricValue(log.ph_runoff, 1)}` : null,
  ]);
}

type RoomEnvironmentSource = {
  id: string;
  name: string;
  severity: RecommendationSeverity;
};

export function buildRoomEnvironmentSummaries(
  rooms: RoomEnvironmentSource[],
  latestLogsByRoom: Map<string, DashboardRoomEnvironmentLog>,
): DashboardRoomEnvironment[] {
  return rooms.map((room) => {
    const log = latestLogsByRoom.get(room.id) ?? null;
    const hasLog = log != null && logHasEnvironmentMetrics(log);
    const { status, statusLabel } = resolveEnvironmentStatus(log, room.severity);

    return {
      roomId: room.id,
      roomName: room.name,
      hasLog,
      lastLogFreshness: log ? formatDashboardLogFreshness(log) : null,
      temperature: log?.temperature ?? null,
      humidity: log?.humidity ?? null,
      vpd: log?.vpd ?? null,
      ecIn: log?.ec_in ?? null,
      ecRunoff: log?.ec_runoff ?? null,
      phIn: log?.ph_in ?? null,
      phRunoff: log?.ph_runoff ?? null,
      climateLine: log ? formatClimateLine(log) : null,
      ecLine: log ? formatEcLine(log) : null,
      phLine: log ? formatPhLine(log) : null,
      status,
      statusLabel,
    };
  });
}
