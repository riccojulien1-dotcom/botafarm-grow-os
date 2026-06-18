import type { DailyLogRecord } from "@/lib/journal/daily-log-fields";

/** Core V1 metrics — canonical shape for timeline display and future AI analysis. */
export const JOURNAL_V1_METRICS = [
  { key: "temperature", label: "Temp", unit: "°C" },
  { key: "humidity", label: "RH", unit: "%" },
  { key: "vpd", label: "VPD", unit: "kPa" },
  { key: "ec_in", label: "EC in", unit: "" },
  { key: "ec_runoff", label: "EC out", unit: "" },
  { key: "ph_in", label: "pH in", unit: "" },
  { key: "ph_runoff", label: "pH out", unit: "" },
  { key: "irrigation_volume_per_event", label: "Irrigation", unit: " L" },
  { key: "dryback_percent", label: "Dryback", unit: "%" },
] as const;

export type JournalV1MetricKey = (typeof JOURNAL_V1_METRICS)[number]["key"];

export type JournalLogPhoto = {
  id: string;
  daily_log_id: string;
  storage_path: string;
  caption: string | null;
  url: string | null;
};

export type JournalRoomSummary = {
  id: string;
  name: string;
  logCount: number;
  lastLogDate: string | null;
  hasLogToday: boolean;
  daysSinceLastLog: number | null;
};

export type JournalDashboardStats = {
  latestEntryDate: string | null;
  totalLogs: number;
  missingTodayCount: number;
  staleRoomCount: number;
  rooms: JournalRoomSummary[];
  missingTodayRooms: Array<{ id: string; name: string }>;
  staleRooms: Array<{ id: string; name: string; daysSince: number }>;
};

export type JournalMetricDelta = {
  key: JournalV1MetricKey;
  label: string;
  unit: string;
  current: number | null;
  previous: number | null;
  delta: number | null;
  deltaLabel: string | null;
};

export type JournalTimelineLog = DailyLogRecord & {
  grow_room_id: string;
  roomName: string;
};

export type JournalTimelineEntry = {
  log: JournalTimelineLog;
  photos: JournalLogPhoto[];
  metricDeltas: JournalMetricDelta[];
};

/** AI-ready analysis bundle derived from chronological room logs. */
export type JournalAnalysisSeries = {
  roomId: string;
  roomName: string;
  metric: JournalV1MetricKey;
  points: Array<{ date: string; value: number }>;
};

export type JournalAnalysisLog = {
  log_date: string;
  logged_at: string;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ec_in: number | null;
  ph_in: number | null;
  ec_runoff: number | null;
  ph_runoff: number | null;
  irrigation_volume_per_event: number | null;
  dryback_percent: number | null;
  notes: string | null;
};

export type JournalAnalysisBundle = {
  roomId: string;
  roomName: string;
  logs: JournalAnalysisLog[];
  series: JournalAnalysisSeries[];
};
