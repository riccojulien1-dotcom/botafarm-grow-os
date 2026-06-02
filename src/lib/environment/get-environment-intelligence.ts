import { formatRelativeTime } from "@/lib/environment/format-relative-time";
import {
  computeSeriesStats,
  computeTrend,
  evaluateTargetStatus,
  formatMetricValue,
  type MetricTrend,
  type TargetStatus,
} from "@/lib/environment/metric-stats";
import {
  getEcInReference,
  getEcRunoffReference,
  getHumidityReference,
  getPhRange,
  getTemperatureReference,
  getVpdRange,
  type MetricRange,
} from "@/lib/environment/target-ranges";
import { createClient } from "@/lib/supabase/server";

export type EnvironmentMetricKey =
  | "temperature"
  | "humidity"
  | "vpd"
  | "ec_in"
  | "ec_runoff"
  | "ph_in"
  | "ph_runoff";

export type EnvironmentMetricSnapshot = {
  key: EnvironmentMetricKey;
  label: string;
  unit: string;
  accent: "cyan" | "magenta";
  current: number | null;
  currentLabel: string;
  targetLabel: string;
  status: TargetStatus;
  statusLabel: string;
  trend: MetricTrend;
  trendLabel: string;
  series: number[];
  chartLabels: string[];
  min: number | null;
  max: number | null;
  avg: number | null;
  minLabel: string;
  maxLabel: string;
  avgLabel: string;
};

export type EnvironmentLogRow = {
  id: string;
  logDate: string;
  loggedAt: string;
  roomName: string;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ecIn: number | null;
  phIn: number | null;
  ecRunoff: number | null;
  phRunoff: number | null;
};

export type EnvironmentIntelligence = {
  metrics: EnvironmentMetricSnapshot[];
  quality: {
    lastReadingAt: string | null;
    lastReadingLabel: string;
    recordCount: number;
    sourceLabel: string;
  };
  roomContext: { id: string; name: string; status: string } | null;
  history: EnvironmentLogRow[];
};

type EnvLogRow = {
  id: string;
  log_date: string | null;
  logged_at: string;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ec_in: number | null;
  ph_in: number | null;
  ec_runoff: number | null;
  ph_runoff: number | null;
  grow_room_id: string;
  grow_rooms: { name: string; status: string } | { name: string; status: string }[] | null;
};

function resolveRoom(
  relation: EnvLogRow["grow_rooms"],
): { name: string; status: string } | null {
  if (!relation) return null;
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation;
}

function buildMetric(
  config: {
    key: EnvironmentMetricKey;
    label: string;
    unit: string;
    accent: "cyan" | "magenta";
    decimals?: number;
    getRange: (status: string) => MetricRange | null;
    pick: (row: EnvLogRow) => number | null;
  },
  trendRows: EnvLogRow[],
  roomStatus: string,
): EnvironmentMetricSnapshot {
  const series = trendRows
    .map((row) => config.pick(row))
    .filter((value): value is number => value != null);
  const current = series.length ? series[series.length - 1] : null;
  const range = config.getRange(roomStatus);
  const stats = computeSeriesStats(series);
  const trend = computeTrend(series);
  const status = evaluateTargetStatus(
    current,
    range ? { min: range.min, max: range.max } : null,
  );

  return {
    key: config.key,
    label: config.label,
    unit: config.unit,
    accent: config.accent,
    current,
    currentLabel: formatMetricValue(current, config.decimals ?? 2),
    targetLabel: range?.label ?? "—",
    status: status.status,
    statusLabel: status.label,
    trend: trend.trend,
    trendLabel: trend.label,
    series,
    chartLabels: trendRows.map((row) =>
      (row.log_date ?? row.logged_at.slice(0, 10)).slice(5),
    ),
    min: stats.min,
    max: stats.max,
    avg: stats.avg,
    minLabel: formatMetricValue(stats.min, config.decimals ?? 2),
    maxLabel: formatMetricValue(stats.max, config.decimals ?? 2),
    avgLabel: formatMetricValue(stats.avg, config.decimals ?? 2),
  };
}

