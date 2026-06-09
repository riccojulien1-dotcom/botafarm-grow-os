import type { SupervisionMetric } from "@/lib/environment/build-supervision-metrics";
import type { SupervisionRoom } from "@/lib/environment/get-environment-supervision-data";
import {
  describeSupervisionMetricIssue,
  pickPrimarySupervisionMetric,
} from "@/lib/environment/environment-room-attention";

export type EnvironmentAlertSeverity = "action" | "drift" | "watch" | "good" | "no_data";

export type EnvironmentAlert = {
  id: string;
  roomId: string;
  roomName: string;
  severity: EnvironmentAlertSeverity;
  message: string;
  metricKey?: SupervisionMetric["key"];
  sortRank: number;
};

const SEVERITY_RANK: Record<EnvironmentAlertSeverity, number> = {
  action: 0,
  drift: 1,
  watch: 2,
  good: 3,
  no_data: 4,
};

function buildRoomAlert(room: SupervisionRoom): EnvironmentAlert {
  if (!room.hasJournalEntries) {
    return {
      id: `${room.id}-no-data`,
      roomId: room.id,
      roomName: room.name,
      severity: "no_data",
      message: `${room.name} — Not enough readings`,
      sortRank: SEVERITY_RANK.no_data,
    };
  }

  if (room.roomStatus === "good") {
    return {
      id: `${room.id}-good`,
      roomId: room.id,
      roomName: room.name,
      severity: "good",
      message: `${room.name} — All metrics within target`,
      sortRank: SEVERITY_RANK.good,
    };
  }

  const primaryMetric = pickPrimarySupervisionMetric(room.metrics);
  const severity: EnvironmentAlertSeverity =
    room.roomStatus === "drift" ? "watch" : room.roomStatus;

  return {
    id: `${room.id}-${primaryMetric?.key ?? "alert"}`,
    roomId: room.id,
    roomName: room.name,
    severity,
    message: `${room.name} — ${
      primaryMetric ? describeSupervisionMetricIssue(primaryMetric) : "Needs review"
    }`,
    metricKey: primaryMetric?.key,
    sortRank: SEVERITY_RANK[severity],
  };
}

export function buildEnvironmentAlerts(rooms: SupervisionRoom[]): EnvironmentAlert[] {
  return rooms
    .map(buildRoomAlert)
    .sort((left, right) => left.sortRank - right.sortRank || left.roomName.localeCompare(right.roomName));
}