const METRIC_BUILDERS = [
  {
    key: "temperature" as const,
    label: "Temperature",
    unit: "°C",
    accent: "cyan" as const,
    decimals: 1,
    getRange: getTemperatureReference,
    pick: (row: EnvLogRow) => row.temperature,
  },
  {
    key: "humidity" as const,
    label: "Humidity",
    unit: "%",
    accent: "magenta" as const,
    decimals: 1,
    getRange: getHumidityReference,
    pick: (row: EnvLogRow) => row.humidity,
  },
  {
    key: "vpd" as const,
    label: "VPD",
    unit: "kPa",
    accent: "cyan" as const,
    decimals: 2,
    getRange: getVpdRange,
    pick: (row: EnvLogRow) => row.vpd,
  },
  {
    key: "ec_in" as const,
    label: "EC In",
    unit: "",
    accent: "cyan" as const,
    decimals: 2,
    getRange: getEcInReference,
    pick: (row: EnvLogRow) => row.ec_in,
  },
  {
    key: "ec_runoff" as const,
    label: "EC Out",
    unit: "",
    accent: "magenta" as const,
    decimals: 2,
    getRange: getEcRunoffReference,
    pick: (row: EnvLogRow) => row.ec_runoff,
  },
  {
    key: "ph_in" as const,
    label: "pH In",
    unit: "",
    accent: "cyan" as const,
    decimals: 2,
    getRange: getPhRange,
    pick: (row: EnvLogRow) => row.ph_in,
  },
  {
    key: "ph_runoff" as const,
    label: "pH Out",
    unit: "",
    accent: "magenta" as const,
    decimals: 2,
    getRange: getPhRange,
    pick: (row: EnvLogRow) => row.ph_runoff,
  },
];

export async function getEnvironmentIntelligence(
  userId: string,
): Promise<EnvironmentIntelligence> {
  const supabase = await createClient();

  const [trendResult, countResult, historyResult] = await Promise.all([
    supabase
      .from("daily_logs")
      .select(
        "id,log_date,logged_at,temperature,humidity,vpd,ec_in,ph_in,ec_runoff,ph_runoff,grow_room_id,grow_rooms(name,status)",
      )
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .order("logged_at", { ascending: false })
      .limit(30),
    supabase
      .from("daily_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("daily_logs")
      .select(
        "id,log_date,logged_at,temperature,humidity,vpd,ec_in,ph_in,ec_runoff,ph_runoff,grow_room_id,grow_rooms(name,status)",
      )
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .order("logged_at", { ascending: false })
      .limit(20),
  ]);

  const trendDesc = (trendResult.data ?? []) as EnvLogRow[];
  const trendRows = [...trendDesc].reverse();
  const latest = trendDesc[0] ?? null;
  const latestRoom = latest ? resolveRoom(latest.grow_rooms) : null;
  const roomStatus = latestRoom?.status ?? "Flower";

  const metrics = METRIC_BUILDERS.map((config) =>
    buildMetric(config, trendRows, roomStatus),
  );

  const history: EnvironmentLogRow[] = (historyResult.data ?? []).map((row) => {
    const entry = row as EnvLogRow;
    const room = resolveRoom(entry.grow_rooms);
    return {
      id: entry.id,
      logDate: entry.log_date ?? entry.logged_at.slice(0, 10),
      loggedAt: entry.logged_at,
      roomName: room?.name ?? "Unknown",
      temperature: entry.temperature,
      humidity: entry.humidity,
      vpd: entry.vpd,
      ecIn: entry.ec_in,
      phIn: entry.ph_in,
      ecRunoff: entry.ec_runoff,
      phRunoff: entry.ph_runoff,
    };
  });

  return {
    metrics,
    quality: {
      lastReadingAt: latest?.logged_at ?? null,
      lastReadingLabel: latest
        ? formatRelativeTime(latest.logged_at)
        : "No readings yet",
      recordCount: countResult.count ?? 0,
      sourceLabel: "Manual logs",
    },
    roomContext: latest
      ? {
          id: latest.grow_room_id,
          name: latestRoom?.name ?? "Unknown room",
          status: roomStatus,
        }
      : null,
    history,
  };
}
